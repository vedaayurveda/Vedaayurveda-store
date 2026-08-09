'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Search as SearchIcon } from 'lucide-react'
import type { Product } from '@/lib/products'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => setResults(data.products ?? []))
        .finally(() => setLoading(false))
    }, 300) // debounce

    return () => clearTimeout(timer)
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col">
      <div className="flex items-center gap-3 px-4 h-14 border-b border-forest/10 shrink-0">
        <SearchIcon size={18} className="text-forest/40 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-forest text-sm placeholder:text-forest/40"
        />
        <button
          onClick={onClose}
          aria-label="Close search"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-forest/5 shrink-0"
        >
          <X size={18} className="text-forest" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <p className="text-forest/40 text-sm text-center py-8">Searching…</p>
        )}

        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <p className="text-forest/40 text-sm text-center py-8">
            No products found for "{query}"
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="divide-y divide-forest/5">
            {results.map((product) => {
              const image = product.product_images?.[0]
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-container-low shrink-0">
                    {image ? (
                      <img src={image.url} alt={image.alt_text ?? product.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-forest text-sm line-clamp-1">{product.name}</p>
                    <p className="text-forest/50 text-xs capitalize">{product.category}</p>
                  </div>
                  <p className="text-gold text-sm font-semibold shrink-0">
                    ₹{product.base_price.toFixed(0)}
                  </p>
                </Link>
              )
            })}
          </div>
        )}

        {query.trim().length < 2 && (
          <p className="text-forest/30 text-sm text-center py-8">
            Start typing to search our products
          </p>
        )}
      </div>
    </div>
  )
}
