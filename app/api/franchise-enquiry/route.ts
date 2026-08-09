import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const body = await request.json()
  const { fullName, phone, email, city, investmentCapacity, message } = body

  if (!fullName || !phone || !city) {
    return NextResponse.json({ error: 'Name, phone, and city are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('franchise_enquiries').insert({
    full_name: fullName,
    phone,
    email: email || null,
    city,
    investment_capacity: investmentCapacity || null,
    message: message || null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
