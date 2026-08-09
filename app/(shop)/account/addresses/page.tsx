'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { AddressCard } from '@/components/account/AddressCard'
import { AddressFormDialog } from '@/components/account/AddressFormDialog'
import { AccountNav } from '@/components/account/AccountNav'
import type { Address } from '@/lib/addresses'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Address | undefined>(undefined)

  async function loadAddresses() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/auth/login?next=/account/addresses'
      return
    }

    const { data } = await supabase
      .from('addresses')
      .select('id, full_name, phone, line1, line2, city, state, pincode, country, is_default')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    setAddresses(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  function openAddDialog() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEditDialog(address: Address) {
    setEditing(address)
    setDialogOpen(true)
  }

  async function handleSave(values: Omit<Address, 'id'>, id?: string) {
    if (id) {
      await fetch('/api/addresses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...values }),
      })
    } else {
      await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
    }
    await loadAddresses()
  }

  async function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    await fetch('/api/addresses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  async function handleSetDefault(address: Address) {
    await fetch('/api/addresses', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: address.id, is_default: true }),
    })
    await loadAddresses()
  }

  return (
    <>
      <main className="max-w-container mx-auto px-4 md:px-8 py-6 md:py-10">
        <AccountNav />

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-forest text-2xl md:text-3xl font-medium">
            Saved Addresses
          </h1>
          <Button variant="filled" size="compact" onClick={openAddDialog}>
            <Plus size={16} /> Add New
          </Button>
        </div>

        {loading ? (
          <p className="text-forest/50 text-center py-16">Loading…</p>
        ) : addresses.length === 0 ? (
          <div className="bg-surface-container-low rounded-lg p-8 text-center">
            <p className="text-forest/50 text-sm mb-4">No saved addresses yet.</p>
            <Button variant="filled" onClick={openAddDialog}>
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => openEditDialog(address)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address)}
              />
            ))}
          </div>
        )}
      </main>

      {dialogOpen && (
        <AddressFormDialog
          initialValue={editing}
          onSave={handleSave}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  )
}
