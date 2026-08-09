import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { createOrderShipment } from '@/lib/shiprocket'

interface VerifyPaymentBody {
  orderId: string
  guestSessionId: string | null
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export async function POST(request: Request) {
  const body: VerifyPaymentBody = await request.json()
  const { orderId, guestSessionId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 })
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  })

  if (!isValid) {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Confirm the order belongs to this razorpay_order_id (defense in depth)
  const { data: order } = await admin
    .from('orders')
    .select('id, user_id, status, shipping_full_name, shipping_phone')
    .eq('id', orderId)
    .eq('razorpay_order_id', razorpay_order_id)
    .maybeSingle()

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Avoid double-processing if this route is hit twice (e.g. user refreshes)
  if (order.status === 'paid' || order.status === 'processing') {
    return NextResponse.json({ success: true, orderId: order.id })
  }

  await admin
    .from('orders')
    .update({
      status: 'paid',
      payment_status: 'paid',
      razorpay_payment_id,
    })
    .eq('id', orderId)

  // Decrement stock for each order item
  const { data: orderItems } = await admin
    .from('order_items')
    .select('product_id, variant_id, quantity')
    .eq('order_id', orderId)

  for (const item of orderItems ?? []) {
    if (item.variant_id) {
      await admin.rpc('decrement_variant_stock', {
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
      })
    } else if (item.product_id) {
      await admin.rpc('decrement_product_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      })
    }
  }

  // Clear the cart now that payment is confirmed
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let cartQuery = admin.from('carts').select('id')
  cartQuery = user ? cartQuery.eq('user_id', user.id) : cartQuery.eq('session_id', guestSessionId ?? '')
  const { data: cart } = await cartQuery.maybeSingle()
  if (cart) {
    await admin.from('carts').delete().eq('id', cart.id)
  }

  // Fire off shipment creation. Any failure here is logged and does not
  // affect the payment-confirmed response — the order is already paid.
  await createOrderShipment(admin, orderId)

  // Fire off WhatsApp order confirmation. Wrapped in try/catch so any
  // failure here (bad token, network issue) never breaks the
  // payment-confirmed response — the order is already paid either way.
  try {
    if (order.shipping_phone) {
      const message = `🌿 Veda Ayurveda

Namaste ${order.shipping_full_name},

✅ Your order has been confirmed.

🆔 Order ID: ${order.id}

Thank you for choosing Veda Ayurveda.`

      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: order.shipping_phone,
          message,
        }),
      })
    }
  } catch (err) {
    console.error('WhatsApp order confirmation failed:', err)
  }

  return NextResponse.json({ success: true, orderId: order.id })
}
