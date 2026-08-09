'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const inputClass =
  'w-full h-11 px-3 rounded-md border border-forest/20 bg-white text-forest text-sm outline-none focus:border-gold transition-colors'

export function FranchiseEnquiryForm() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    investmentCapacity: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/franchise-enquiry', {
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
        <p className="text-forest font-medium mb-1">Thank you for your interest!</p>
        <p className="text-forest/60 text-sm">
          Our franchise team will reach out to you within 2-3 business days.
        </p>
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
          type="tel"
          pattern="[0-9]{10}"
          maxLength={10}
          placeholder="Phone number"
          className={inputClass}
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
        <input
          type="email"
          placeholder="Email (optional)"
          className={inputClass}
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
        />
      </div>
      <input
        required
        placeholder="Your city"
        className={inputClass}
        value={form.city}
        onChange={(e) => update('city', e.target.value)}
      />
      <select
        className={inputClass}
        value={form.investmentCapacity}
        onChange={(e) => update('investmentCapacity', e.target.value)}
      >
        <option value="">Investment capacity (optional)</option>
        <option value="₹1-2 lakh">₹1-2 lakh</option>
        <option value="₹2-3 lakh">₹2-3 lakh</option>
        <option value="₹3+ lakh">₹3+ lakh</option>
      </select>
      <textarea
        placeholder="Tell us a bit about yourself (optional)"
        rows={3}
        className="w-full px-3 py-2 rounded-md border border-forest/20 bg-white text-forest text-sm outline-none focus:border-gold transition-colors resize-none"
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
      />

      <Button type="submit" variant="filled" size="large" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting…' : 'Submit Enquiry'}
      </Button>
      {status === 'error' && (
        <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
