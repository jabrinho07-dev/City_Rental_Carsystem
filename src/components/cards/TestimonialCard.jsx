import { Star } from 'lucide-react'
import { assetSrc } from '@/lib/assetSrc'

export function TestimonialCard({ quote, name, detail, rating = 0, image, imageAlt }) {
  return (
    <figure className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 shadow-card transition duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-float">
      {rating > 0 ? (
        <div className="flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={16}
              aria-hidden="true"
              className={index < rating ? 'fill-accent text-accent' : 'text-border'}
            />
          ))}
        </div>
      ) : null}
      <blockquote className={rating > 0 ? 'mt-4 text-body text-foreground' : 'text-body text-foreground'}>
        “{quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {image ? (
          <img
            src={assetSrc(image)}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="size-11 rounded-md object-cover"
          />
        ) : null}
        <div>
          <p className="text-small font-semibold text-foreground">{name}</p>
          <p className="text-caption text-muted">{detail}</p>
        </div>
      </figcaption>
    </figure>
  )
}
