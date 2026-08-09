export interface OrderItemDetail {
  id: string
  product_name: string
  variant_label: string | null
  sku: string
  unit_price: number
  quantity: number
  line_total: number
}

export interface OrderDetail {
  id: string
  order_number: string
  status: string
  payment_method: string | null
  payment_status: string
  subtotal: number
  shipping_fee: number
  discount_amount: number
  total: number
  shipping_full_name: string
  shipping_phone: string
  shipping_line1: string
  shipping_line2: string | null
  shipping_city: string
  shipping_state: string
  shipping_pincode: string
  tracking_url: string | null
  created_at: string
  order_items: OrderItemDetail[]
}

export interface OrderSummaryRow {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  order_items: { id: string }[]
}

export async function getOrdersForUser(supabase: any, userId: string): Promise<OrderSummaryRow[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at, order_items ( id )')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch orders:', error.message)
    return []
  }
  return data ?? []
}

export async function getOrderById(supabase: any, orderId: string): Promise<OrderDetail | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `id, order_number, status, payment_method, payment_status, subtotal, shipping_fee,
       discount_amount, total, shipping_full_name, shipping_phone, shipping_line1,
       shipping_line2, shipping_city, shipping_state, shipping_pincode, tracking_url, created_at,
       order_items ( id, product_name, variant_label, sku, unit_price, quantity, line_total )`
    )
    .eq('id', orderId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch order:', error.message)
    return null
  }
  return data
}
