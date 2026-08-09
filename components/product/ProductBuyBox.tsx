'use client'

import { useState, useRef, useMemo } from 'react'
import { Leaf, Truck, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { VariantSelector } from './VariantSelector'
import { AddToCartBar, useStickyCartBarVisibility } from './AddToCartBar'
import { addToCart } from '@/lib/cart'
import { notifyCartUpdated } from '@/lib/useCartCount'
import type { ProductDetail, ProductVariant } from '@/lib/products'

export function ProductBuyBox({ product }: { product: ProductDetail }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.has_variants ? product.product_variants[0] ?? null : null
  )
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const anchorRef = useRef<HTMLDivElement>(null)
  const showStickyBar = useStickyCartBarVisibility(anchorRef)

  const price = selectedVariant ? selectedVariant.price : product.base_price
  const compareAt = selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price
  const hasDiscount = compareAt != null && compareAt > price

  const stock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity
  const outOfStock = stock <= 0

  const canBuy = useMemo(() => {
    if (product.has_variants && !selectedVariant) return false
    return !outOfStock
  }, [product.has_variants, selectedVariant, outOfStock])

  async function handleAddToCart() {
    setError(null)
    setAdding(true)
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        quantity,
      })
      setAdded(true)
      notifyCartUpdated()
      setTimeout(() => setAdded(false), 2000)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setAdding(false)
    }
  }

  return (
    <>
      <div className="px-4 md:px-0 pt-4 pb-24 md:pb-8">
        {/* Title + price */}
        <h1 className="font-display text-forest text-xl md:text-3xl font-medium mb-1">
          {product.name}
        </h1>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display text-gold font-semibold text-2xl">
            ₹{price.toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-forest/40 line-through text-base">
              ₹{compareAt!.toFixed(0)}
            </span>
          )}
        </div>

        {/* Quick trust row */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-forest/10">
          <div className="flex items-center gap-1.5 text-forest/70 text-xs">
            <Leaf size={14} /> Ayurvedic
          </div>
          <div className="flex items-center gap-1.5 text-forest/70 text-xs">
            <BadgeCheck size={14} /> FSSAI
          </div>
          <div className="flex items-center gap-1.5 text-forest/70 text-xs">
            <Truck size={14} /> COD Available
          </div>
        </div>

        {/* Variant selector */}
        {product.has_variants && product.product_variants.length > 0 && (
          <div className="mb-5">
            <VariantSelector
              variants={product.product_variants}
              selectedId={selectedVariant?.id ?? null}
              onSelect={setSelectedVariant}
            />
          </div>
        )}

        {/* Quantity + primary Add to Cart (the "anchor" the sticky bar watches) */}
        <div ref={anchorRef} className="flex items-center gap-3 mb-2">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <Button
            variant="filled"
            size="default"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!canBuy || adding}
          >
            {outOfStock ? 'Out of Stock' : adding ? 'Adding…' : added ? 'Added ✓' : 'Add to Cart'}
          </Button>
        </div>
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

        {/* Short description — always visible */}
        {product.short_description && (
          <p className="text-forest/70 text-sm mt-4 leading-relaxed">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Sticky bar — only visible once the anchor scrolls out of view */}
      {showStickyBar && (
        <AddToCartBar
          price={price}
          onAddToCart={handleAddToCart}
          disabled={!canBuy || adding}
          disabledLabel={outOfStock ? 'Out of Stock' : undefined}
        />
      )}
    </>
  )
}
