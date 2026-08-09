'use client'

import { ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'

interface CheckoutStepProps {
  stepNumber: number
  title: string
  summary?: string // shown when collapsed + completed, e.g. selected address preview
  isActive: boolean
  isCompleted: boolean
  onEdit?: () => void
  children: ReactNode
}

// Single accordion step. Only one step is "isActive" (expanded) at a time,
// controlled by the parent checkout page's currentStep state.
export function CheckoutStep({
  stepNumber,
  title,
  summary,
  isActive,
  isCompleted,
  onEdit,
  children,
}: CheckoutStepProps) {
  return (
    <div className="border border-forest/10 rounded-md mb-3 overflow-hidden bg-surface">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0
              ${isCompleted ? 'bg-forest text-ivory' : isActive ? 'bg-gold text-forest' : 'bg-forest/10 text-forest/40'}
            `}
          >
            {isCompleted ? <Check size={14} /> : stepNumber}
          </div>
          <div>
            <p className={`font-body font-medium text-sm ${isActive || isCompleted ? 'text-forest' : 'text-forest/40'}`}>
              {title}
            </p>
            {!isActive && summary && <p className="text-forest/50 text-xs mt-0.5">{summary}</p>}
          </div>
        </div>

        {isCompleted && !isActive && onEdit && (
          <button onClick={onEdit} className="text-xs text-gold font-medium">
            Edit
          </button>
        )}
      </div>

      <div
        className={`
          grid transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
        `}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
