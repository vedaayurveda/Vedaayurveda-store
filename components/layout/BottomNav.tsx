'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react'

const tabs = [
  { href: '/', label: 'Home', icon: Home, match: (path: string) => path === '/' },
  { href: '/products', label: 'Shop', icon: ShoppingBag, match: (path: string) => path.startsWith('/products') },
  { href: '/cart', label: 'Cart', icon: ShoppingCart, match: (path: string) => path.startsWith('/cart') },
  { href: '/account', label: 'Account', icon: User, match: (path: string) => path.startsWith('/account') || path.startsWith('/auth') },
]

// Mobile-only (hidden md:up). Fixed to viewport bottom, above safe-area inset.
// Glassmorphism matches Header exactly (bg-surface/80 + backdrop-blur-md).
// Active tab expands into a pill/capsule with its label revealed, inactive
// tabs stay icon-only — same pattern as the reference bottom-nav.
export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="
        md:hidden fixed bottom-0 left-0 right-0 z-30
        bg-surface/80 backdrop-blur-md border-t border-forest/10
        shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="flex items-center justify-around gap-1 h-16 px-2">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`
                flex items-center justify-center gap-1.5
                h-10 rounded-full shrink-0
                transition-[background-color,padding,width] duration-200 ease-out
                active:scale-95
                ${active ? 'px-4 bg-gold/15' : 'w-12 px-0'}
              `}
            >
              <Icon
                size={20}
                className={active ? 'text-forest shrink-0' : 'text-forest/40 shrink-0'}
                strokeWidth={active ? 2.25 : 1.75}
              />
              {active && (
                <span className="text-xs font-semibold text-forest whitespace-nowrap">
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
