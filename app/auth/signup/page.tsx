'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateGuestSessionId } from '@/lib/guestSession'
import { recordConsent } from '@/lib/consent'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthInput } from '@/components/auth/AuthInput'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'

function calculateAge(dob: string): number | null {
  if (!dob) return null
  const birthDate = new Date(dob)
  if (Number.isNaN(birthDate.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dob, setDob] = useState('')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedMarketing, setAgreedMarketing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)

  const age = calculateAge(dob)
  const isUnder18 = age !== null && age < 18

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!agreedTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy to continue.')
      return
    }
    if (isUnder18) {
      // DPDP Module 05: a self-declared DOB is not "verifiable parental consent" —
      // this MVP gate blocks signup outright for anyone declaring under-18 rather
      // than claim compliance it hasn't built. See open items in the compliance
      // notes for the fuller parental-consent flow this stands in for.
      setError(
        'VedaAyurveda accounts require you to be 18 or older. If a parent or guardian would like to place an order on your behalf, please contact us.'
      )
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, date_of_birth: dob }, // picked up by handle_new_user trigger -> profiles
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Record consent regardless of whether email confirmation is pending —
    // the decision was made at this moment and must be logged with that timestamp.
    await recordConsent({ purpose: 'account_creation', granted: true, userId: data.user?.id })
    if (agreedMarketing) {
      await recordConsent({ purpose: 'marketing_emails', granted: true, userId: data.user?.id })
    }

    // If email confirmation is required, session will be null here
    if (!data.session) {
      setCheckEmail(true)
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

  if (checkEmail) {
    return (
      <AuthLayout heading="Check your email">
        <div className="auth-form">
          <p style={{ fontSize: 14, textAlign: 'center' }}>
            We sent a confirmation link to <span style={{ color: 'var(--auth-text)' }}>{email}</span>. Tap it
            to activate your account.
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      heading="Create your account"
      subtext={
        <>
          Already have one?{' '}
          <Link href="/auth/login" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
            Sign in
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput
          type="text"
          name="fullName"
          placeholder="Full name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <AuthInput
          type="email"
          name="email"
          placeholder="Your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          type="date"
          name="dob"
          placeholder="Date of birth"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          helperText={isUnder18 ? undefined : 'Required to verify you meet our minimum age'}
          error={isUnder18 ? 'You must be 18 or older to create an account.' : undefined}
        />

        <AuthInput
          type="password"
          name="password"
          placeholder="Password"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Password must be at least 6 characters"
          error={error}
        />

        {/* Granular, unticked consent — separate purposes, plain language.
            A single "by signing up you agree" sentence does not satisfy DPDP. */}
        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          <span>
            I agree to the{' '}
            <a href="/terms" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
              Terms of Service
            </a>{' '}
            and I consent to VedaAyurveda collecting and using my name, email, and order details as
            described in the{' '}
            <a href="/privacy-policy" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
              Privacy Policy
            </a>{' '}
            to create and manage my account.
          </span>
        </label>

        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agreedMarketing}
            onChange={(e) => setAgreedMarketing(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          <span>
            Send me occasional emails about new products, offers, and wellness content. (Optional —
            you can unsubscribe anytime.)
          </span>
        </label>

        <button className="auth-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <div className="auth-or">or</div>

        <GoogleAuthButton label="Continue with Google" />

        <Link href="/auth/login/phone" style={{ width: '100%' }}>
          <button className="auth-btn-secondary" type="button">
            Continue with phone number
          </button>
        </Link>
      </form>
    </AuthLayout>
  )
}
