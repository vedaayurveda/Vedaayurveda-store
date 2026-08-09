'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'filled' | 'tonal' | 'outlined' | 'text'
type Size = 'compact' | 'default' | 'large'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const heights: Record<Size, string> = {
  compact: 'h-10 px-4 text-sm',
  default: 'h-12 px-6 text-base',
  large: 'h-14 px-8 text-lg',
}

const variants: Record<Variant, string> = {
  filled: 'bg-forest text-ivory hover:bg-[#194d31] active:scale-[0.98]',
  tonal: 'bg-gold/15 text-forest hover:bg-gold/25 active:scale-[0.98]',
  outlined: 'bg-transparent text-forest border border-forest/40 hover:bg-forest/5 active:scale-[0.98]',
  text: 'bg-transparent text-forest hover:bg-forest/5 px-3',
}

// M3 Expressive: springy easing, not linear. Buttons feel alive on press.
export function Button({
  variant = 'filled',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-body font-medium
        transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        disabled:opacity-40 disabled:pointer-events-none
        ${heights[size]} ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
