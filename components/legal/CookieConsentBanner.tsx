'use client'

import { useState, useEffect } from 'react'
import { recordConsent, POLICY_VERSION } from '@/lib/consent'
import { getOrCreateGuestSessionId } from '@/lib/guestSession'

const STORAGE_KEY = 'veda_cookie_consent'

interface StoredConsent {
  version: string
  analytics: boolean
}

/**
 * Functional cookies (session, cart) are not gated behind this banner —
 * they're required for the site to work at all, and DPDP's consent-wall
 * guidance (Module 01.1, "no consent wall unless data is strictly
 * necessary") treats strictly-necessary cookies as exempt from blocking
 * consent. This banner discloses them and asks for opt-in only on the
 * one cookie category that isn't strictly necessary: analytics.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setVisible(true)
      return
    }
    try {
      const parsed: StoredConsent = JSON.parse(stored)
      if (parsed.version !== POLICY_VERSION) {
        // Policy changed since this decision was recorded — re-prompt (Module 01.1)
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  async function handleChoice(analyticsAccepted: boolean) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: POLICY_VERSION, analytics: analyticsAccepted })
    )
    setVisible(false)

    const guestSessionId = getOrCreateGuestSessionId()
    await recordConsent({ purpose: 'functional_cookies', granted: true, guestSessionId })
    await recordConsent({ purpose: 'analytics_cookies', granted: analyticsAccepted, guestSessionId })
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md border border-forest/10 rounded-lg shadow-[0_8px_32px_rgba(31,94,59,0.18)] p-5 md:p-6">
        <p className="text-forest text-sm mb-1 font-medium">We use cookies</p>
        <p className="text-forest/70 text-xs md:text-sm mb-4 leading-relaxed">
          Functional cookies keep you signed in and remember your cart — these are required for the
          site to work. We&apos;d also like to use analytics cookies to understand how the site is used,
          which is optional.{' '}
          <a href="/privacy-policy" className="text-gold underline underline-offset-2">
            Learn more
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleChoice(true)}
            className="flex-1 rounded-full bg-forest text-ivory text-sm font-medium py-2.5 px-4 hover:bg-forest/90 transition-colors"
          >
            Accept all
          </button>
          <button
            onClick={() => handleChoice(false)}
            className="flex-1 rounded-full border border-forest/25 text-forest text-sm font-medium py-2.5 px-4 hover:bg-forest/5 transition-colors"
          >
            Necessary only
          </button>
        </div>
      </div>
    </div>
  )
}
