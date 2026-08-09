import { Star } from 'lucide-react'

// Placeholder until a real reviews/ratings system is built.
export function ProductReviews() {
  return (
    <section className="mt-8 pt-6 border-t border-forest/10">
      <h2 className="font-display text-forest text-lg md:text-xl font-medium mb-3">
        Reviews
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} className="text-forest/20" />
          ))}
        </div>
        <span className="text-forest/50 text-sm">No reviews yet — be the first!</span>
      </div>
    </section>
  )
}
