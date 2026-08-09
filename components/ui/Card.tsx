import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  elevation?: 0 | 1 | 2 | 3 | 4
  /** Frosted glass surface — for cards that float over a photo/gradient
   *  backdrop (AgricAI-style). Overrides the flat elevation surface;
   *  needs a darker or textured parent behind it to read correctly —
   *  don't use on a plain ivory section. */
  glass?: boolean
}

const surfaceByElevation: Record<number, string> = {
  0: 'bg-surface',
  1: 'bg-surface-container-low',
  2: 'bg-surface-container',
  3: 'bg-surface-container-high',
  4: 'bg-surface-container-highest',
}

export function Card({ children, elevation = 2, glass = false, className = '', ...props }: CardProps) {
  const surfaceClasses = glass
    ? 'bg-white/55 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(31,94,59,0.14)]'
    : `${surfaceByElevation[elevation]} shadow-sm hover:shadow-md`

  return (
    <div
      className={`
        rounded-lg ${surfaceClasses}
        transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
