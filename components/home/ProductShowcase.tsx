import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/lib/products'

export function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-high py-12 md:py-16">
      {/* Soft forest-tinted glow, restrained — the "30% deep tone" plane
          the glass ProductCards float over. Not a photo, just color depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 10%, rgba(31,94,59,0.10) 0%, transparent 40%), radial-gradient(circle at 85% 90%, rgba(192,155,60,0.08) 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <h2 className="font-display text-forest text-2xl md:text-3xl font-medium">
            Shop Our Range
          </h2>
          <Link
            href="/products"
            className="text-sm text-forest/70 hover:text-forest underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-forest/50 text-center py-12">
            Products will appear here once added.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
