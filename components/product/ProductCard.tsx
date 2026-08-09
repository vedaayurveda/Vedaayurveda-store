'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { addToCart } from '@/lib/cart'
import { notifyCartUpdated } from '@/lib/useCartCount'
import { useWishlist } from '@/lib/useWishlist'
import type { Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  const image = product.product_images?.[0]
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.base_price
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.base_price) / product.compare_at_price!) * 100)
    : 0

  const { isSaved, toggle } = useWishlist()
  const saved = isSaved(product.id)

  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  // Note: the grid-level Product type doesn't carry has_variants, so this
  // quick-add always targets the base product (no variantId). That matches
  // the existing /api/cart POST contract (variantId is optional) — safe for
  // simple products; buyers with variant products can refine on the PDP.
  async function handleQuickAdd() {
    setAdding(true)
    try {
      await addToCart({ productId: product.id, quantity: 1 })
      notifyCartUpdated()
      setAdded(true)
      setTimeout(() => setAdded(false), 1600)
    } catch {
      // Silently ignore — buyer can still add via the PDP
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card glass className="overflow-hidden group relative">
      {/* Wishlist heart */}
      <button
        onClick={() => toggle(product.id)}
        aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={saved}
        className="
          absolute top-2 right-2 z-10
          w-8 h-8 flex items-center justify-center rounded-full
          bg-white/85 backdrop-blur-sm shadow-sm
          hover:scale-110 active:scale-95 transition-transform
        "
      >
        <Heart
          size={16}
          className={saved ? 'fill-red-500 text-red-500' : 'text-forest/60'}
          strokeWidth={2}
        />
      </button>

      {/* Badges — derived from real product data, not invented */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {product.is_featured && (
          <span className="px-2 py-0.5 rounded-full bg-forest text-ivory text-[10px] font-semibold uppercase tracking-wide shadow-sm">
            Bestseller
          </span>
        )}
        {hasDiscount && (
          <span className="px-2 py-0.5 rounded-full bg-gold text-forest text-[10px] font-semibold uppercase tracking-wide shadow-sm">
            {discountPct}% Off
          </span>
        )}
      </div>

      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square w-full overflow-hidden bg-surface-container-low relative">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt_text ?? product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-forest/30 font-display">
              {product.name}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-body text-sm md:text-base text-forest line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display text-gold font-semibold text-lg">
            ₹{product.base_price.toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-forest/40 line-through">
              ₹{product.compare_at_price!.toFixed(0)}
            </span>
          )}
        </div>

        <Button
          variant="tonal"
          size="compact"
          className="w-full"
          onClick={handleQuickAdd}
          disabled={adding}
        >
          {adding ? 'Adding…' : added ? 'Added ✓' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  )
}
