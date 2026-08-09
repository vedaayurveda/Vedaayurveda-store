const statusStyles: Record<string, string> = {
  pending: 'bg-forest/10 text-forest/60',
  paid: 'bg-gold/15 text-forest',
  processing: 'bg-gold/15 text-forest',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  refunded: 'bg-red-100 text-red-600',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending Payment',
  paid: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full text-xs font-medium
        ${statusStyles[status] ?? 'bg-forest/10 text-forest/60'}
      `}
    >
      {statusLabels[status] ?? status}
    </span>
  )
}
