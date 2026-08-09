'use client'

import type { ProductVariant } from '@/lib/products'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedId: string | null
  onSelect: (variant: ProductVariant) => void
}

export function VariantSelector({ variants, selectedId, onSelect }: VariantSelectorProps) {
  return (
    <div>
      <p className="text-forest/60 text-xs font-medium mb-2">Select size</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedId
          const outOfStock = variant.stock_quantity <= 0
          return (
            <button
              key={variant.id}
              onClick={() => !outOfStock && onSelect(variant)}
              disabled={outOfStock}
              className={`
                px-4 h-10 rounded-md text-sm font-body font-medium border transition-colors duration-200
                ${
                  isSelected
                    ? 'bg-forest text-ivory border-forest'
                    : 'bg-transparent text-forest border-forest/30 hover:border-forest'
                }
                ${outOfStock ? 'opacity-40 line-through pointer-events-none' : ''}
              `}
            >
              {variant.variant_label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
