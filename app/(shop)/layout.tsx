import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'

// This layout wraps every storefront page (home, products, cart, checkout,
// account, etc.) — NOT /auth/* or the (legal)/* pages, which intentionally
// have their own minimal/full-screen layouts.
//
// Header/Footer/BottomNav live here (not per-page) so React keeps them
// mounted across client-side navigation between these routes instead of
// tearing down and rebuilding them on every route change. That remount was
// what made bottom-nav tab switches feel slow — Header re-fetches the cart
// count on every mount.
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* pb reserves space for the fixed mobile BottomNav so it never
          overlaps footer content; md:pb-0 removes it once BottomNav hides. */}
      <div className="pb-16 md:pb-0">{children}</div>
      <Footer />
      <BottomNav />
    </>
  )
}
