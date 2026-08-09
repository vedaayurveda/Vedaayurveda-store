import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'
import { ProductDetailLayout } from '@/components/product/ProductDetailLayout'
import { RelatedProducts } from '@/components/product/RelatedProducts'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const product = await getProductBySlug(supabase, slug)

  if (!product) return { title: 'Product Not Found | VedaAyurveda' }

  const title = product.meta_title || `${product.name} | VedaAyurveda`
  const description =
    product.meta_description ||
    product.short_description ||
    `Shop ${product.name} at VedaAyurveda.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.product_images[0] ? [product.product_images[0].url] : [],
    },
  }
}

export const revalidate = 3600

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const product = await getProductBySlug(supabase, slug)

  if (!product) notFound()

  const related = await getRelatedProducts(supabase, product.category, product.slug)

  // JSON-LD Product schema — per Notion doc's SEO checklist
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    sku: product.sku,
    image: product.product_images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.base_price,
      availability:
        product.stock_quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <ProductDetailLayout product={product} />

        {related.length > 0 && (
          <div className="max-w-container mx-auto px-4 md:px-8">
            <RelatedProducts products={related} />
          </div>
        )}
      </main>
    </>
  )
}
