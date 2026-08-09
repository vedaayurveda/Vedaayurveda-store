'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CartItem } from '@/components/cart/CartItem'
import { FreeShippingBar } from '@/components/cart/FreeShippingBar'
import { DoctorConsultBanner } from '@/components/cart/DoctorConsultBanner'
import { CrossSell } from '@/components/cart/CrossSell'
import { fetchCart, updateCartItem, removeCartItem, type CartItemRow } from '@/lib/cart'
import { notifyCartUpdated } from '@/lib/useCartCount'

export default function CartPage() {
  const [items, setItems] = useState<CartItemRow[]>([])
  const [loading, setLoading] = useState(true)

  const loadCart = useCallback(async () => {
    try {
      const { items } = await fetchCart()
      setItems(items)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = item.product_variants ? item.product_variants.price : item.products.base_price
      return sum + price * item.quantity
    }, 0)
  }, [items])

  const hasOutOfStockItem = useMemo(
    () =>
      items.some((item) => {
        const stock = item.product_variants ? item.product_variants.stock_quantity : item.products.stock_quantity
        return stock <= 0
      }),
    [items]
  )

  async function handleQuantityChange(itemId: string, quantity: number) {
    // Optimistic update
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)))
    try {
      await updateCartItem(itemId, quantity)
      notifyCartUpdated()
    } catch {
      loadCart() // revert on failure by reloading true state
    }
  }

  async function handleRemove(itemId: string) {
    const prevItems = items
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    try {
      await removeCartItem(itemId)
      notifyCartUpdated()
    } catch {
      setItems(prevItems)
    }
  }

  const excludeProductIds = useMemo(() => items.map((i) => i.product_id), [items])

  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-6 md:py-10">
        <h1 className="font-display text-forest text-2xl md:text-3xl font-medium mb-6">
          Your Cart
        </h1>

        {loading ? (
          <p className="text-forest/50 text-center py-16">Loading your cart…</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16">
            <ShoppingBag size={40} className="text-forest/20 mb-4" />
            <p className="text-forest/60 mb-6">Your cart is empty.</p>
            <Link href="/products">
              <Button variant="filled">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="md:grid md:grid-cols-3 md:gap-8">
            {/* Left: items + cross-sell */}
            <div className="md:col-span-2">
              <FreeShippingBar subtotal={subtotal} />
              <DoctorConsultBanner />

              <div>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              <CrossSell excludeProductIds={excludeProductIds} onAdded={loadCart} />
            </div>

            {/* Right: order summary, sticky on desktop */}
            <div className="md:sticky md:top-24 md:self-start mt-6 md:mt-0">
              <div className="bg-surface-container-low rounded-lg p-4 md:p-6">
                <h2 className="font-body font-medium text-forest mb-4">Order Summary</h2>

                <div className="flex justify-between text-sm text-forest/70 mb-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-forest/70 mb-4">
                  <span>Shipping</span>
                  <span>{subtotal >= 499 ? 'Free' : 'Calculated at checkout'}</span>
                </div>

                <div className="border-t border-forest/10 pt-4 flex justify-between font-medium text-forest mb-6">
                  <span>Total</span>
                  <span className="font-display text-gold text-lg">₹{subtotal.toFixed(0)}</span>
                </div>

                {hasOutOfStockItem && (
                  <p className="text-red-500 text-xs mb-3">
                    Please remove out-of-stock items before checking out.
                  </p>
                )}

                <Link href="/checkout">
                  <Button variant="filled" size="large" className="w-full" disabled={hasOutOfStockItem}>
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
  )
}
