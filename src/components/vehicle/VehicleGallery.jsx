import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { assetSrc } from '@/lib/assetSrc'

export function VehicleGallery({ images, name }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const current = images[index] || images[0]

  useEffect(() => {
    setIndex(0)
  }, [images])

  function show(next) {
    if (count < 2) return
    setIndex((next + count) % count)
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowLeft') show(index - 1)
    if (event.key === 'ArrowRight') show(index + 1)
  }

  return (
    <section aria-label={`${name} photos`} onKeyDown={onKeyDown}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-[#e7e5e2]">
        <img
          src={assetSrc(current)}
          alt={`${name}, photo ${index + 1} of ${count}`}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <p className="absolute right-3 bottom-3 rounded-full bg-primary/85 px-2.5 py-1 text-caption font-semibold text-white">
          {index + 1} / {count}
        </p>
        {count > 1 ? (
          <>
            <button
              type="button"
              className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-foreground shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Previous image"
              onClick={() => show(index - 1)}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-foreground shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Next image"
              onClick={() => show(index + 1)}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, imageIndex) => {
            const selected = imageIndex === index
            return (
              <button
                key={imageIndex}
                type="button"
                aria-label={`Show photo ${imageIndex + 1} of ${count}`}
                aria-current={selected ? 'true' : undefined}
                onClick={() => setIndex(imageIndex)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border bg-[#e7e5e2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected ? 'border-accent' : 'border-border'}`}
              >
                <img src={assetSrc(image)} alt="" className="h-full w-full object-contain" />
              </button>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
