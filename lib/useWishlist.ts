'use client'

import { useCallback, useEffect, useState } from 'react'

const WISHLIST_KEY = 'veda_wishlist'
const WISHLIST_EVENT = 'veda:wishlist-updated'

function readWishlist(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeWishlist(ids: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event(WISHLIST_EVENT))
}

// Simple client-only "save for later" heart toggle. Not synced to Supabase —
// purely a UX nicety layered on top of the existing product/cart system.
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    setIds(readWishlist())
    const onUpdate = () => setIds(readWishlist())
    window.addEventListener(WISHLIST_EVENT, onUpdate)
    return () => window.removeEventListener(WISHLIST_EVENT, onUpdate)
  }, [])

  const isSaved = useCallback((productId: string) => ids.includes(productId), [ids])

  const toggle = useCallback((productId: string) => {
    const current = readWishlist()
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    writeWishlist(next)
  }, [])

  return { ids, isSaved, toggle }
}
