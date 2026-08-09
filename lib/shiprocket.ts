// Shiprocket API wrapper. Server-only — never import in a Client Component.
// Docs: https://apidocs.shiprocket.in

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

// Token is valid for ~10 days per Shiprocket docs. We cache it in module
// scope so warm serverless instances reuse it instead of re-authenticating
// on every request. On a cold start it'll simply fetch a fresh one.
let cachedToken: { token: string; expiresAt: number } | null = null

async function getShiprocketToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })

  if (!res.ok) {
    throw new Error(`Shiprocket auth failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  // Cache for 9 days to stay safely under the ~10 day expiry
  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 }
  return data.token
}

async function shiprocketFetch(path: string, options: RequestInit = {}) {
  const token = await getShiprocketToken()
  const res = await fetch(`${SHIPROCKET_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`Shiprocket API error (${path}): ${res.status} ${await res.text()}`)
  }
  return res.json()
}

export interface ShipmentOrderInput {
  orderNumber: string
  orderDate: string // YYYY-MM-DD
  shipping: {
    fullName: string
    phone: string
    line1: string
    line2?: string | null
    city: string
    state: string
    pincode: string
    country: string
  }
  items: {
    name: string
    sku: string
    quantity: number
    unitPrice: number
  }[]
  subtotal: number
  shippingFee: number
  paymentMethod: 'razorpay' | 'cod'
  // Package dimensions/weight — using conservative defaults for small wellness
  // products (bottles, jars, tea boxes). Override per-order if some SKUs are
  // heavier/bulkier once real package data is available.
  weightKg?: number
  dimensionsCm?: { length: number; breadth: number; height: number }
}

// TODO: replace with your actual pickup location nickname, set up in
// Shiprocket dashboard → Settings → Pickup Addresses.
const PICKUP_LOCATION = 'Primary'

export async function createShiprocketOrder(input: ShipmentOrderInput) {
  const [firstName, ...rest] = input.shipping.fullName.trim().split(' ')
  const lastName = rest.join(' ') || firstName

  const payload = {
    order_id: input.orderNumber,
    order_date: input.orderDate,
    pickup_location: PICKUP_LOCATION,
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: input.shipping.line1,
    billing_address_2: input.shipping.line2 ?? '',
    billing_city: input.shipping.city,
    billing_pincode: input.shipping.pincode,
    billing_state: input.shipping.state,
    billing_country: input.shipping.country || 'India',
    billing_phone: input.shipping.phone,
    shipping_is_billing: true,
    order_items: input.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.quantity,
      selling_price: item.unitPrice,
    })),
    payment_method: input.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
    sub_total: input.subtotal,
    shipping_charges: input.shippingFee,
    length: input.dimensionsCm?.length ?? 15,
    breadth: input.dimensionsCm?.breadth ?? 12,
    height: input.dimensionsCm?.height ?? 8,
    weight: input.weightKg ?? 0.3,
  }

  return shiprocketFetch('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Auto-assigns the best available courier and generates an AWB (tracking number).
export async function assignAwb(shipmentId: number) {
  return shiprocketFetch('/courier/assign/awb', {
    method: 'POST',
    body: JSON.stringify({ shipment_id: shipmentId }),
  })
}

export function buildTrackingUrl(awbCode: string) {
  return `https://shiprocket.co/tracking/${awbCode}`
}

// Full flow: create the Shiprocket order for a Veda order row, then attempt
// AWB assignment. Called directly (not via HTTP) from verify-payment and
// create-order so it runs as part of the same server invocation.
// Swallows its own errors — a shipping hiccup should never fail order
// confirmation, since the order is already paid/placed at this point.
export async function createOrderShipment(admin: any, orderId: string) {
  try {
    const { data: order } = await admin
      .from('orders')
      .select(
        `id, order_number, created_at, payment_method, subtotal, shipping_fee,
         shipping_full_name, shipping_phone, shipping_line1, shipping_line2,
         shipping_city, shipping_state, shipping_pincode, shipping_country,
         shiprocket_shipment_id,
         order_items ( product_name, sku, quantity, unit_price )`
      )
      .eq('id', orderId)
      .maybeSingle()

    if (!order || order.shiprocket_shipment_id) return

    const shiprocketOrder = await createShiprocketOrder({
      orderNumber: order.order_number,
      orderDate: new Date(order.created_at).toISOString().slice(0, 10),
      shipping: {
        fullName: order.shipping_full_name,
        phone: order.shipping_phone,
        line1: order.shipping_line1,
        line2: order.shipping_line2,
        city: order.shipping_city,
        state: order.shipping_state,
        pincode: order.shipping_pincode,
        country: order.shipping_country,
      },
      items: (order.order_items as any[]).map((item) => ({
        name: item.product_name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unit_price,
      })),
      subtotal: order.subtotal,
      shippingFee: order.shipping_fee,
      paymentMethod: order.payment_method as 'razorpay' | 'cod',
    })

    const shipmentId = shiprocketOrder.shipment_id
    await admin.from('orders').update({ shiprocket_shipment_id: shipmentId }).eq('id', orderId)

    try {
      const awbResult = await assignAwb(shipmentId)
      const awbCode = awbResult?.response?.data?.awb_code
      if (awbCode) {
        await admin
          .from('orders')
          .update({
            shiprocket_awb: awbCode,
            tracking_url: buildTrackingUrl(awbCode),
            status: 'processing',
          })
          .eq('id', orderId)
      }
    } catch (awbError) {
      console.error('AWB assignment failed, shipment created but unassigned:', awbError)
    }
  } catch (error) {
    console.error('Shiprocket order creation failed for order', orderId, error)
  }
}
