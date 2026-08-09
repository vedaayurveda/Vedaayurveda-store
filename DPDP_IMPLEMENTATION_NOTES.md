# DPDP Act — What Was Implemented in Code, and What's Still Open

This is a pointer, not the full compliance tracker (you chose code-only scope
for this pass). Keep it until these open items are resolved.

## Implemented in this pass
- `supabase_consent_table.sql` — run this migration in Supabase; nothing above works without it
- Granular, unticked consent checkboxes at signup (account creation vs. marketing — separate)
- Explicit OTP-purpose consent checkbox before phone number is used (login/phone page)
- Consent records written server-side with timestamp, policy version, purpose text, IP — `/api/consent`
- Cookie consent banner — functional (disclosed, not blocked) vs. analytics (opt-in)
- Self-serve "Delete my account & data" button on the account page
- DOB field + hard block on signup for anyone declaring under 18 (see caveat below)
- Privacy Policy rewritten: retention periods, processor list, DPDP rights including Right to Nominate, Grievance Officer section
- Confirmed session tokens are NOT in localStorage (Supabase SSR already uses HttpOnly cookies) — no change needed, verified only

## Explicitly NOT decided by me — needs you (or a lawyer)
- **Grievance Officer name/contact** — placeholder `[TODO: Name]` is in the Footer and Privacy Policy. Must be a real, contactable individual before this is legally sufficient.
- **Under-18 handling is MVP-level, not fully compliant.** The signup form blocks anyone who self-declares a DOB under 18. DPDP Module 05 technically requires *verifiable* age proof (government ID, etc.) plus a parental-consent pathway if you intend to actually serve minors with guardian approval — that system is not built. As implemented, under-18 visitors are simply turned away at signup. If that's not the experience you want, this needs a real product decision, not a code fix.
- **Delete-account cascade is unverified.** `/api/account/delete` calls Supabase's `deleteUser()`, which removes the login. Whether `orders`, `addresses`, `cart_items`, etc. cascade-delete depends on foreign key constraints in your core schema file, which isn't in this repo. Check this before telling a user their data is fully erased.
- **GST/financial retention exception is stated in the UI copy but not built.** The Privacy Policy and delete-confirmation text both say order records "may be retained in anonymized form" — no code actually anonymizes anything on deletion yet.
- **DPAs (Data Processing Agreements) with Razorpay, Shiprocket, Supabase, your SMS/OTP gateway, Vercel** — these are contracts you obtain from each vendor, not something I can generate. Module 06 in the original checklist has direct links.
- **DLT/TRAI registration for OTP SMS templates** — a telecom compliance step outside this codebase, required regardless of DPDP.
- **Data Breach Response Plan** — not a code artifact; a one-page internal SOP is what the checklist recommends.
- **Modules 08 and 09 (breach protocol, vendor review process)** — organizational processes, not implemented here.

## One thing worth reconsidering
You chose "general audience, under-18 possible" — which is what triggered the heavy Module 05 obligations above. If VedaAyurveda is realistically adults-only in practice, switching your stated policy to "strictly 18+, enforced via ToS + self-declared age-gate" is a much lighter lift than building real verifiable-parental-consent infrastructure. Worth a second look with whoever advises you legally.
