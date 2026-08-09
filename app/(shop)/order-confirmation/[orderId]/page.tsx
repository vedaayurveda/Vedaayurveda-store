import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { getOrderById } from '@/lib/orders'
import { Button } from '@/components/ui/Button'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params
  // NOTE: uses the admin client intentionally. Orders RLS only allows a
  // logged-in user to read their own order — it has no policy for guest
  // orders (user_id is null), so a guest could never see their own
  // confirmation page under RLS. This route is reached only via a URL
  // returned right after checkout, which is an acceptable trust boundary
  // for a receipt page. Do not reuse this pattern for listing all orders.
  const admin = createAdminClient()
  const order = await getOrderById(admin, orderId)

  if (!order) notFound()

  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="max-w-lg mx-auto text-center mb-10">
          <CheckCircle2 size={48} className="text-forest mx-auto mb-4" />
          <h1 className="font-display text-forest text-2xl md:text-3xl font-medium mb-2">
            Order Confirmed!
          </h1>
          <p className="text-forest/60 text-sm">
            Order <span className="font-medium text-forest">{order.order_number}</span> has been
            placed successfully.
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-surface-container-low rounded-lg p-4 md:p-6 mb-6">
          <h2 className="font-body font-medium text-forest mb-3">Items</h2>
          <div className="space-y-2 mb-4">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-forest/80">
                  {item.product_name}
                  {item.variant_label ? ` (${item.variant_label})` : ''} × {item.quantity}
                </span>
                <span className="text-forest font-medium">₹{item.line_total.toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-forest/10 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-forest/70">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-forest/70">
              <span>Shipping</span>
              <span>{order.shipping_fee === 0 ? 'Free' : `₹${order.shipping_fee.toFixed(0)}`}</span>
            </div>
            <div className="flex justify-between font-medium text-forest pt-2 border-t border-forest/10">
              <span>Total</span>
              <span className="font-display text-gold text-lg">₹{order.total.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto bg-surface-container-low rounded-lg p-4 md:p-6 mb-8">
          <h2 className="font-body font-medium text-forest mb-3">Shipping To</h2>
          <p className="text-forest/80 text-sm">
            {order.shipping_full_name}
            <br />
            {order.shipping_line1}
            {order.shipping_line2 ? `, ${order.shipping_line2}` : ''}
            <br />
            {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
            <br />
            {order.shipping_phone}
          </p>
          <p className="text-forest/50 text-xs mt-3">
            Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid online'}
          </p>
        </div>

        <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
          <Link href="/products" className="flex-1">
            <Button variant="outlined" size="large" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/account/orders" className="flex-1">
            <Button variant="filled" size="large" className="w-full">
              View Order
            </Button>
          </Link>
        </div>
      </main>
  )
}
