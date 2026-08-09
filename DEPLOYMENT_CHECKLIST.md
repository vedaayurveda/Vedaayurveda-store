# VedaAyurveda Website — Test & Deploy Checklist

## 1. Local setup

```bash
# Extract the zip, then inside the folder:
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with real values:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — from your **website** Supabase project (Settings → API)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` — from Razorpay Dashboard → API Keys (use **Test Mode** keys first)
- `SHIPROCKET_EMAIL` / `SHIPROCKET_PASSWORD` — your Shiprocket login
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` for now

## 2. Run all SQL files, in this exact order, in Supabase SQL Editor

1. `veda_website_schema.sql`
2. `supabase_auth_trigger.sql`
3. `veda_products_seed.sql`
4. `supabase_stock_functions.sql`
5. `supabase_newsletter_table.sql`
6. `supabase_franchise_table.sql`
7. `supabase_contact_table.sql`

## 3. Supabase dashboard settings

- **Authentication → Providers → Phone** — enable, select Twilio, add your Account SID/Auth Token (from your earlier Twilio setup)
- **Authentication → URL Configuration** — set Site URL to your real domain once deployed (update later)
- **Storage** — not used yet (product images are placeholder URLs); skip for now

## 4. Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000` and click through:
- [ ] Homepage loads, hero carousel auto-slides, products show up
- [ ] `/products` — category filter works
- [ ] Click into a product — PDP loads, variant selector works (for shampoo/oil/etc.)
- [ ] Add to cart → `/cart` shows the item, quantity +/- works
- [ ] Search icon in header → type 2+ letters → results appear
- [ ] Sign up with email → check inbox for confirmation link (Supabase sends this automatically)
- [ ] Log in → `/account` shows your profile
- [ ] `/account/addresses` → add an address
- [ ] Checkout → fill address → select **Cash on Delivery** first (simplest to test, no real payment) → confirm order → should land on Order Confirmation page
- [ ] Then try **online payment** with Razorpay **test card**: `4111 1111 1111 1111`, any future expiry, any CVV, any OTP screen that appears (test mode auto-approves)
- [ ] `/account/orders` shows the order after checkout

## 5. Common local errors and fixes

- **"Module not found: @/lib/..."** — run `npm install` again, make sure you're in the project root folder
- **Blank white page / hydration error** — check the browser console; usually a missing env var (Supabase URL/key)
- **"Invalid API key" from Supabase** — double check you copied the **anon** key (public) vs **service_role** key (secret) into the right variable
- **Phone OTP not sending** — Twilio DLT registration must be approved first; until then, test with email login only

## 6. Deploy to Vercel

```bash
npm install -g vercel   # if not already installed
vercel login
vercel
```

Or via the Vercel dashboard:
1. Push this folder to a GitHub repo
2. Vercel → New Project → Import the repo
3. In **Environment Variables**, add every variable from `.env.local` (same names)
4. Deploy

## 7. After first deploy

- [ ] Update `NEXT_PUBLIC_SITE_URL` env var on Vercel to your real deployed URL, redeploy
- [ ] Supabase → Authentication → URL Configuration → set Site URL + Redirect URLs to the deployed domain (needed for email confirmation links and OAuth callback to work)
- [ ] Razorpay Dashboard → Webhooks → add `https://your-domain.com/api/razorpay/webhook`, subscribe to `payment.captured` and `payment.failed`
- [ ] Switch Razorpay keys from Test Mode to Live Mode once you're ready to accept real payments (requires Razorpay KYC approval, and typically your Privacy/Terms/Refund/Shipping policy pages live — already built)
- [ ] Test the full flow again on the live URL before sharing it publicly

## 8. Known placeholders to replace before public launch

- Product images are `placehold.co` generated placeholders — swap for real product photography
- WhatsApp number in `DoctorConsultBanner.tsx` and Contact page is a placeholder (`910000000000`) — replace with your real business number
- Testimonials on homepage are sample text — replace with real customer reviews once available
- `PICKUP_LOCATION` in `lib/shiprocket.ts` must match your actual Shiprocket pickup address nickname
