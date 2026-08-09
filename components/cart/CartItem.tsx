'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import type { CartItemRow } from '@/lib/cart'

interface CartItemProps {
  item: CartItemRow
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { products: product, product_variants: variant } = item
  const price = variant ? variant.price : product.base_price
  const compareAt = variant ? variant.compare_at_price : product.compare_at_price
  const stock = variant ? variant.stock_quantity : product.stock_quantity
  const image = product.product_images?.[0]
  const lineTotal = price * item.quantity
  const outOfStock = stock <= 0

  return (
    <div className="flex gap-3 py-4 border-b border-forest/10">
      <Link href={`/products/${product.slug}`} className="shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden bg-surface-container-low relative">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt_text ?? product.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-forest/30 text-xs text-center px-1">
              {product.name}
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-body text-sm md:text-base text-forest line-clamp-2">{product.name}</h3>
            </Link>
            {variant && <p className="text-forest/50 text-xs mt-0.5">{variant.variant_label}</p>}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-forest/40 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {outOfStock && (
          <p className="text-red-500 text-xs mt-1">Out of stock — please remove to check out</p>
        )}

        <div className="flex items-end justify-between mt-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => onQuantityChange(item.id, q)}
            min={1}
            max={Math.max(stock, 1)}
          />

          <div className="text-right">
            <p className="font-display text-gold font-semibold text-sm md:text-base">
              ₹{lineTotal.toFixed(0)}
            </p>
            {compareAt != null && compareAt > price && (
              <p className="text-forest/40 text-xs line-through">
                ₹{(compareAt * item.quantity).toFixed(0)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
