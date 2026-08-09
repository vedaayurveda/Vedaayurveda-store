import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { LegalSection } from '@/components/legal/LegalSection'

export const metadata: Metadata = {
  title: 'Privacy Policy | VedaAyurveda',
  description: 'How VedaAyurveda collects, uses, and protects your personal information.',
}

// Keep in sync with lib/consent.ts POLICY_VERSION — bump both together
// whenever the substantive terms below change, so the cookie banner and
// account signup re-prompt existing users for consent (DPDP Module 01.1).
const POLICY_VERSION_DATE = '9 August 2026'

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={POLICY_VERSION_DATE}>
      <p>
        VedaAyurveda (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, and safeguard your information when you visit
        vedaayurveda.com or make a purchase from us, and describes your rights under the Digital
        Personal Data Protection Act, 2023 (DPDP Act).
      </p>

      <LegalSection title="1. Information We Collect">
        <p>We collect information you provide directly to us, including:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name, email address, phone number, and shipping/billing address — collected at signup or checkout, used to create your account and fulfil orders</li>
          <li>Date of birth — collected at signup, used solely to confirm you meet our minimum age requirement</li>
          <li>Order history and payment information (processed securely via Razorpay — VedaAyurveda does not store your card details)</li>
          <li>Account credentials, if you create an account</li>
          <li>Communications you send us, including support requests</li>
        </ul>
        <p className="mt-2">
          We also collect limited technical information automatically — IP address, device/browser
          type, and pages visited — via functional and (if you consent) analytics cookies. See{' '}
          <a href="#cookies" className="text-gold underline">Section 6</a> below.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Use Your Information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To process and fulfil your orders, including shipping and delivery</li>
          <li>To communicate with you about your order, account, or support requests</li>
          <li>To send promotional offers, only if you&apos;ve separately opted in (you may unsubscribe anytime)</li>
          <li>To verify your identity for phone-based sign-in via OTP</li>
          <li>To improve our products, website, and customer experience</li>
          <li>To comply with legal obligations, including tax and accounting record-keeping</li>
        </ul>
        <p className="mt-2">
          Each of the above is a separate processing purpose. We collect consent for each purpose
          individually where consent is our legal basis for processing — agreeing to create an account
          does not mean you&apos;ve agreed to receive marketing emails, and vice versa.
        </p>
      </LegalSection>

      <LegalSection title="3. Data Retention">
        <p>
          We retain personal data only for as long as needed for the purpose it was collected, or as
          required by law:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account and profile data — retained while your account is active, deleted on request (see Section 5)</li>
          <li>Order records — retained as required under Indian tax and accounting law, even after account deletion; retained records are stripped of unnecessary personal detail where legally possible</li>
          <li>Consent records — retained as an audit trail of what you agreed to and when</li>
          <li>Server and access logs containing personal data — retained for a maximum of 90 days</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Sharing Your Information">
        <p>We do not sell your personal information. We share information only with the following data processors, each acting on our instructions and under a data processing agreement:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Razorpay — to process payments</li>
          <li>Shiprocket and courier partners — to deliver your orders</li>
          <li>Supabase — to host our database and manage authentication</li>
          <li>Vercel — to host our website</li>
          <li>SMS/OTP gateway providers — to deliver one-time passwords for phone sign-in</li>
          <li>Law enforcement or regulators, when required by law</li>
        </ul>
        <p className="mt-2">
          These providers may process data outside India. We only transfer data to countries not
          restricted by the Central Government under the DPDP Act.
        </p>
      </LegalSection>

      <LegalSection title="5. Your Rights">
        <p>Under the DPDP Act, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Access</strong> a summary of the personal data we hold about you</li>
          <li><strong>Correct</strong> inaccurate or incomplete data — most fields can be edited directly from your account dashboard</li>
          <li><strong>Erase</strong> your account and associated personal data — use the &quot;Delete my account &amp; data&quot; option on your account page; no email request required</li>
          <li><strong>Withdraw consent</strong> at any time, as easily as you gave it — from your account settings, or by adjusting your cookie preferences</li>
          <li><strong>Nominate</strong> another individual to exercise these rights on your behalf in the event of your death or incapacity — to register a nominee, contact our Grievance Officer below; this is a new right under Indian law with rules still pending from the government, so our process may evolve</li>
        </ul>
        <p className="mt-2">
          We aim to respond to access, correction, and erasure requests within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies">
        <p id="cookies">We use two categories of cookies:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Functional cookies</strong> (required) — keep you signed in and remember your cart. The site cannot work correctly without these.</li>
          <li><strong>Analytics cookies</strong> (optional) — help us understand how the site is used, so we can improve it. You can accept or decline these separately via the cookie banner, and change your choice anytime by clearing your browser&apos;s local storage for this site.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Children's Privacy">
        <p>
          VedaAyurveda requires all account holders to be 18 years of age or older, verified at signup.
          We do not knowingly create accounts for, or process personal data from, anyone under 18. If
          we become aware that we have collected data from a user under 18 without appropriate
          consent, we will delete that account and associated data. If you believe a child has created
          an account with us, please contact our Grievance Officer below.
        </p>
      </LegalSection>

      <LegalSection title="8. Data Security & Breach Notification">
        <p>
          We use industry-standard measures to protect your data, including encrypted connections,
          secure payment processing, and access controls. However, no method of transmission over the
          internet is 100% secure, and we cannot guarantee absolute security. In the event of a data
          breach affecting your personal data, we will notify affected users and the Data Protection
          Board of India in accordance with the DPDP Act.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be posted on this
          page with an updated revision date, and where required, we will ask existing users to
          re-confirm their consent.
        </p>
      </LegalSection>

      <LegalSection title="10. Grievance Officer & Contact">
        <p>
          In accordance with the DPDP Act, 2023, we have designated a Grievance Officer to address
          your questions, concerns, or complaints about how your personal data is handled.
        </p>
        <p className="mt-2">
          <strong>Grievance Officer:</strong> [TODO: Name] <br />
          <strong>Email:</strong>{' '}
          <a href="mailto:grievance@vedaayurveda.com" className="text-gold underline">
            grievance@vedaayurveda.com
          </a>
          <br />
          <strong>Response time:</strong> within 30 days
        </p>
        <p className="mt-2">
          For general queries, you can also reach us via our{' '}
          <a href="/contact" className="text-gold underline">
            Contact page
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
