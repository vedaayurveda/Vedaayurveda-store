import { Leaf, Truck, ShieldCheck, BadgeCheck } from 'lucide-react'

const badges = [
  { icon: Leaf, label: '100% Ayurvedic' },
  { icon: Truck, label: 'COD Available' },
  { icon: ShieldCheck, label: 'Free Shipping' },
  { icon: BadgeCheck, label: 'FSSAI Certified' },
]

export function TrustStrip() {
  // Duplicate the badge list so the marquee track can loop seamlessly.
  const track = [...badges, ...badges]

  return (
    <section className="bg-surface-container-low border-b border-forest/10 overflow-hidden group">
      <div className="max-w-container mx-auto py-3">
        <div className="flex w-max animate-marquee-rtl group-hover:[animation-play-state:paused]">
          {track.map(({ icon: Icon, label }, i) => (
            <div key={`${label}-${i}`} className="flex items-center gap-2 shrink-0 px-6 md:px-10">
              <Icon size={16} className="text-forest" strokeWidth={2} />
              <span className="text-forest text-xs md:text-sm font-body font-medium whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
