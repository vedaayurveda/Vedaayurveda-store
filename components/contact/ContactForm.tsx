'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const inputClass =
  'w-full h-11 px-3 rounded-md border border-forest/20 bg-white text-forest text-sm outline-none focus:border-gold transition-colors'

export function ContactForm() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-gold/10 rounded-lg p-6 text-center">
        <p className="text-forest font-medium mb-1">Message sent!</p>
        <p className="text-forest/60 text-sm">We'll get back to you within 1-2 business days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        required
        placeholder="Full name"
        className={inputClass}
        value={form.fullName}
        onChange={(e) => update('fullName', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="email"
          placeholder="Email"
          className={inputClass}
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          className={inputClass}
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
      </div>
      <input
        placeholder="Subject (optional)"
        className={inputClass}
        value={form.subject}
        onChange={(e) => update('subject', e.target.value)}
      />
      <textarea
        required
        placeholder="Your message"
        rows={4}
        className="w-full px-3 py-2 rounded-md border border-forest/20 bg-white text-forest text-sm outline-none focus:border-gold transition-colors resize-none"
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
      />

      <Button type="submit" variant="filled" size="large" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </Button>
      {status === 'error' && (
        <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
