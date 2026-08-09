'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateGuestSessionId } from '@/lib/guestSession'
import { recordConsent, CONSENT_COPY } from '@/lib/consent'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthInput } from '@/components/auth/AuthInput'

type Step = 'phone' | 'otp'

export default function PhoneLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [agreedOtp, setAgreedOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // India-only phone format assumed: +91XXXXXXXXXX
  function toE164(input: string) {
    const digits = input.replace(/\D/g, '')
    return digits.startsWith('91') ? `+${digits}` : `+91${digits}`
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!agreedOtp) {
      setError('Please confirm you agree to receive an OTP by SMS to continue.')
      return
    }

    setLoading(true)

    // Consent recorded before the OTP request is made — DPDP Module 02.1
    // requires this to happen before the phone number is used for its stated purpose.
    await recordConsent({ purpose: 'otp_authentication', granted: true })

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: toE164(phone),
    })

    setLoading(false)
    if (otpError) {
      setError(otpError.message)
      return
    }
    setStep('otp')
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: toE164(phone),
      token: otp,
      type: 'sms',
    })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    const guestSessionId = getOrCreateGuestSessionId()
    if (guestSessionId && data.user) {
      await fetch('/api/cart/merge-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestSessionId }),
      })
    }

    router.push('/account')
    router.refresh()
  }

  if (step === 'otp') {
    return (
      <AuthLayout heading="Enter the code" subtext={`We sent a 6-digit code to ${toE164(phone)}`}>
        <form className="auth-form" onSubmit={verifyOtp}>
          <AuthInput
            type="text"
            inputMode="numeric"
            name="otp"
            placeholder="6-digit code"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={error}
          />

          <button className="auth-btn-primary" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify & Sign in'}
          </button>

          <button
            className="auth-btn-secondary"
            type="button"
            onClick={() => setStep('phone')}
          >
            Change phone number
          </button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      heading="Login with phone"
      subtext={
        <>
          Prefer email?{' '}
          <Link href="/auth/login" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
            Sign in with email
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={sendOtp}>
        <AuthInput
          type="tel"
          name="phone"
          placeholder="10-digit mobile number"
          required
          pattern="[0-9]{10}"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          helperText="We'll text you a 6-digit code"
        />

        {/* Explicit, purpose-specific consent — required before the phone
            number is used, per DPDP Module 02.1. Unticked by default. */}
        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agreedOtp}
            onChange={(e) => setAgreedOtp(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          <span>{CONSENT_COPY.otp_authentication}</span>
        </label>

        {error && <p style={{ fontSize: 13, color: '#e05252' }}>{error}</p>}

        <button className="auth-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Sending code…' : 'Send code'}
        </button>

        <p style={{ fontSize: 13 }}>
          By continuing you also agree to our{' '}
          <a href="/terms" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </AuthLayout>
  )
}
