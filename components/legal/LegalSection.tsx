export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-body font-medium text-forest text-base mb-2">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}
