import type { CartItemRow } from '@/lib/cart'

interface OrderSummaryProps {
  items: CartItemRow[]
  subtotal: number
  shippingFee: number
}

export function OrderSummary({ items, subtotal, shippingFee }: OrderSummaryProps) {
  const total = subtotal + shippingFee

  return (
    <div className="bg-surface-container-low rounded-lg p-4 md:p-6">
      <h2 className="font-body font-medium text-forest mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item) => {
          const price = item.product_variants ? item.product_variants.price : item.products.base_price
          const image = item.products.product_images?.[0]
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-surface shrink-0 relative">
                {image ? (
                  <img src={image.url} alt={item.products.name} className="w-full h-full object-cover" />
                ) : null}
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-forest text-ivory text-[10px] flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-forest text-xs line-clamp-1">{item.products.name}</p>
                {item.product_variants && (
                  <p className="text-forest/50 text-[11px]">{item.product_variants.variant_label}</p>
                )}
              </div>
              <p className="text-forest text-xs font-medium shrink-0">
                ₹{(price * item.quantity).toFixed(0)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="border-t border-forest/10 pt-3 space-y-2">
        <div className="flex justify-between text-sm text-forest/70">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-sm text-forest/70">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(0)}`}</span>
        </div>
        <div className="flex justify-between font-medium text-forest pt-2 border-t border-forest/10">
          <span>Total</span>
          <span className="font-display text-gold text-lg">₹{total.toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
