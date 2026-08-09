import type { Metadata } from 'next'
import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | VedaAyurveda',
  description: 'Get in touch with VedaAyurveda for questions, support, or feedback.',
}

export default function ContactPage() {
  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="text-center mb-10">
          <h1 className="font-display text-forest text-2xl md:text-4xl font-medium mb-2">
            Get in Touch
          </h1>
          <p className="text-forest/60 text-sm max-w-md mx-auto">
            Questions about a product, your order, or a franchise opportunity? We'd love to hear
            from you.
          </p>
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-8 max-w-4xl mx-auto">
          {/* Contact details */}
          <div className="space-y-4 mb-8 md:mb-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-forest" />
              </div>
              <div>
                <p className="text-forest text-sm font-medium">Location</p>
                <p className="text-forest/60 text-xs">Prayagraj, Uttar Pradesh, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-forest" />
              </div>
              <div>
                <p className="text-forest text-sm font-medium">Email</p>
                <p className="text-forest/60 text-xs">hello@vedaayurveda.com</p>
              </div>
            </div>

            <a
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-forest" />
              </div>
              <div>
                <p className="text-forest text-sm font-medium">WhatsApp</p>
                <p className="text-forest/60 text-xs">Chat with our team</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </main>
  )
}
