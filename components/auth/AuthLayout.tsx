import { ReactNode } from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  heading: string
  subtext?: ReactNode
  children: ReactNode
}

export function AuthLayout({ heading, subtext, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <header style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Link href="/" className="auth-logo" aria-label="VedaAyurveda home">
            <span style={{ color: 'var(--forest)', fontFamily: 'var(--font-display), Playfair Display', fontSize: 24 }}>
              V
            </span>
          </Link>
          <h1
            style={{
              color: 'var(--auth-text)',
              fontFamily: 'var(--font-display), Playfair Display',
              fontWeight: 500,
              fontSize: 24,
              marginBottom: 8,
              letterSpacing: '-0.01em',
            }}
          >
            {heading}
          </h1>
          {subtext && <p style={{ fontSize: 14 }}>{subtext}</p>}
        </header>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
