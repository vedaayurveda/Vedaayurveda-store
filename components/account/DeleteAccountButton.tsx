'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteAccountButton() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong')
      }
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setDeleting(false)
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-red-600 text-sm underline underline-offset-2 hover:text-red-700"
      >
        Delete my account &amp; data
      </button>
    )
  }

  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
      <p className="text-red-900 text-sm font-medium mb-1">Delete your account permanently?</p>
      <p className="text-red-800/80 text-xs mb-4">
        This deletes your account and profile data and cannot be undone. Order records required
        for tax and accounting purposes may be retained in anonymized form, without your name or
        contact details attached, as required by law.
      </p>
      {error && <p className="text-red-700 text-xs mb-3">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full bg-red-600 text-white text-sm font-medium py-2 px-4 hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Yes, delete everything'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="rounded-full border border-forest/20 text-forest text-sm font-medium py-2 px-4 hover:bg-forest/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
