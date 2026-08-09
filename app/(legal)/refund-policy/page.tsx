import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { LegalSection } from '@/components/legal/LegalSection'

export const metadata: Metadata = {
  title: 'Return & Refund Policy | VedaAyurveda',
  description: 'Return eligibility, refund process, and timelines for VedaAyurveda orders.',
}

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Return & Refund Policy" lastUpdated="19 July 2026">
      <LegalSection title="1. Our Approach">
        <p>
          Because our products are consumable Ayurvedic health and personal care items, we're
          only able to accept returns in specific situations to protect the safety and quality of
          what every customer receives.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligible for Return/Replacement">
        <ul className="list-disc pl-5 space-y-1">
          <li>You received a damaged, defective, or leaking product</li>
          <li>You received the wrong product or variant</li>
          <li>The product is missing from your delivered package</li>
        </ul>
        <p>
          Please report these issues within <strong>48 hours</strong> of delivery, with photos of
          the product and packaging, via our{' '}
          <a href="/contact" className="text-gold underline">
            Contact page
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="3. Not Eligible for Return">
        <ul className="list-disc pl-5 space-y-1">
          <li>Products that have been opened, used, or have a broken seal (for hygiene and safety reasons)</li>
          <li>Change of mind after delivery</li>
          <li>Products damaged due to misuse or improper storage</li>
          <li>Requests raised after 48 hours of delivery</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Refund Process">
        <p>Once your return request is approved:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Prepaid orders are refunded to the original payment method within 5-7 business days.</li>
          <li>COD orders are refunded via bank transfer or UPI, once account details are shared.</li>
          <li>You'll receive an email/SMS confirmation once the refund is processed.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Cancellations">
        <p>
          Orders can be cancelled before they are shipped by contacting us as soon as possible.
          Once an order has been dispatched, it cannot be cancelled but may be eligible for return
          per the criteria above.
        </p>
      </LegalSection>

      <LegalSection title="6. Replacement Shipping">
        <p>
          For approved replacements due to damaged, defective, or incorrect items, we cover the
          shipping cost of sending the replacement.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact Us">
        <p>
          To initiate a return, replacement, or refund request, please reach out via our{' '}
          <a href="/contact" className="text-gold underline">
            Contact page
          </a>{' '}
          with your order number and details of the issue.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
