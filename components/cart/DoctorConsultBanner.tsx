import { Stethoscope } from 'lucide-react'

// Static trust banner for now — wire up to a real consult booking flow later
// (e.g. WhatsApp click-to-chat or a booking form) once that's ready.
export function DoctorConsultBanner() {
  return (
    <a
      href="https://wa.me/910000000000?text=Hi%2C%20I%27d%20like%20to%20consult%20an%20Ayurvedic%20doctor"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-forest/5 rounded-md p-3 mb-4 hover:bg-forest/10 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
        <Stethoscope size={18} className="text-forest" />
      </div>
      <div>
        <p className="text-forest text-sm font-medium">Not sure what's right for you?</p>
        <p className="text-forest/60 text-xs">Chat with our Ayurvedic expert — free consultation</p>
      </div>
    </a>
  )
}
