import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const body = await request.json()
  const { fullName, email, phone, subject, message } = body

  if (!fullName || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('contact_messages').insert({
    full_name: fullName,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
