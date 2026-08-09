'use client'

interface CategoryFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

function toTitleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const all = ['all', ...categories]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      {all.map((cat) => {
        const isActive = cat === active
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              shrink-0 px-4 h-9 rounded-full text-sm font-body font-medium
              transition-colors duration-200
              ${
                isActive
                  ? 'bg-forest text-ivory'
                  : 'bg-surface-container-low text-forest/70 hover:bg-gold/15'
              }
            `}
          >
            {cat === 'all' ? 'All' : toTitleCase(cat)}
          </button>
        )
      })}
    </div>
  )
}
