import type { Metadata } from 'next'
import { IndianRupee, MapPin, FileCheck, Users } from 'lucide-react'
import { FranchiseEnquiryForm } from '@/components/franchise/FranchiseEnquiryForm'

export const metadata: Metadata = {
  title: 'Franchise / Partner With Us | VedaAyurveda',
  description:
    'Partner with VedaAyurveda — an Ayurvedic wellness retail counter opportunity starting from ₹1 lakh.',
}

const highlights = [
  {
    icon: IndianRupee,
    title: 'Low Investment',
    description: 'Retail counter model starting from ₹1-3 lakh, designed to be accessible.',
  },
  {
    icon: FileCheck,
    title: 'Transparent Agreement',
    description: 'Clear franchise disclosure document and agreement — no hidden terms.',
  },
  {
    icon: Users,
    title: 'Growing Brand',
    description: 'Be part of an Ayurvedic wellness brand built on trust and tradition.',
  },
  {
    icon: MapPin,
    title: 'Local Support',
    description: 'Based in Prayagraj, with hands-on support for partners getting started.',
  },
]

export default function FranchisePage() {
  return (
    <main>
        {/* Hero */}
        <section className="bg-forest text-ivory">
          <div className="max-w-container mx-auto px-4 md:px-8 py-16 md:py-20 text-center">
            <h1 className="font-display text-2xl md:text-4xl font-medium mb-4">
              Partner With VedaAyurveda
            </h1>
            <p className="text-ivory/80 text-sm md:text-base max-w-xl mx-auto">
              Bring authentic Ayurvedic wellness to your city. Our retail counter franchise model
              is built to be accessible, transparent, and rooted in a brand people trust.
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="max-w-container mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center">
                  <Icon size={24} className="text-forest" strokeWidth={1.75} />
                </div>
                <h3 className="font-body font-medium text-forest text-sm md:text-base">{title}</h3>
                <p className="text-forest/60 text-xs md:text-sm">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Investment model */}
        <section className="bg-surface-container-low">
          <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
            <h2 className="font-display text-forest text-xl md:text-2xl font-medium mb-4">
              Investment Model
            </h2>
            <p className="text-forest/70 text-sm leading-relaxed mb-6">
              Our retail counter franchise starts at an investment of{' '}
              <span className="text-forest font-medium">₹1-3 lakh</span>, currently open for
              partners in and around the Prayagraj jurisdiction. Every partner receives a detailed
              Franchise Disclosure Document outlining terms, support, and expectations before
              signing on.
            </p>
            <p className="text-forest/50 text-xs">
              Interested in a location outside Prayagraj? Reach out below — we're expanding.
            </p>
          </div>
        </section>

        {/* Enquiry form */}
        <section className="max-w-md mx-auto px-4 md:px-8 py-12 md:py-16">
          <h2 className="font-display text-forest text-xl md:text-2xl font-medium mb-6 text-center">
            Get in Touch
          </h2>
          <FranchiseEnquiryForm />
        </section>
    </main>
  )
}
