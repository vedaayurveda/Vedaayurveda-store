'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

// Dynamic review feed — any product review that gets "pinned" (from the
// product's review list / admin panel) lands in this array and shows up
// here automatically. Swap this static list for the real pinned-reviews
// data source once that API exists; the row below already renders
// whatever it's given.
const testimonials = [
  {
    id: '1',
    name: 'Priya S.',
    location: 'Lucknow',
    product: 'Ayurvedic Hair Growth Oil',
    quote: 'My hairfall has visibly reduced within a month of using the hair oil.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Rohit K.',
    location: 'Prayagraj',
    product: 'Classic Chyawanprash',
    quote: 'The Chyawanprash tastes exactly like what my grandmother used to make.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Anjali M.',
    location: 'Varanasi',
    product: 'Ayurvedic Hair Growth Oil',
    quote: 'Genuinely impressed by the quality — you can tell it\'s made with care.',
    rating: 4,
  },
  {
    id: '4',
    name: 'Karan V.',
    location: 'Kanpur',
    product: 'Classic Chyawanprash',
    quote: 'Great taste, my kids actually enjoy taking it every morning.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Sneha T.',
    location: 'Varanasi',
    product: 'Ayurvedic Hair Growth Oil',
    quote: 'Packaging felt premium and delivery was quick. Will reorder.',
    rating: 4,
  },
]

function ReviewCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-lg p-6 shadow-[0_8px_24px_rgba(31,94,59,0.10)] w-[280px] sm:w-[320px] shrink-0">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < t.rating ? 'fill-gold text-gold' : 'text-forest/20'}
          />
        ))}
      </div>
      <p className="text-forest/80 text-sm mb-4 italic line-clamp-4">&ldquo;{t.quote}&rdquo;</p>
      <p className="text-forest text-sm font-medium">
        {t.name} <span className="text-forest/50 font-normal">· {t.location}</span>
      </p>
      <p className="text-forest/40 text-xs mt-1 truncate">{t.product}</p>
    </div>
  )
}

export function Testimonials() {
  // Duplicate the row so the marquee can loop seamlessly.
  const track = [...testimonials, ...testimonials]
  // Mobile has no hover, so press-and-hold pauses the marquee there.
  // This only stops the auto-scroll — there's no drag/swipe to manually move it.
  const [held, setHeld] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface-container to-surface-container-low">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(31,94,59,0.08) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(192,155,60,0.07) 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-container mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="font-display text-forest text-2xl md:text-3xl font-medium mb-8 text-center">
          What Our Customers Say
        </h2>
      </div>

      <div
        className="relative overflow-hidden group pb-12 md:pb-16"
        onTouchStart={() => setHeld(true)}
        onTouchEnd={() => setHeld(false)}
        onTouchCancel={() => setHeld(false)}
      >
        <div
          className="flex gap-6 w-max px-4 md:px-8 animate-marquee-rtl group-hover:[animation-play-state:paused]"
          style={held ? { animationPlayState: 'paused' } : undefined}
        >
          {track.map((t, i) => (
            <ReviewCard key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
