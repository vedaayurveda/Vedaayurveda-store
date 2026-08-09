'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { addToCart } from '@/lib/cart'
import { notifyCartUpdated } from '@/lib/useCartCount'
import type { Product } from '@/lib/products'

export function CrossSell({
  excludeProductIds,
  onAdded,
}: {
  excludeProductIds: string[]
  onAdded: () => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/products/cross-sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ excludeProductIds }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
    // Only refetch when the set of excluded ids actually changes in size —
    // avoids refetching on every quantity tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeProductIds.length])

  async function handleQuickAdd(productId: string) {
    setAddingId(productId)
    try {
      await addToCart({ productId, quantity: 1 })
      notifyCartUpdated()
      onAdded()
    } finally {
      setAddingId(null)
    }
  }

  if (products.length === 0) return null

  return (
    <div className="mt-6">
      <h3 className="font-body font-medium text-forest text-sm mb-3">You might also like</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {products.map((product) => {
          const image = product.product_images?.[0]
          return (
            <div key={product.id} className="shrink-0 w-32">
              <Link href={`/products/${product.slug}`}>
                <div className="w-32 h-32 rounded-md overflow-hidden bg-surface-container-low mb-2 relative">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt_text ?? product.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-forest/30 text-xs text-center px-1">
                      {product.name}
                    </div>
                  )}
                </div>
                <p className="text-forest text-xs line-clamp-2 mb-1">{product.name}</p>
                <p className="text-gold text-xs font-semibold mb-2">₹{product.base_price.toFixed(0)}</p>
              </Link>
              <Button
                variant="tonal"
                size="compact"
                className="w-full !h-8 !text-xs"
                onClick={() => handleQuickAdd(product.id)}
                disabled={addingId === product.id}
              >
                {addingId === product.id ? 'Adding…' : '+ Add'}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
