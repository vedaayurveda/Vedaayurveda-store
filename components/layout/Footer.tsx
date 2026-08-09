'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Youtube, ArrowRight, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
]

function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="text-lime text-sm font-medium">Thanks! Check your inbox.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm w-full">
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 min-w-0 rounded-full px-4 py-2.5 border border-white/15 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 text-sm outline-none focus:border-lime/60 transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        aria-label="Subscribe"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-lime text-forest shrink-0 hover:bg-lime/90 active:scale-[0.98] transition-all disabled:opacity-40"
      >
        {status === 'loading' ? '…' : <ArrowRight size={16} />}
      </button>
    </form>
  )
}

/**
 * Footer — AgricAI-inspired two-panel composition:
 * a dark forest-gradient brand panel (left) sitting beside a
 * frosted-glass link panel (right), both as one floating rounded
 * card rather than a flat full-width bar. 60/30/10 read:
 *   60% ivory page background around the card
 *   30% deep forest gradient (brand panel)
 *   10% lime accent (CTA, active/hover touches)
 */
export function Footer() {
  return (
    <footer className="bg-ivory pt-8 pb-4 px-4 md:px-8">
      <div className="max-w-container mx-auto">
        <div className="relative rounded-xl overflow-hidden shadow-[0_24px_64px_rgba(31,94,59,0.18)]">
          <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">

            {/* Brand panel — deep forest gradient, darkest surface in the composition */}
            <div className="relative bg-gradient-to-br from-forest via-[#1a4f32] to-[#123322] p-8 md:p-10 flex flex-col justify-between">
              {/* faint botanical texture, restrained — echoes the signature divider motif rather than a literal leaf image */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 35%)',
                }}
              />
              <div className="relative">
                <p className="font-display text-ivory text-2xl font-medium mb-1">VedaAyurveda</p>
                <p className="text-lime text-xs mb-6">सर्वे सन्तु निरामयाः</p>
                <p className="text-white/60 text-sm max-w-xs leading-relaxed">
                  Classical Ayurvedic formulations, made for how you actually live — sourced, tested, and shipped with care.
                </p>
              </div>

              <div className="relative mt-8">
                <p className="text-white/50 text-xs mb-3">Get restock alerts &amp; wellness notes</p>
                <FooterNewsletter />
                <div className="flex items-center gap-2 mt-6">
                  {socialLinks.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-white/10 hover:bg-lime hover:text-forest text-white/80 backdrop-blur-sm transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Link panel — frosted glass over a soft forest-tinted backdrop */}
            <div className="relative bg-gradient-to-br from-surface-container-high via-ivory to-surface-container-low p-8 md:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(31,94,59,0.10) 0%, transparent 45%)',
                }}
              />
              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div>
                  <p className="text-gray-900 text-sm font-semibold mb-3">Product</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li><Link href="/products" className="hover:text-forest transition-colors">All Products</Link></li>
                    <li><Link href="/cart" className="hover:text-forest transition-colors">Cart</Link></li>
                    <li><Link href="/checkout" className="hover:text-forest transition-colors">Checkout</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-gray-900 text-sm font-semibold mb-3">Company</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li><Link href="/about" className="hover:text-forest transition-colors">About Us</Link></li>
                    <li><Link href="/franchise" className="hover:text-forest transition-colors">Partner With Us</Link></li>
                    <li><Link href="/blog" className="hover:text-forest transition-colors">Blog</Link></li>
                    <li><Link href="/contact" className="hover:text-forest transition-colors">Contact Us</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-gray-900 text-sm font-semibold mb-3">Support</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li><Link href="/shipping-policy" className="hover:text-forest transition-colors">Shipping Policy</Link></li>
                    <li><Link href="/refund-policy" className="hover:text-forest transition-colors">Return &amp; Refund Policy</Link></li>
                    <li><Link href="/contact" className="hover:text-forest transition-colors">Contact Us</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-gray-900 text-sm font-semibold mb-3">Resources</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li><Link href="/blog" className="hover:text-forest transition-colors">Blog</Link></li>
                    <li><Link href="/privacy-policy" className="hover:text-forest transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-forest transition-colors">Terms &amp; Conditions</Link></li>
                  </ul>
                </div>
              </div>

              {/* Grievance Officer contact — DPDP Module 07 requires this to be
                  publicly visible, not just in the Privacy Policy. Placeholder
                  values below (marked TODO) until a named individual is confirmed —
                  a generic support email alone does not satisfy this requirement. */}
              <p className="relative mt-8 text-xs text-gray-500">
                Grievance Officer: <span className="font-medium text-gray-700">[TODO: Name]</span> ·{' '}
                <a href="mailto:grievance@vedaayurveda.com" className="hover:text-forest underline">
                  grievance@vedaayurveda.com
                </a>
              </p>

              {/* Lime CTA pill — the one high-contrast 10% touch on this panel */}
              <div className="relative mt-6">
                <Button
                  variant="filled"
                  size="default"
                  className="!bg-lime !text-forest hover:!bg-lime/90 rounded-full"
                >
                  Shop Bestsellers
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-[#123322] px-6 md:px-10 py-3 flex items-center justify-start gap-1.5 text-xs text-white/50">
            <span>© 2026 · VedaAyurveda</span>
            <BadgeCheck size={14} className="text-lime" />
            <span>· All rights reserved.</span>
          </div>
        </div>
      </div>
      {/* pb-16 spacer so mobile BottomNav doesn't overlap the footer edge */}
      <div className="h-16 md:h-0" aria-hidden />
    </footer>
  )
}
