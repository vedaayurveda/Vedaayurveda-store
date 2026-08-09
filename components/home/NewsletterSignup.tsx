'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function NewsletterSignup() {
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

  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(192,155,60,0.12) 0%, transparent 55%)',
        }}
      />
      <div className="relative max-w-container mx-auto px-4 md:px-8">
        <div className="bg-white/55 backdrop-blur-md border border-white/50 rounded-lg p-8 md:p-12 text-center max-w-2xl mx-auto shadow-[0_8px_32px_rgba(31,94,59,0.10)]">
          <h2 className="font-display text-forest text-xl md:text-2xl font-medium mb-2">
            Get 10% off your first order
          </h2>
          <p className="text-forest/60 text-sm mb-6">
            Join our list for wellness tips, early access, and exclusive offers.
          </p>

          {status === 'success' ? (
            <p className="text-forest font-medium">Thanks! Check your inbox for your code.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-md px-4 py-3 border border-forest/20 bg-white/80 text-forest text-sm outline-none focus:border-gold"
              />
              <Button type="submit" variant="filled" disabled={status === 'loading'}>
                {status === 'loading' ? 'Submitting…' : 'Subscribe'}
              </Button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-xs mt-3">Something went wrong. Please try again.</p>
          )}
        </div>
      </div>
    </section>
  )
}
