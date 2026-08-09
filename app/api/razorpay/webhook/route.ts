import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay'
import { createOrderShipment } from '@/lib/shiprocket'

// Configure this URL in the Razorpay Dashboard → Webhooks, subscribed to
// "payment.captured" and "payment.failed". This acts as the source of truth
// even if the client never returns to call /api/checkout/verify-payment
// (e.g. tab closed right after payment).
export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature || !verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)
  const admin = createAdminClient()

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const razorpayOrderId = payment.order_id

    const { data: order } = await admin
      .from('orders')
      .select('id, status')
      .eq('razorpay_order_id', razorpayOrderId)
      .maybeSingle()

    if (order && order.status !== 'paid' && order.status !== 'processing') {
      await admin
        .from('orders')
        .update({
          status: 'paid',
          payment_status: 'paid',
          razorpay_payment_id: payment.id,
        })
        .eq('id', order.id)

      // Stock decrement is idempotent-safe here too, in case verify-payment
      // never ran client-side.
      const { data: orderItems } = await admin
        .from('order_items')
        .select('product_id, variant_id, quantity')
        .eq('order_id', order.id)

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

      // Backup path: if verify-payment never ran client-side (tab closed
      // right after payment), this ensures the shipment still gets created.
      // createOrderShipment() is a no-op if shiprocket_shipment_id is already set.
      await createOrderShipment(admin, order.id)
    }
  }

  if (event.event === 'payment.failed') {
    const payment = event.payload.payment.entity
    await admin
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('razorpay_order_id', payment.order_id)
  }

  return NextResponse.json({ received: true })
}
