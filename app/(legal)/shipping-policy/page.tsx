import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { LegalSection } from '@/components/legal/LegalSection'

export const metadata: Metadata = {
  title: 'Shipping Policy | VedaAyurveda',
  description: 'Delivery timelines, shipping charges, and tracking information for VedaAyurveda orders.',
}

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout title="Shipping Policy" lastUpdated="19 July 2026">
      <LegalSection title="1. Shipping Coverage">
        <p>
          We currently ship across India through our courier partners, managed via Shiprocket.
          Delivery to remote or restricted pin codes may take longer or may not be serviceable in
          rare cases.
        </p>
      </LegalSection>

      <LegalSection title="2. Shipping Charges">
        <ul className="list-disc pl-5 space-y-1">
          <li>Orders above ₹499 qualify for free shipping.</li>
          <li>Orders below ₹499 incur a flat shipping charge of ₹60.</li>
          <li>Shipping charges, if any, are shown at checkout before you complete your order.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Order Processing Time">
        <p>
          Orders are typically processed and handed to our courier partner within 1-2 business
          days of confirmation. Orders placed on Sundays or public holidays are processed the
          next business day.
        </p>
      </LegalSection>

      <LegalSection title="4. Delivery Timelines">
        <p>
          Estimated delivery time is 3-7 business days from dispatch, depending on your location.
          Metro cities typically receive orders faster than remote areas.
        </p>
      </LegalSection>

      <LegalSection title="5. Order Tracking">
        <p>
          Once your order is shipped, you'll receive a tracking link via SMS/email, and it will
          also be available in your{' '}
          <a href="/account/orders" className="text-gold underline">
            Order History
          </a>{' '}
          page.
        </p>
      </LegalSection>

      <LegalSection title="6. Delays">
        <p>
          While we strive to meet estimated timelines, delays may occur due to weather,
          logistics disruptions, or circumstances beyond our control. We appreciate your patience
          in such cases.
        </p>
      </LegalSection>

      <LegalSection title="7. Undelivered / Returned Shipments">
        <p>
          If a shipment is returned to us due to an incorrect address, unavailability of the
          recipient, or refusal to accept delivery, we will contact you to arrange re-shipment
          (additional shipping charges may apply) or process a refund as per our{' '}
          <a href="/refund-policy" className="text-gold underline">
            Refund Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Contact Us">
        <p>
          For shipping-related queries, reach out via our{' '}
          <a href="/contact" className="text-gold underline">
            Contact page
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
