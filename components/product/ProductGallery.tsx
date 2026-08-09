'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface GalleryImage {
  url: string
  alt_text: string | null
}

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const displayImages = images.length > 0 ? images : [{ url: '', alt_text: productName }]

  return (
    <>
      <div className="w-full">
        {/* Main image */}
        <div
          onClick={() => setZoomed(true)}
          className="w-full aspect-square bg-surface-container-low overflow-hidden cursor-zoom-in"
        >
          {displayImages[active].url ? (
            <img
              src={displayImages[active].url}
              alt={displayImages[active].alt_text ?? productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-forest/30 font-display text-xl px-8 text-center">
              {productName}
            </div>
          )}
        </div>

        {/* Thumbnail strip — only shown when multiple images exist */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {displayImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`
                  shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors
                  ${i === active ? 'border-gold' : 'border-transparent'}
                `}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen zoom overlay */}
      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center"
        >
          <button
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
          >
            <X size={20} />
          </button>
          {displayImages[active].url && (
            <img
              src={displayImages[active].url}
              alt={displayImages[active].alt_text ?? productName}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  )
}
