/**
 * DPDP Act 2023 consent recording.
 *
 * Every distinct processing purpose gets its own consent row — DPDP requires
 * granular, purpose-specific consent (Module 01.1), not a single "I agree"
 * checkbox. Withdrawal is recorded as a new row with granted:false rather
 * than a delete, so the consent_records table stays an immutable audit trail
 * (this is also what Module 01.1's timestamp/version/purpose-text requirement
 * is asking for).
 *
 * POLICY_VERSION must be bumped whenever the Privacy Policy's substantive
 * terms change — this is what re-consent prompts key off (Module 01.1).
 */

export const POLICY_VERSION = '2026-08-09'

export type ConsentPurpose =
  | 'account_creation'
  | 'marketing_emails'
  | 'analytics_cookies'
  | 'functional_cookies'
  | 'otp_authentication'

export const CONSENT_COPY: Record<ConsentPurpose, string> = {
  account_creation:
    'I agree to VedaAyurveda creating an account using my name, email, and order details, to process my orders and provide customer support.',
  marketing_emails:
    'I agree to receive promotional emails about new products, offers, and wellness content from VedaAyurveda. I can unsubscribe anytime.',
  analytics_cookies:
    'I agree to VedaAyurveda using analytics cookies to understand how I use the site, to improve the shopping experience.',
  functional_cookies:
    'Functional cookies keep you signed in and remember your cart. These are required for the site to work and are not optional.',
  otp_authentication:
    'I agree to receive a one-time password (OTP) via SMS to verify my phone number for sign-in. My number will be used only for this purpose and will not be added to any marketing list without separate consent.',
}

interface RecordConsentInput {
  purpose: ConsentPurpose
  granted: boolean
  /** Pass when known (post-login); omit for pre-account / guest consent (cookie banner, OTP notice). */
  userId?: string
  guestSessionId?: string
}

/**
 * Records a consent decision via the server-side API route (so IP address
 * and user-agent can be captured reliably from the request, not trusted
 * from the client). Call this from client components on checkbox change /
 * form submit — it does not throw; a failed consent write should not block
 * the user's action, but is logged for follow-up.
 */
export async function recordConsent(input: RecordConsentInput): Promise<void> {
  try {
    const res = await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        policyVersion: POLICY_VERSION,
        purposeTextShown: CONSENT_COPY[input.purpose],
      }),
    })
    if (!res.ok) {
      console.error('Consent record failed to save:', await res.text())
    }
  } catch (err) {
    console.error('Consent record request failed:', err)
  }
}
