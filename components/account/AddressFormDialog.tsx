'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Address } from '@/lib/addresses'

type AddressFormValues = Omit<Address, 'id'>

interface AddressFormDialogProps {
  initialValue?: Address
  onSave: (values: AddressFormValues, id?: string) => Promise<void>
  onClose: () => void
}

const emptyForm: AddressFormValues = {
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  is_default: false,
}

const inputClass =
  'w-full h-11 px-3 rounded-md border border-forest/20 bg-white text-forest text-sm outline-none focus:border-gold transition-colors'

export function AddressFormDialog({ initialValue, onSave, onClose }: AddressFormDialogProps) {
  const [form, setForm] = useState<AddressFormValues>(
    initialValue
      ? {
          full_name: initialValue.full_name,
          phone: initialValue.phone,
          line1: initialValue.line1,
          line2: initialValue.line2 ?? '',
          city: initialValue.city,
          state: initialValue.state,
          pincode: initialValue.pincode,
          country: initialValue.country,
          is_default: initialValue.is_default,
        }
      : emptyForm
  )
  const [saving, setSaving] = useState(false)

  function update<K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form, initialValue?.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center">
      <div className="bg-surface w-full md:max-w-md rounded-t-lg md:rounded-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body font-medium text-forest">
            {initialValue ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-forest/5">
            <X size={18} className="text-forest" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Full name"
            className={inputClass}
            value={form.full_name}
            onChange={(e) => update('full_name', e.target.value)}
          />
          <input
            required
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="10-digit mobile number"
            className={inputClass}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
          <input
            required
            placeholder="Address line 1 (House no., street)"
            className={inputClass}
            value={form.line1}
            onChange={(e) => update('line1', e.target.value)}
          />
          <input
            placeholder="Address line 2 (optional — landmark, area)"
            className={inputClass}
            value={form.line2 ?? ''}
            onChange={(e) => update('line2', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="City"
              className={inputClass}
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
            />
            <input
              required
              placeholder="State"
              className={inputClass}
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
            />
          </div>
          <input
            required
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="Pincode"
            className={inputClass}
            value={form.pincode}
            onChange={(e) => update('pincode', e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm text-forest/70">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => update('is_default', e.target.checked)}
              className="accent-gold"
            />
            Set as default address
          </label>

          <Button type="submit" variant="filled" size="large" className="w-full mt-2" disabled={saving}>
            {saving ? 'Saving…' : 'Save Address'}
          </Button>
        </form>
      </div>
    </div>
  )
}
