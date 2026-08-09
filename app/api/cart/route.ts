import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const { productId, variantId, quantity, guestSessionId } = await request.json()

  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'productId and a valid quantity are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()

  // Find or create the right cart — user cart if logged in, else guest session cart
  let cartQuery = admin.from('carts').select('id')
  cartQuery = user ? cartQuery.eq('user_id', user.id) : cartQuery.eq('session_id', guestSessionId)
  let { data: cart } = await cartQuery.maybeSingle()

  if (!cart) {
    const { data: newCart, error: createError } = await admin
      .from('carts')
      .insert(user ? { user_id: user.id } : { session_id: guestSessionId })
      .select('id')
      .single()
    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
    cart = newCart
  }

  // If this product/variant is already in the cart, bump quantity instead of duplicating
  const { data: existingItem } = await admin
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .eq('variant_id', variantId ?? null)
    .maybeSingle()

  if (existingItem) {
    const { error: updateError } = await admin
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
  } else {
    const { error: insertError } = await admin.from('cart_items').insert({
      cart_id: cart.id,
      product_id: productId,
      variant_id: variantId,
      quantity,
    })
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, cartId: cart.id })
}

// Helper shared by GET/PATCH/DELETE — resolves the current cart id for
// either the logged-in user or a guest session, without creating one.
async function resolveCartId(
  admin: ReturnType<typeof createAdminClient>,
  userId: string | undefined,
  guestSessionId: string | null
) {
  let query = admin.from('carts').select('id')
  query = userId ? query.eq('user_id', userId) : query.eq('session_id', guestSessionId ?? '')
  const { data } = await query.maybeSingle()
  return data?.id ?? null
}

// GET /api/cart?guestSessionId=... — returns full cart with product/variant details for rendering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const guestSessionId = searchParams.get('guestSessionId')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const cartId = await resolveCartId(admin, user?.id, guestSessionId)

  if (!cartId) {
    return NextResponse.json({ items: [] })
  }

  const { data: items, error } = await admin
    .from('cart_items')
    .select(
      `id, quantity, product_id, variant_id,
       products:product_id ( id, name, slug, base_price, compare_at_price, stock_quantity, has_variants,
         product_images ( url, alt_text, sort_order ) ),
       product_variants:variant_id ( id, variant_label, price, compare_at_price, stock_quantity )`
    )
    .eq('cart_id', cartId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ cartId, items: items ?? [] })
}

// PATCH /api/cart — body: { itemId, quantity, guestSessionId }
export async function PATCH(request: Request) {
  const { itemId, quantity, guestSessionId } = await request.json()

  if (!itemId || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'itemId and a valid quantity are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const cartId = await resolveCartId(admin, user?.id, guestSessionId)

  if (!cartId) {
    return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
  }

  // Scope the update to this cart so one guest/user can't edit another's cart item by id
  const { error } = await admin
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('cart_id', cartId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// DELETE /api/cart — body: { itemId, guestSessionId }
export async function DELETE(request: Request) {
  const { itemId, guestSessionId } = await request.json()

  if (!itemId) {
    return NextResponse.json({ error: 'itemId is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const cartId = await resolveCartId(admin, user?.id, guestSessionId)

  if (!cartId) {
    return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
  }

  const { error } = await admin
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('cart_id', cartId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
