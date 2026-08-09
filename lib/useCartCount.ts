'use client'

import { useEffect, useState, useCallback } from 'react'
import { fetchCart } from './cart'

// Fired anywhere in the app after a successful add/update/remove so the
// header badge (and anything else) can refresh without prop drilling.
export const CART_UPDATED_EVENT = 'veda:cart-updated'

export function notifyCartUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT))
  }
}

// Live count of items in the cart (sum of quantities). Reads via the
// existing fetchCart() — no new API routes, no schema changes.
export function useCartCount() {
  const [count, setCount] = useState(0)

  const refresh = useCallback(() => {
    fetchCart()
      .then(({ items }) => {
        setCount(items.reduce((sum, item) => sum + item.quantity, 0))
      })
      .catch(() => {
        // Silently ignore — badge just stays at last known value
      })
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener(CART_UPDATED_EVENT, refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [refresh])

  return count
}
