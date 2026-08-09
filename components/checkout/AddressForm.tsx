'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export interface ShippingAddress {
  fullName: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

interface AddressFormProps {
  initialValue?: Partial<ShippingAddress>
  onSubmit: (address: ShippingAddress) => void
}

const emptyAddress: ShippingAddress = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
}

const inputClass =
  'w-full h-11 px-3 rounded-md border border-forest/20 bg-white text-forest text-sm outline-none focus:border-gold transition-colors'

export function AddressForm({ initialValue, onSubmit }: AddressFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({ ...emptyAddress, ...initialValue })

  function update<K extends keyof ShippingAddress>(key: K, value: string) {
    setAddress((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(address)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        required
        placeholder="Full name"
        className={inputClass}
        value={address.fullName}
        onChange={(e) => update('fullName', e.target.value)}
      />
      <input
        required
        type="tel"
        pattern="[0-9]{10}"
        maxLength={10}
        placeholder="10-digit mobile number"
        className={inputClass}
        value={address.phone}
        onChange={(e) => update('phone', e.target.value)}
      />
      <input
        required
        placeholder="Address line 1 (House no., street)"
        className={inputClass}
        value={address.line1}
        onChange={(e) => update('line1', e.target.value)}
      />
      <input
        placeholder="Address line 2 (optional — landmark, area)"
        className={inputClass}
        value={address.line2}
        onChange={(e) => update('line2', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="City"
          className={inputClass}
          value={address.city}
          onChange={(e) => update('city', e.target.value)}
        />
        <input
          required
          placeholder="State"
          className={inputClass}
          value={address.state}
          onChange={(e) => update('state', e.target.value)}
        />
      </div>
      <input
        required
        pattern="[0-9]{6}"
        maxLength={6}
        placeholder="Pincode"
        className={inputClass}
        value={address.pincode}
        onChange={(e) => update('pincode', e.target.value)}
      />

      <Button type="submit" variant="filled" size="large" className="w-full mt-2">
        Continue to Payment
      </Button>
    </form>
  )
}
