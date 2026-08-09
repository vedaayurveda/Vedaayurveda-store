import { getOrCreateGuestSessionId } from './guestSession'

interface AddToCartParams {
  productId: string
  variantId?: string | null
  quantity: number
}

export async function addToCart({ productId, variantId, quantity }: AddToCartParams) {
  const guestSessionId = getOrCreateGuestSessionId()

  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      variantId: variantId ?? null,
      quantity,
      guestSessionId,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Failed to add to cart')
  }

  return res.json()
}

export interface CartItemRow {
  id: string
  quantity: number
  product_id: string
  variant_id: string | null
  products: {
    id: string
    name: string
    slug: string
    base_price: number
    compare_at_price: number | null
    stock_quantity: number
    has_variants: boolean
    product_images: { url: string; alt_text: string | null; sort_order: number }[]
  }
  product_variants: {
    id: string
    variant_label: string
    price: number
    compare_at_price: number | null
    stock_quantity: number
  } | null
}

export async function fetchCart(): Promise<{ cartId: string | null; items: CartItemRow[] }> {
  const guestSessionId = getOrCreateGuestSessionId()
  const res = await fetch(`/api/cart?guestSessionId=${encodeURIComponent(guestSessionId)}`)

  if (!res.ok) {
    throw new Error('Failed to load cart')
  }
  return res.json()
}

export async function updateCartItem(itemId: string, quantity: number) {
  const guestSessionId = getOrCreateGuestSessionId()

  const res = await fetch('/api/cart', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, quantity, guestSessionId }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Failed to update cart item')
  }
  return res.json()
}

export async function removeCartItem(itemId: string) {
  const guestSessionId = getOrCreateGuestSessionId()

  const res = await fetch('/api/cart', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, guestSessionId }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Failed to remove cart item')
  }
  return res.json()
}
