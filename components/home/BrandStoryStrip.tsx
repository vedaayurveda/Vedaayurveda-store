import Link from 'next/link'

export function BrandStoryStrip() {
  return (
    <section className="bg-forest text-ivory">
      <div className="max-w-container mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="font-display text-2xl md:text-4xl mb-4 text-gold">
            सर्वे सन्तु निरामयाः
          </p>
          <p className="text-ivory/70 text-sm mb-6 italic">Sarve santu niramayaḥ</p>
          <p className="font-body text-base md:text-lg text-ivory/90 mb-6 max-w-md">
            May all beings be free from illness. Rooted in centuries-old Ayurvedic wisdom,
            crafted for how you live today.
          </p>
          <Link
            href="/about"
            className="inline-block text-gold border-b border-gold/50 hover:border-gold transition-colors text-sm font-medium"
          >
            Know Our Story →
          </Link>
        </div>

        <div className="aspect-video md:aspect-square rounded-lg overflow-hidden">
          <img
            src="https://placehold.co/800x800/C09B3C/1F5E3B?text=Herbs+%26+Tradition"
            alt="Traditional Ayurvedic herbs and preparation"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
