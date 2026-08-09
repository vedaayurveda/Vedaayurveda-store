'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: 'Profile', href: '/account' },
  { label: 'Orders', href: '/account/orders' },
  { label: 'Addresses', href: '/account/addresses' },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-2 overflow-x-auto mb-6 border-b border-forest/10">
      {tabs.map((tab) => {
        const isActive =
          tab.href === '/account' ? pathname === '/account' : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              shrink-0 px-4 py-3 text-sm font-body font-medium border-b-2 -mb-px transition-colors
              ${isActive ? 'border-gold text-forest' : 'border-transparent text-forest/50 hover:text-forest'}
            `}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
