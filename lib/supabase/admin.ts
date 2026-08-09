import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// SERVER-ONLY. Bypasses RLS. Never import this in a Client Component.
// Used for: guest cart/order writes, admin operations, webhook handlers.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
