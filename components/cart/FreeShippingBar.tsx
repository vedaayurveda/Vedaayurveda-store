const FREE_SHIPPING_THRESHOLD = 499

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  const qualifies = remaining === 0

  return (
    <div className="bg-gold/10 rounded-md p-3 mb-4">
      <p className="text-forest text-xs font-medium mb-2">
        {qualifies ? (
          '🎉 You\'ve unlocked free shipping!'
        ) : (
          <>
            Add <span className="text-gold font-semibold">₹{remaining.toFixed(0)}</span> more for
            free shipping
          </>
        )}
      </p>
      <div className="h-1.5 rounded-full bg-forest/10 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
