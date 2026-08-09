import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// NOTE: requires a `newsletter_signups` table — not in the core schema yet.
// Minimal shape: id uuid pk default gen_random_uuid(), email text unique not null, created_at timestamptz default now()
export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('newsletter_signups')
    .upsert({ email }, { onConflict: 'email' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
