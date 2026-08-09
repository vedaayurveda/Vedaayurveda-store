'use client'

import { InputHTMLAttributes } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  helperText?: string
  error?: string | null
}

/**
 * Matches the uploaded login.html/css input style:
 * - dark rounded field
 * - green border on valid, red on invalid (native :valid/:invalid via required/pattern/type)
 * - helper text below (e.g. "Password must be at least 6 characters")
 */
export function AuthInput({ helperText, error, className = '', ...props }: AuthInputProps) {
  return (
    <div style={{ width: '100%' }}>
      <input className={`auth-input ${className}`} {...props} />
      {error ? (
        <p style={{ fontSize: 13, textAlign: 'left', color: '#e05252', marginTop: 6 }}>
          {error}
        </p>
      ) : helperText ? (
        <p style={{ fontSize: 13, textAlign: 'left', marginTop: 6 }}>{helperText}</p>
      ) : null}
    </div>
  )
}
