import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Package, MapPin, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getOrdersForUser } from '@/lib/orders'
import { SignOutButton } from '@/components/account/SignOutButton'
import { DeleteAccountButton } from '@/components/account/DeleteAccountButton'
import { AccountNav } from '@/components/account/AccountNav'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/account')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone')
    .eq('id', user.id)
    .maybeSingle()

  const orders = await getOrdersForUser(supabase, user.id)
  const recentOrders = orders.slice(0, 3)

  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-forest text-2xl md:text-3xl font-medium">
            Hi, {profile?.full_name || 'there'}
          </h1>
          <p className="text-forest/60 text-sm mt-1">
            {profile?.email ?? profile?.phone ?? user.email}
          </p>
        </div>
        <SignOutButton />
      </div>

      <AccountNav />

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/account/orders"
          className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 hover:bg-surface-container transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
            <Package size={18} className="text-forest" />
          </div>
          <div>
            <p className="text-forest text-sm font-medium">Orders</p>
            <p className="text-forest/50 text-xs">{orders.length} total</p>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 hover:bg-surface-container transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-forest" />
          </div>
          <div>
            <p className="text-forest text-sm font-medium">Addresses</p>
            <p className="text-forest/50 text-xs">Manage saved addresses</p>
          </div>
        </Link>
      </div>

      {/* Recent orders */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-body font-medium text-forest">Recent Orders</h2>
        {orders.length > 3 && (
          <Link href="/account/orders" className="text-gold text-xs font-medium">
            View all
          </Link>
        )}
      </div>

      {recentOrders.length === 0 ? (
        <div className="bg-surface-container-low rounded-lg p-8 text-center">
          <p className="text-forest/50 text-sm mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="text-gold text-sm font-medium">
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentOrders.map((order) => (
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

      {/* DPDP Module 04.3 — self-serve account & data deletion */}
      <div className="mt-10 pt-6 border-t border-forest/10">
        <DeleteAccountButton />
      </div>
    </main>
  )
}
