import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { LegalSection } from '@/components/legal/LegalSection'

export const metadata: Metadata = {
  title: 'Terms & Conditions | VedaAyurveda',
  description: 'Terms and conditions governing use of the VedaAyurveda website and purchases.',
}

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="19 July 2026">
      <p>
        These Terms & Conditions govern your use of vedaayurveda.com and any purchase made
        through it. By accessing our website or placing an order, you agree to these terms.
      </p>

      <LegalSection title="1. About Us">
        <p>
          VedaAyurveda is an Ayurvedic wellness brand based in Prayagraj, Uttar Pradesh, India,
          offering herbal and Ayurvedic products including shampoo, hair oil, protein powder,
          Chyawanprash, and more.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least 18 years old, or purchasing under the supervision of a parent or
          guardian, to place an order on our website.
        </p>
      </LegalSection>

      <LegalSection title="3. Products & Pricing">
        <ul className="list-disc pl-5 space-y-1">
          <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
          <li>We reserve the right to modify prices, product descriptions, and availability without prior notice.</li>
          <li>Product images are for illustration; actual packaging may vary slightly.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Orders & Payment">
        <ul className="list-disc pl-5 space-y-1">
          <li>Orders are confirmed only after successful payment (or COD confirmation).</li>
          <li>We accept payments via UPI, cards, netbanking (through Razorpay), and Cash on Delivery where available.</li>
          <li>We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Shipping">
        <p>
          Please refer to our{' '}
          <a href="/shipping-policy" className="text-gold underline">
            Shipping Policy
          </a>{' '}
          for delivery timelines and charges.
        </p>
      </LegalSection>

      <LegalSection title="6. Returns & Refunds">
        <p>
          Please refer to our{' '}
          <a href="/refund-policy" className="text-gold underline">
            Return & Refund Policy
          </a>{' '}
          for details on eligibility and process.
        </p>
      </LegalSection>

      <LegalSection title="7. Product Use & Disclaimer">
        <p>
          Our products are Ayurvedic formulations intended for general wellness support. They are
          not a substitute for professional medical advice, diagnosis, or treatment. Please
          consult a qualified physician before use if you are pregnant, nursing, have a medical
          condition, or are taking other medications. Discontinue use and consult a doctor if any
          adverse reaction occurs.
        </p>
      </LegalSection>

      <LegalSection title="8. Intellectual Property">
        <p>
          All content on this website — including text, images, logos, and product formulations
          — is the property of VedaAyurveda and may not be reproduced without written permission.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of Liability">
        <p>
          VedaAyurveda shall not be liable for any indirect, incidental, or consequential damages
          arising from the use of our products or website, to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing Law">
        <p>
          These terms are governed by the laws of India, with jurisdiction in Prayagraj, Uttar
          Pradesh.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>
          For any questions regarding these Terms, reach out via our{' '}
          <a href="/contact" className="text-gold underline">
            Contact page
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
