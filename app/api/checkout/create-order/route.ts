import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpayInstance, generateOrderNumber } from '@/lib/razorpay'
import { createOrderShipment } from '@/lib/shiprocket'

interface CreateOrderBody {
  guestSessionId: string | null
  guestEmail?: string
  guestPhone?: string
  shippingAddress: {
    fullName: string
    phone: string
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: 'razorpay' | 'cod'
}

const FREE_SHIPPING_THRESHOLD = 499
const STANDARD_SHIPPING_FEE = 60

export async function POST(request: Request) {
  const body: CreateOrderBody = await request.json()
  const { guestSessionId, guestEmail, guestPhone, shippingAddress, paymentMethod } = body

  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.pincode) {
    return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()

  // 1. Resolve the current cart
  let cartQuery = admin.from('carts').select('id')
  cartQuery = user ? cartQuery.eq('user_id', user.id) : cartQuery.eq('session_id', guestSessionId ?? '')
  const { data: cart } = await cartQuery.maybeSingle()

  if (!cart) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // 2. Load cart items with live product/variant pricing (never trust client-sent prices)
  const { data: cartItems, error: itemsError } = await admin
    .from('cart_items')
    .select(
      `id, quantity, product_id, variant_id,
       products:product_id ( id, name, sku, base_price, stock_quantity, is_active ),
       product_variants:variant_id ( id, variant_label, price, stock_quantity, sku_suffix )`
    )
    .eq('cart_id', cart.id)

  if (itemsError || !cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // 3. Validate stock + compute totals server-side
  for (const item of cartItems as any[]) {
    const stock = item.product_variants ? item.product_variants.stock_quantity : item.products.stock_quantity
    if (!item.products.is_active || stock < item.quantity) {
      return NextResponse.json(
        { error: `${item.products.name} is no longer available in the requested quantity` },
        { status: 409 }
      )
    }
  }

  const subtotal = (cartItems as any[]).reduce((sum, item) => {
    const price = item.product_variants ? item.product_variants.price : item.products.base_price
    return sum + price * item.quantity
  }, 0)
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
  const total = subtotal + shippingFee

  // 4. Create the order (status: pending until payment confirms, or immediately
  //    processing for COD)
  const orderNumber = generateOrderNumber()

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      guest_email: user ? null : guestEmail ?? null,
      guest_phone: user ? null : guestPhone ?? shippingAddress.phone,
      shipping_full_name: shippingAddress.fullName,
      shipping_phone: shippingAddress.phone,
      shipping_line1: shippingAddress.line1,
      shipping_line2: shippingAddress.line2 ?? null,
      shipping_city: shippingAddress.city,
      shipping_state: shippingAddress.state,
      shipping_pincode: shippingAddress.pincode,
      subtotal,
      shipping_fee: shippingFee,
      total,
      status: paymentMethod === 'cod' ? 'processing' : 'pending',
      payment_method: paymentMethod,
      payment_status: 'unpaid',
    })
    .select('id, order_number')
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'Failed to create order' }, { status: 500 })
  }

  // 5. Snapshot order items
  const orderItemRows = (cartItems as any[]).map((item) => {
    const price = item.product_variants ? item.product_variants.price : item.products.base_price
    const sku = item.product_variants
      ? `${item.products.sku}${item.product_variants.sku_suffix ?? ''}`
      : item.products.sku
    return {
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.products.name,
      variant_label: item.product_variants?.variant_label ?? null,
      sku,
      unit_price: price,
      quantity: item.quantity,
      line_total: price * item.quantity,
    }
  })

  const { error: orderItemsError } = await admin.from('order_items').insert(orderItemRows)
  if (orderItemsError) {
    return NextResponse.json({ error: orderItemsError.message }, { status: 500 })
  }

  // 6. COD: done here — clear cart, kick off shipment creation, and return
  if (paymentMethod === 'cod') {
    await admin.from('carts').delete().eq('id', cart.id)
    await createOrderShipment(admin, order.id)
    return NextResponse.json({ orderId: order.id, orderNumber: order.order_number, paymentMethod: 'cod' })
  }

  // 7. Online payment: create a Razorpay order, keep the cart until payment verifies
  const razorpay = getRazorpayInstance()
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100), // paise
    currency: 'INR',
    receipt: order.order_number,
    notes: { veda_order_id: order.id },
  })

  await admin.from('orders').update({ razorpay_order_id: razorpayOrder.id }).eq('id', order.id)

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.order_number,
    paymentMethod: 'razorpay',
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  })
}
