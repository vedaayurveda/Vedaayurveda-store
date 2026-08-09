'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantityStepper({ value, onChange, min = 1, max = 10 }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-surface-container-low rounded-md p-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="w-9 h-9 flex items-center justify-center rounded-sm text-forest hover:bg-gold/15 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center font-body font-medium text-forest">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="w-9 h-9 flex items-center justify-center rounded-sm text-forest hover:bg-gold/15 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
