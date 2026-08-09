'use client'

import Link from 'next/link'
import { X } from 'lucide-react'

interface NavDrawerProps {
  open: boolean
  onClose: () => void
}

const shopLinks = [{ label: 'All Products', href: '/products' }]
const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Franchise / Partner With Us', href: '/franchise' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
]

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/45 backdrop-blur-sm z-50
          transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[78%] max-w-[300px] bg-surface-container-high z-50
          shadow-2xl
          transition-transform duration-300 ease-out
          will-change-transform
          ${open ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        <div className="px-4 pt-6 pb-4 flex items-center gap-2">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-forest/10 shrink-0"
          >
            <X size={20} className="text-gray-700" />
          </button>
          <span className="font-display text-gray-900 text-lg font-medium">VedaAyurveda</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-6">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 px-4">Shop</p>
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block h-12 flex items-center px-4 rounded-md text-gray-700 hover:bg-gray-200/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-forest/10 pt-6">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 px-4">Company</p>
            {companyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block h-12 flex items-center px-4 rounded-md text-gray-700 hover:bg-gray-200/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}
