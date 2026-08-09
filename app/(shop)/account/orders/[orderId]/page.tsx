import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getOrderById } from '@/lib/orders'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/auth/login?next=/account/orders/${orderId}`)

  // Uses the RLS-scoped client (not admin) — the orders_self_select policy
  // means this returns null for any order that isn't this user's, so
  // ownership is enforced by the database itself, not application logic.
  const order = await getOrderById(supabase, orderId)

  if (!order) notFound()

  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-6 md:py-10">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1 text-forest/60 text-sm mb-6 hover:text-forest"
      >
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-forest text-xl md:text-2xl font-medium mb-1">
            {order.order_number}
          </h1>
          <p className="text-forest/50 text-xs">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.tracking_url && (
        <a
          href={order.tracking_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gold/10 rounded-lg p-4 mb-6 text-forest text-sm font-medium text-center hover:bg-gold/15 transition-colors"
        >
          Track Your Shipment →
        </a>
      )}

      <div className="bg-surface-container-low rounded-lg p-4 md:p-6 mb-6">
        <h2 className="font-body font-medium text-forest mb-3">Items</h2>
        <div className="space-y-3">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="text-forest">{item.product_name}</p>
                {item.variant_label && (
                  <p className="text-forest/50 text-xs">{item.variant_label}</p>
                )}
                <p className="text-forest/50 text-xs">Qty: {item.quantity}</p>
              </div>
              <span className="text-forest font-medium">₹{item.line_total.toFixed(0)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-forest/10 mt-4 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-forest/70">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm text-forest/70">
            <span>Shipping</span>
            <span>{order.shipping_fee === 0 ? 'Free' : `₹${order.shipping_fee.toFixed(0)}`}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-sm text-forest/70">
              <span>Discount</span>
              <span>-₹{order.discount_amount.toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-forest pt-2 border-t border-forest/10">
            <span>Total</span>
            <span className="font-display text-gold text-lg">₹{order.total.toFixed(0)}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-lg p-4 md:p-6">
        <h2 className="font-body font-medium text-forest mb-3">Shipping Address</h2>
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
          Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid online'} ·{' '}
          {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
        </p>
      </div>
    </main>
  )
}
