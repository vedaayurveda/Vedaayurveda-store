import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { CookieConsentBanner } from '@/components/legal/CookieConsentBanner'

// Display font — matches Notion doc spec (Fraunces, heading/hero use)
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Body font — Google Sans Text isn't distributed on Google Fonts (it's a
// Google product-internal font), so Inter is used as the closest open
// alternative. If a licensed Google Sans Text file becomes available,
// swap it in here via next/font/local instead.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VedaAyurveda',
  description: 'Sarve santu niramayaḥ — Ayurvedic wellness, rooted in tradition.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  )
}
