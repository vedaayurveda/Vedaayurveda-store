import { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated: string
  children: ReactNode
}) {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <h1 className="font-display text-forest text-2xl md:text-3xl font-medium mb-2">
          {title}
        </h1>
        <p className="text-forest/50 text-xs mb-8">Last updated: {lastUpdated}</p>

        <div className="prose-legal text-forest/80 text-sm leading-relaxed space-y-5">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
