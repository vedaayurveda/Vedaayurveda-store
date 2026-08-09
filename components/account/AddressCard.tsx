'use client'

import { MapPin, Pencil, Trash2, Star } from 'lucide-react'
import type { Address } from '@/lib/addresses'

interface AddressCardProps {
  address: Address
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className="bg-surface-container-low rounded-lg p-4 relative">
      {address.is_default && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-gold text-xs font-medium">
          <Star size={12} className="fill-gold" /> Default
        </span>
      )}

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
          <MapPin size={16} className="text-forest" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-forest text-sm font-medium">{address.full_name}</p>
          <p className="text-forest/70 text-xs mt-1">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ''}
            <br />
            {address.city}, {address.state} - {address.pincode}
            <br />
            {address.phone}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-forest/10">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-forest/60 text-xs hover:text-forest"
        >
          <Pencil size={12} /> Edit
        </button>
        {!address.is_default && (
          <button
            onClick={onSetDefault}
            className="flex items-center gap-1 text-forest/60 text-xs hover:text-forest"
          >
            <Star size={12} /> Set as default
          </button>
        )}
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-forest/60 text-xs hover:text-red-500 ml-auto"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  )
}
