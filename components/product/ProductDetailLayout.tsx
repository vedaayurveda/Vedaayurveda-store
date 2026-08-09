import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductBuyBox } from '@/components/product/ProductBuyBox'
import { ProductAccordion } from '@/components/product/ProductAccordion'
import { ProductReviews } from '@/components/product/ProductReviews'
import type { ProductDetail } from '@/lib/products'

// Server component: pure layout, no interactivity of its own.
// All state (variant, quantity, cart) lives in the client ProductBuyBox.
export function ProductDetailLayout({ product }: { product: ProductDetail }) {
  return (
    <div className="md:grid md:grid-cols-2 md:gap-12 md:max-w-container md:mx-auto md:px-8 md:py-8">
      {/* 1. Image gallery — top on mobile, sticky left column on desktop */}
      <div className="md:sticky md:top-24 md:self-start">
        <ProductGallery images={product.product_images} productName={product.name} />
      </div>

      <div>
        <ProductBuyBox product={product} />

        <div className="px-4 md:px-0">
          {/* 6. Detailed info accordion — Description, Ingredients, How to Use, Benefits */}
          <ProductAccordion product={product} />

          {/* 7. Reviews/Ratings */}
          <ProductReviews />
        </div>
      </div>
    </div>
  )
}
