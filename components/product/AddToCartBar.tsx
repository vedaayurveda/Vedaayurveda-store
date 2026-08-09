'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

interface AddToCartBarProps {
  price: number
  onAddToCart: () => void
  disabled?: boolean
  disabledLabel?: string
}

/**
 * Watches the primary in-content Add to Cart button (passed via `anchorRef`
 * from the parent) using IntersectionObserver. This sticky bar slides in
 * from the bottom only once that button scrolls out of view — not sticky
 * from page load, per the Notion doc's finalized behavior.
 */
export function useStickyCartBarVisibility(anchorRef: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = anchorRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [anchorRef])

  return visible
}

export function AddToCartBar({ price, onAddToCart, disabled, disabledLabel }: AddToCartBarProps) {
  return (
    <div
      className="
        fixed bottom-16 md:bottom-0 left-0 right-0 z-30
        bg-surface border-t border-forest/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
        px-4 py-3
        flex items-center justify-between gap-4
      "
    >
      <div>
        <p className="text-forest/50 text-xs">Price</p>
        <p className="font-display text-gold font-semibold text-lg">₹{price.toFixed(0)}</p>
      </div>
      <Button
        variant="filled"
        size="default"
        onClick={onAddToCart}
        disabled={disabled}
        className="flex-1 max-w-xs"
      >
        {disabled ? disabledLabel ?? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  )
}
