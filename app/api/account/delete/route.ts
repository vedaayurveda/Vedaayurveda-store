import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// DPDP Act Module 04.3 (Right to Erasure) — self-serve account deletion,
// no email/support request required.
//
// IMPORTANT — verify before relying on this in production:
// admin.auth.admin.deleteUser() removes the auth.users row. Whether that
// cascades to profiles/orders/addresses/cart_items depends on whether
// those tables' foreign keys were created with `on delete cascade` in
// veda_website_schema.sql (not present in this repo, so not verified here).
// If they were NOT created with cascade, this deletes the login but leaves
// orphaned personal data behind — which would fail this exact DPDP
// requirement. Confirm the FK constraints, or add explicit deletes for
// profiles/orders/addresses/wishlist/cart_items/consent_records below
// before treating this as complete.
//
// Also note: orders tied to GST/financial audit trail obligations may be
// legally required to be retained (Module 04.3 HIGH item) — if so, those
// records should be anonymized (strip name/address/phone) rather than
// hard-deleted, and that exception should be documented and disclosed in
// the Privacy Policy. Not implemented here — flagged, not decided for you.
export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
