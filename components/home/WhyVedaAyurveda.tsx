import { Leaf, FlaskConical, ShieldOff, MapPin } from 'lucide-react'

const points = [
  {
    icon: Leaf,
    title: 'Traditional Formulations',
    description: 'Recipes rooted in classical Ayurvedic texts, not shortcuts.',
  },
  {
    icon: FlaskConical,
    title: 'Lab Tested',
    description: 'Every batch checked for purity and potency before it ships.',
  },
  {
    icon: ShieldOff,
    title: 'No Harmful Chemicals',
    description: 'Free from sulfates, parabens, and synthetic fillers.',
  },
  {
    icon: MapPin,
    title: 'Made in India',
    description: 'Sourced, formulated, and packed close to home in Prayagraj.',
  },
]

export function WhyVedaAyurveda() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest via-[#1a4f32] to-[#123322] py-12 md:py-16">
      {/* Faint botanical glow — same restrained texture language as the Footer's brand panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, white 0%, transparent 35%), radial-gradient(circle at 90% 80%, white 0%, transparent 35%)',
        }}
      />

      <div className="relative max-w-container mx-auto px-4 md:px-8">
        <h2 className="font-display text-ivory text-2xl md:text-3xl font-medium mb-8 text-center">
          Why VedaAyurveda
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {points.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 p-5 md:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-200 hover:bg-white/[0.14]"
            >
              <div className="w-14 h-14 rounded-full bg-lime/20 flex items-center justify-center">
                <Icon size={24} className="text-lime" strokeWidth={1.75} />
              </div>
              <h3 className="font-body font-medium text-ivory text-sm md:text-base">{title}</h3>
              <p className="text-white/60 text-xs md:text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
