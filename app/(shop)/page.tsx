import { createClient } from '@/lib/supabase/server'
import { getFeaturedProducts } from '@/lib/products'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { TrustStrip } from '@/components/home/TrustStrip'
import { ProductShowcase } from '@/components/home/ProductShowcase'
import { BrandStoryStrip } from '@/components/home/BrandStoryStrip'
import { WhyVedaAyurveda } from '@/components/home/WhyVedaAyurveda'
import { Testimonials } from '@/components/home/Testimonials'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'

// Cache the homepage's product data so repeated visits don't hit Supabase
// on every request (matches the /products listing page's strategy).
export const revalidate = 3600

export default async function HomePage() {
  const supabase = await createClient()
  const products = await getFeaturedProducts(supabase)

  return (
    <main>
      {/* Funnel logic: Trust → Product → Story → Differentiation → Social Proof → Capture */}
      <HeroCarousel />
      <TrustStrip />
      <ProductShowcase products={products} />
      <BrandStoryStrip />
      <WhyVedaAyurveda />
      <Testimonials />
      <NewsletterSignup />
    </main>
  )
}
