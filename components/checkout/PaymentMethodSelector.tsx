'use client'

import { Smartphone, CreditCard, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export type PaymentMethod = 'razorpay' | 'cod'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onSelect: (method: PaymentMethod) => void
  onConfirm: () => void
  loading?: boolean
}

const options: { value: PaymentMethod; label: string; description: string; icon: any }[] = [
  {
    value: 'razorpay',
    label: 'UPI / Card / Netbanking',
    description: 'Pay securely via Razorpay',
    icon: CreditCard,
  },
  {
    value: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
  },
]

export function PaymentMethodSelector({
  selected,
  onSelect,
  onConfirm,
  loading,
}: PaymentMethodSelectorProps) {
  return (
    <div>
      <div className="space-y-2 mb-4">
        {options.map(({ value, label, description, icon: Icon }) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-md border text-left transition-colors
                ${isSelected ? 'border-gold bg-gold/5' : 'border-forest/15 hover:border-forest/30'}
              `}
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center shrink-0
                  ${isSelected ? 'bg-gold/20 text-forest' : 'bg-forest/5 text-forest/50'}
                `}
              >
                <Icon size={18} />
              </div>
              <div>
                <p className="text-forest text-sm font-medium">{label}</p>
                <p className="text-forest/50 text-xs">{description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <Button
        variant="filled"
        size="large"
        className="w-full"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? 'Processing…' : selected === 'cod' ? 'Place Order' : 'Pay Now'}
      </Button>
    </div>
  )
}
