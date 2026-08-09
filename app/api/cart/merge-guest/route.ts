import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Called right after login/signup. Moves any items from the guest's
// session_id cart into a real cart tied to their user_id.
export async function POST(request: Request) {
  const { guestSessionId } = await request.json()
  if (!guestSessionId) {
    return NextResponse.json({ error: 'guestSessionId required' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const admin = createAdminClient()

  const { data: guestCart } = await admin
    .from('carts')
    .select('id')
    .eq('session_id', guestSessionId)
    .is('user_id', null)
    .maybeSingle()

  if (!guestCart) {
    return NextResponse.json({ merged: false, reason: 'no guest cart found' })
  }

  // Find or create the user's own cart
  let { data: userCart } = await admin
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!userCart) {
    const { data: newCart, error: createError } = await admin
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single()
    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
    userCart = newCart
  }

  const { data: guestItems } = await admin
    .from('cart_items')
    .select('product_id, variant_id, quantity')
    .eq('cart_id', guestCart.id)

  for (const item of guestItems ?? []) {
    // Upsert-style merge: if the product/variant already exists in the user cart, add quantities
    const { data: existing } = await admin
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', userCart.id)
      .eq('product_id', item.product_id)
      .eq('variant_id', item.variant_id ?? null)
      .maybeSingle()

    if (existing) {
      await admin
        .from('cart_items')
        .update({ quantity: existing.quantity + item.quantity })
        .eq('id', existing.id)
    } else {
      await admin.from('cart_items').insert({
        cart_id: userCart.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      })
    }
  }

  // Clean up the guest cart (items cascade-delete with it)
  await admin.from('carts').delete().eq('id', guestCart.id)

  return NextResponse.json({ merged: true, itemCount: guestItems?.length ?? 0 })
}
