import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAllActiveProducts } from '@/lib/products'
import { ProductListingGrid } from '@/components/product/ProductListingGrid'

export const metadata: Metadata = {
  title: 'Shop All Products | VedaAyurveda',
  description:
    'Browse our full range of Ayurvedic wellness products — shampoo, hair oil, protein powder, Chyawanprash, and more.',
}

// Revalidate periodically so newly added/edited products show up without a full redeploy.
export const revalidate = 3600

export default async function ProductsPage() {
  const supabase = await createClient()
  const products = await getAllActiveProducts(supabase)

  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-forest text-2xl md:text-4xl font-medium mb-2">
          Shop Our Range
        </h1>
        <p className="text-forest/60 text-sm md:text-base">
          {products.length} product{products.length === 1 ? '' : 's'}, rooted in Ayurvedic
          tradition.
        </p>
      </div>

      <ProductListingGrid products={products} />
    </main>
  )
}
