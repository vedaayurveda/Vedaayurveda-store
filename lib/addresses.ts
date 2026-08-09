export interface Address {
  id: string
  full_name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
}

export async function getUserAddresses(supabase: any): Promise<Address[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('addresses')
    .select('id, full_name, phone, line1, line2, city, state, pincode, country, is_default')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })

  if (error) {
    console.error('Failed to fetch addresses:', error.message)
    return []
  }
  return data ?? []
}
