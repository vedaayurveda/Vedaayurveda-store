'use client'

import { useState, useMemo } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/products'

export function ProductListingGrid({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  )

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  )

  return (
    <div>
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      {filtered.length === 0 ? (
        <p className="text-forest/50 text-center py-16">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
