'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: string
  imageUrl: string
  alt: string
  href: string
}

// Placeholder slides — swap imageUrl for real campaign creatives as they're produced.
// The image itself carries all text/design; clicking a slide opens `href`.
const slides: Slide[] = [
  {
    id: '1',
    imageUrl: 'https://placehold.co/1600x900/1F5E3B/F0F6F0?text=VedaAyurveda',
    alt: 'Ayurvedic Hair Growth Oil — traditional strength, modern care',
    href: '/products/ayurvedic-hair-growth-oil',
  },
  {
    id: '2',
    imageUrl: 'https://placehold.co/1600x900/C09B3C/1F5E3B?text=Chyawanprash',
    alt: 'Classic Chyawanprash, made the way your grandmother trusted',
    href: '/products/classic-ayurvedic-chyawanprash',
  },
  {
    id: '3',
    imageUrl: 'https://placehold.co/1600x900/1F5E3B/C09B3C?text=Sarve+Santu+Niramaya%E1%B8%A5',
    alt: 'सर्वे सन्तु निरामयाः — wellness for all',
    href: '/about',
  },
]

const SLIDE_INTERVAL_MS = 5000
const DOUBLE_TAP_MS = 300

export function HeroCarousel() {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchMoved = useRef(false)
  const lastTapRef = useRef<{ index: number; time: number } | null>(null)

  const goTo = useCallback((i: number) => {
    setActive(((i % slides.length) + slides.length) % slides.length)
    setProgressKey((k) => k + 1)
  }, [])

  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, SLIDE_INTERVAL_MS)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, paused, progressKey])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchMoved.current = false
  }
  function handleTouchMove() {
    touchMoved.current = true
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) {
      touchMoved.current = true
      if (delta < 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  // Requires two taps/clicks in quick succession on the same slide to
  // navigate — prevents accidentally opening the product from a stray
  // tap or from a swipe gesture used to change slides.
  function handleSlideActivate(i: number) {
    if (touchMoved.current) {
      touchMoved.current = false
      return
    }
    const now = Date.now()
    const last = lastTapRef.current
    if (last && last.index === i && now - last.time < DOUBLE_TAP_MS) {
      lastTapRef.current = null
      router.push(slides[i].href)
    } else {
      lastTapRef.current = { index: i, time: now }
    }
  }

  return (
    <section
      className="relative w-full px-4 md:px-8 pt-4 md:pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative w-full max-w-container mx-auto aspect-video overflow-hidden rounded-lg md:rounded-xl bg-forest group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured promotions"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            onClick={() => handleSlideActivate(i)}
            role="link"
            tabIndex={i === active ? 0 : -1}
            aria-label={`${slide.alt} (double-click to open)`}
            className={`
              absolute inset-0 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03] pointer-events-none'}
            `}
            aria-hidden={i !== active}
          >
            <img
              src={slide.imageUrl}
              alt={slide.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}

        {/* Prev / Next arrows — visible on hover (desktop), always present for a11y */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="
            absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full
            bg-black/25 text-white backdrop-blur-sm
            opacity-0 group-hover:opacity-100 focus-visible:opacity-100
            transition-opacity duration-200 hover:bg-black/40 active:scale-95
          "
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="
            absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full
            bg-black/25 text-white backdrop-blur-sm
            opacity-0 group-hover:opacity-100 focus-visible:opacity-100
            transition-opacity duration-200 hover:bg-black/40 active:scale-95
          "
        >
          <ChevronRight size={22} />
        </button>

        {/* Progress-bar indicators — replaces plain dots, shows autoplay timing */}
        <div className="absolute bottom-4 left-4 right-4 md:left-16 md:right-16 flex gap-2 z-10">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className="relative h-1 flex-1 rounded-full bg-white/25 overflow-hidden"
            >
              {i === active && (
                <span
                  key={progressKey}
                  className="absolute inset-y-0 left-0 bg-gold rounded-full"
                  style={{
                    animation: `heroProgress ${SLIDE_INTERVAL_MS}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              )}
              {i < active && <span className="absolute inset-0 bg-gold rounded-full" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
