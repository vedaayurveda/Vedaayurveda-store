'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutStep } from '@/components/checkout/CheckoutSteps'
import { AddressForm, type ShippingAddress } from '@/components/checkout/AddressForm'
import { PaymentMethodSelector, type PaymentMethod } from '@/components/checkout/PaymentMethodSelector'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { fetchCart, type CartItemRow } from '@/lib/cart'
import { getOrCreateGuestSessionId } from '@/lib/guestSession'
import { useRazorpayScript } from '@/lib/useRazorpayScript'

type Step = 'address' | 'payment' | 'review'

const FREE_SHIPPING_THRESHOLD = 499
const STANDARD_SHIPPING_FEE = 60

export default function CheckoutPage() {
  const router = useRouter()
  const razorpayLoaded = useRazorpayScript()

  const [items, setItems] = useState<CartItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<Step>('address')

  const [address, setAddress] = useState<ShippingAddress | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
      .then(({ items }) => {
        setItems(items)
        if (items.length === 0) router.replace('/cart')
      })
      .finally(() => setLoading(false))
  }, [router])

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = item.product_variants ? item.product_variants.price : item.products.base_price
      return sum + price * item.quantity
    }, 0)
  }, [items])

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE

  function handleAddressSubmit(newAddress: ShippingAddress) {
    setAddress(newAddress)
    setStep('payment')
  }

  async function handlePaymentConfirm() {
    if (!address) return
    setError(null)
    setProcessing(true)

    try {
      const guestSessionId = getOrCreateGuestSessionId()
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestSessionId,
          shippingAddress: address,
          paymentMethod,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to create order')
      }

      if (data.paymentMethod === 'cod') {
        router.push(`/order-confirmation/${data.orderId}`)
        return
      }

      // Razorpay flow
      if (!razorpayLoaded || !(window as any).Razorpay) {
        throw new Error('Payment gateway is still loading — please try again in a moment')
      }

      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: 'VedaAyurveda',
        description: `Order ${data.orderNumber}`,
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: '#1F5E3B' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                guestSessionId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            if (!verifyRes.ok) throw new Error('Payment verification failed')
            router.push(`/order-confirmation/${data.orderId}`)
          } catch {
            setError('Payment succeeded but verification failed. Please contact support with your order number: ' + data.orderNumber)
            setProcessing(false)
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      })

      rzp.open()
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-container mx-auto px-4 md:px-8 py-16 text-center text-forest/50">
        Loading checkout…
      </main>
    )
  }

  return (
    <main className="max-w-container mx-auto px-4 md:px-8 py-6 md:py-10">
        <h1 className="font-display text-forest text-2xl md:text-3xl font-medium mb-6">
          Checkout
        </h1>

        <div className="md:grid md:grid-cols-3 md:gap-8">
          <div className="md:col-span-2">
            <CheckoutStep
              stepNumber={1}
              title="Shipping Address"
              summary={address ? `${address.fullName}, ${address.city} - ${address.pincode}` : undefined}
              isActive={step === 'address'}
              isCompleted={!!address}
              onEdit={() => setStep('address')}
            >
              <AddressForm initialValue={address ?? undefined} onSubmit={handleAddressSubmit} />
            </CheckoutStep>

            <CheckoutStep
              stepNumber={2}
              title="Payment Method"
              summary={
                paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI / Card / Netbanking'
              }
              isActive={step === 'payment'}
              isCompleted={step === 'review'}
              onEdit={() => setStep('payment')}
            >
              <PaymentMethodSelector
                selected={paymentMethod}
                onSelect={setPaymentMethod}
                onConfirm={handlePaymentConfirm}
                loading={processing}
              />
              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
            </CheckoutStep>
          </div>

          <div className="mt-6 md:mt-0">
            <OrderSummary items={items} subtotal={subtotal} shippingFee={shippingFee} />
          </div>
        </div>
    </main>
  )
}
