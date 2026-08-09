import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | VedaAyurveda',
  description: 'Ayurvedic wellness tips, guides, and stories from VedaAyurveda.',
}

export default function BlogPage() {
  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
      <h1 className="font-display text-forest text-2xl md:text-4xl font-medium mb-4">
        Our Blog
      </h1>
      <p className="text-forest/60 text-sm md:text-base max-w-md mx-auto">
        We're working on wellness tips, Ayurvedic guides, and stories from VedaAyurveda.
        Check back soon.
      </p>
    </main>
  )
}
