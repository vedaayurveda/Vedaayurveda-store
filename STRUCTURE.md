# VedaAyurveda Website — Next.js Project Structure

Framework: Next.js 14+ (App Router) · Supabase · Razorpay · Shiprocket · Vercel

```
veda-website/
├── app/
│   ├── layout.tsx                     # Root layout — header, footer, fonts
│   ├── page.tsx                       # Homepage (hero carousel, trust strip, product showcase, etc.)
│   ├── globals.css                    # Tailwind base + M3 tonal CSS variables
│   │
│   ├── products/
│   │   ├── page.tsx                   # Product listing (all SKUs grid)
│   │   └── [slug]/
│   │       └── page.tsx               # PDP — single scroll, gallery, accordion info
│   │
│   ├── cart/
│   │   └── page.tsx                   # Cart page (items, cross-sell, doctor consult banner)
│   │
│   ├── checkout/
│   │   └── page.tsx                   # Single-page accordion checkout
│   │
│   ├── order-confirmation/
│   │   └── [orderId]/
│   │       └── page.tsx               # Post-payment success page
│   │
│   ├── account/
│   │   ├── page.tsx                   # Profile / order history
│   │   ├── addresses/page.tsx
│   │   └── orders/[orderId]/page.tsx  # Track order
│   │
│   ├── about/page.tsx                 # Brand story
│   ├── franchise/page.tsx             # Franchise enquiry
│   ├── contact/page.tsx
│   ├── blog/
│   │   ├── page.tsx                   # Blog listing (SEO long-tail content)
│   │   └── [slug]/page.tsx
│   │
│   ├── (legal)/
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── shipping-policy/page.tsx
│   │   └── refund-policy/page.tsx
│   │
│   ├── auth/
│   │   ├── login/page.tsx             # Email/phone login
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts          # Supabase auth callback
│   │
│   └── api/
│       ├── cart/route.ts              # Guest + user cart operations (service role)
│       ├── checkout/
│       │   ├── create-order/route.ts  # Creates Razorpay order
│       │   └── verify-payment/route.ts# Verifies signature, updates order status
│       ├── razorpay/
│       │   └── webhook/route.ts       # Razorpay webhook (payment.captured etc.)
│       ├── shiprocket/
│       │   └── create-shipment/route.ts
│       └── newsletter/route.ts        # Email/WhatsApp capture
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                 # Hamburger + logo + search/cart/profile
│   │   ├── NavDrawer.tsx              # Side sheet nav (70% width, scrim)
│   │   ├── Footer.tsx
│   │   └── BottomNav.tsx              # Mobile bottom nav
│   │
│   ├── home/
│   │   ├── HeroCarousel.tsx
│   │   ├── TrustStrip.tsx
│   │   ├── ProductShowcase.tsx
│   │   ├── BrandStoryStrip.tsx
│   │   ├── WhyVedaAyurveda.tsx
│   │   ├── Testimonials.tsx
│   │   └── NewsletterSignup.tsx
│   │
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx         # tap-to-zoom
│   │   ├── VariantSelector.tsx
│   │   ├── AddToCartBar.tsx           # sticky, scroll-triggered
│   │   ├── ProductAccordion.tsx       # Description/Ingredients/How to Use/Benefits
│   │   └── RelatedProducts.tsx
│   │
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── FreeShippingBar.tsx
│   │   ├── CrossSell.tsx
│   │   └── DoctorConsultBanner.tsx
│   │
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── OrderSummary.tsx
│   │   ├── PaymentMethodSelector.tsx
│   │   └── CheckoutSteps.tsx
│   │
│   └── ui/                            # Reusable primitives (M3 expressive)
│       ├── Button.tsx                 # filled / tonal / outlined / text / FAB
│       ├── Card.tsx
│       ├── Accordion.tsx
│       ├── Toast.tsx
│       ├── Skeleton.tsx
│       └── QuantityStepper.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # browser client
│   │   ├── server.ts                  # server component client
│   │   └── admin.ts                   # service_role client (server-only, never exposed)
│   ├── razorpay.ts
│   ├── shiprocket.ts
│   ├── cart.ts                        # cart helper functions (guest session_id logic)
│   └── utils.ts
│
├── types/
│   └── database.types.ts              # generated from Supabase schema
│
├── public/
│   ├── logo.svg
│   └── images/
│
├── proxy.ts                            # Supabase session refresh (Next.js 16 proxy convention)
├── next.config.js
├── tailwind.config.ts                 # M3 tonal palette, spacing scale, radii from Notion doc
├── package.json
└── .env.local                         # Supabase URL/keys, Razorpay keys, Shiprocket keys
```

## Notes tying structure back to the Notion design doc

- **Design tokens** (spacing scale, radii, breakpoints, elevation levels) go into `tailwind.config.ts` as custom theme values — not hardcoded per component.
- **`AddToCartBar.tsx`** implements the scroll-triggered sticky behavior finalized in the doc.
- **`NavDrawer.tsx`** implements the 70% width + scrim + springy slide-in spec.
- **Guest cart**: `lib/cart.ts` manages a `session_id` cookie for guests, synced to the `carts` table via `/api/cart` (service role bypasses RLS since guest has no `auth.uid()`).
- **Admin dashboard** (order management, inventory sync) is intentionally left out of this structure — separate app/subdomain, per the "to be detailed separately" note in the doc.
