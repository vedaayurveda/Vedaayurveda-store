import type { Metadata } from 'next'
import { Leaf, FlaskConical, ShieldOff, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | VedaAyurveda',
  description:
    'VedaAyurveda is an Ayurvedic wellness brand rooted in tradition, crafted for how you live today.',
}

const points = [
  { icon: Leaf, title: 'Traditional Formulations', description: 'Recipes rooted in classical Ayurvedic texts, not shortcuts.' },
  { icon: FlaskConical, title: 'Lab Tested', description: 'Every batch checked for purity and potency before it ships.' },
  { icon: ShieldOff, title: 'No Harmful Chemicals', description: 'Free from sulfates, parabens, and synthetic fillers.' },
  { icon: MapPin, title: 'Made in India', description: 'Sourced, formulated, and packed close to home in Prayagraj.' },
]

export default function AboutPage() {
  return (
    <main>
        {/* Hero */}
        <section className="bg-forest text-ivory">
          <div className="max-w-container mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
            <p className="font-display text-2xl md:text-4xl mb-3 text-gold">सर्वे सन्तु निरामयाः</p>
            <p className="text-ivory/60 text-sm italic mb-6">Sarve santu niramayaḥ — may all beings be free from illness</p>
            <p className="font-body text-base md:text-lg text-ivory/90 max-w-xl mx-auto">
              VedaAyurveda was built on a simple belief: wellness rooted in centuries-old Ayurvedic
              wisdom shouldn't feel outdated. It should feel like it belongs in your everyday life.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <h2 className="font-display text-forest text-xl md:text-2xl font-medium mb-4">
            Our Story
          </h2>
          <div className="text-forest/80 text-sm leading-relaxed space-y-4">
            <p>
              VedaAyurveda began in Prayagraj, Uttar Pradesh, with a straightforward goal — bring
              genuine, traditionally formulated Ayurvedic products to households without the noise
              of empty marketing claims.
            </p>
            <p>
              Every product we make, from our hair care range to our immunity-boosting
              Chyawanprash, draws on classical Ayurvedic formulations. We're not chasing trends —
              we're bringing forward what's worked for generations, made with today's quality and
              safety standards.
            </p>
            <p>
              What started as a small, independently-run brand is growing one honest product at a
              time — and we're building it the same way we'd want a wellness brand to treat its
              customers: transparently, and without shortcuts.
            </p>
          </div>
        </section>

        {/* Why VedaAyurveda */}
        <section className="bg-surface-container-low">
          <div className="max-w-container mx-auto px-4 md:px-8 py-12 md:py-16">
            <h2 className="font-display text-forest text-xl md:text-2xl font-medium mb-8 text-center">
              What We Stand For
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {points.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center">
                    <Icon size={24} className="text-forest" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-body font-medium text-forest text-sm md:text-base">{title}</h3>
                  <p className="text-forest/60 text-xs md:text-sm">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product range */}
        <section className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
          <h2 className="font-display text-forest text-xl md:text-2xl font-medium mb-4">
            Our Range
          </h2>
          <p className="text-forest/70 text-sm leading-relaxed">
            From hair care (shampoo, hair oil) to daily nutrition (protein powder, Chyawanprash),
            vitality support (Virya Vardhak), diabetes care, and Ayurvedic tea — every product is
            formulated with the same commitment to purity and tradition.
          </p>
        </section>
      </main>
  )
}
