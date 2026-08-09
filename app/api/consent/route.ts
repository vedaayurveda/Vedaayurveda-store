import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// Requires the `consent_records` table — see supabase_consent_table.sql
export async function POST(request: Request) {
  const { purpose, granted, guestSessionId, policyVersion, purposeTextShown } = await request.json()

  if (!purpose || typeof granted !== 'boolean' || !policyVersion || !purposeTextShown) {
    return NextResponse.json({ error: 'Missing required consent fields' }, { status: 400 })
  }

  // Prefer the authenticated user from the session over any client-supplied
  // userId — never trust a userId passed in the request body for this table.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null
  const userAgent = request.headers.get('user-agent') ?? null

  const admin = createAdminClient()
  const { error } = await admin.from('consent_records').insert({
    user_id: user?.id ?? null,
    guest_session_id: user ? null : (guestSessionId ?? null),
    purpose,
    granted,
    policy_version: policyVersion,
    purpose_text_shown: purposeTextShown,
    ip_address: ip,
    user_agent: userAgent,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
