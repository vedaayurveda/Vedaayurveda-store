import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/products'

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-forest/10">
      <h2 className="font-display text-forest text-xl md:text-2xl font-medium mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
