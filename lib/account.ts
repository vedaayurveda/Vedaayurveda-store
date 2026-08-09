export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  created_at: string
}

export async function getCurrentProfile(supabase: any): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, created_at')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch profile:', error.message)
    return null
  }
  return data
}

export interface OrderListItem {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  order_items: { id: string; product_name: string; quantity: number }[]
}

export async function getUserOrders(supabase: any): Promise<OrderListItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at, order_items(id, product_name, quantity)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch orders:', error.message)
    return []
  }
  return data ?? []
}
