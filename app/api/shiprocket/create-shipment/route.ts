import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createOrderShipment } from '@/lib/shiprocket'

// Automatic shipment creation happens inline from verify-payment and
// create-order (COD branch) via createOrderShipment(). This route exists
// as a manual retry path — e.g. from a future admin dashboard — for orders
// where shipment creation failed the first time (shiprocket_shipment_id is null).
export async function POST(request: Request) {
  const { orderId } = await request.json()

  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  await createOrderShipment(admin, orderId)

  const { data: order } = await admin
    .from('orders')
    .select('shiprocket_shipment_id, shiprocket_awb, tracking_url')
    .eq('id', orderId)
    .maybeSingle()

  if (!order?.shiprocket_shipment_id) {
    return NextResponse.json({ error: 'Shipment creation failed — check server logs' }, { status: 500 })
  }

  return NextResponse.json({ success: true, ...order })
}
