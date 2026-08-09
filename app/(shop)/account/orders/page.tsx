import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getOrdersForUser } from '@/lib/orders'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import { AccountNav } from '@/components/account/AccountNav'

export default async function OrderHistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/account/orders')

  const orders = await getOrdersForUser(supabase, user.id)

  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-6 md:py-10">
      <h1 className="font-display text-forest text-2xl md:text-3xl font-medium mb-6">
        Your Orders
      </h1>

      <AccountNav />

      {orders.length === 0 ? (
        <div className="bg-surface-container-low rounded-lg p-8 text-center">
          <p className="text-forest/50 text-sm mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="text-gold text-sm font-medium">
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between bg-surface-container-low rounded-lg p-4 hover:bg-surface-container transition-colors"
            >
              <div>
                <p className="text-forest text-sm font-medium">{order.order_number}</p>
                <p className="text-forest/50 text-xs mt-0.5">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  · {order.order_items.length} item{order.order_items.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="font-display text-gold font-semibold text-sm">
                  ₹{order.total.toFixed(0)}
                </span>
                <ChevronRight size={16} className="text-forest/30" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
