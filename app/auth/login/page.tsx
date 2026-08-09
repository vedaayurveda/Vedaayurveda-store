'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateGuestSessionId } from '@/lib/guestSession'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthInput } from '@/components/auth/AuthInput'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Merge any guest cart into the now-logged-in user's cart
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

  return (
    <AuthLayout
      heading="Hi, welcome back!"
      subtext={
        <>
          First time here?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
            Sign up for free
          </Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput
          type="email"
          name="email"
          placeholder="Your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <button className="auth-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="auth-or">or</div>

        <GoogleAuthButton label="Continue with Google" />

        <Link href="/auth/login/phone" style={{ width: '100%' }}>
          <button className="auth-btn-secondary" type="button">
            Login with phone number
          </button>
        </Link>

        <p style={{ fontSize: 13 }}>
          You acknowledge that you read, and agree, to our{' '}
          <a href="/terms" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
            Terms of Service
          </a>{' '}
          and our{' '}
          <a href="/privacy-policy" style={{ color: 'var(--auth-text)', borderBottom: '1px solid #17331f55' }}>
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </AuthLayout>
  )
}
