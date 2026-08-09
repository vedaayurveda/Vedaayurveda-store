'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Search, ShoppingCart, User } from 'lucide-react'
import { NavDrawer } from './NavDrawer'
import { SearchOverlay } from './SearchOverlay'
import { useCartCount } from '@/lib/useCartCount'

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const cartCount = useCartCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`
          sticky top-0 z-40 transition-all duration-300
          ${scrolled
            ? 'bg-surface/80 backdrop-blur-md shadow-md border-b border-forest/5'
            : 'bg-surface border-b border-transparent'}
        `}
      >
        <div className="max-w-container mx-auto px-4 md:px-8 h-14 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-forest/5 active:scale-95 transition-all"
            >
              <Menu size={22} className="text-forest" strokeWidth={1.75} />
            </button>
            <Link
              href="/"
              className="font-display text-forest text-lg md:text-2xl font-medium tracking-tight"
            >
              VedaAyurveda
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-forest/5 active:scale-95 transition-all"
            >
              <Search size={20} className="text-forest" strokeWidth={1.75} />
            </button>
            <Link
              href="/cart"
              aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-forest/5 active:scale-95 transition-all"
            >
              <ShoppingCart size={20} className="text-forest" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span
                  className="
                    absolute top-1 right-1 min-w-[16px] h-4 px-1
                    flex items-center justify-center
                    rounded-full bg-gold text-forest
                    text-[10px] font-semibold leading-none
                    ring-2 ring-surface
                  "
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-forest/5 active:scale-95 transition-all"
            >
              <User size={20} className="text-forest" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </header>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
