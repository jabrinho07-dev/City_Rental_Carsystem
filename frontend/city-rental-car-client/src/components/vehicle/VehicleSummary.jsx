import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'

const availabilityLabel = {
  available: 'Available',
  reserved: 'Reserved',
  rented: 'Rented',
  maintenance: 'Maintenance',
}

export function VehicleSummary({ vehicle, onBook }) {
  const stars = Math.round(vehicle.rating)

  return (
    <section aria-labelledby="vehicle-summary-heading">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">{vehicle.category}</p>
        <Badge variant={vehicle.availability}>{availabilityLabel[vehicle.availability]}</Badge>
      </div>
      <h1 id="vehicle-summary-heading" className="text-h1 mt-3 break-words text-foreground">
        {vehicle.brand} {vehicle.model}
      </h1>
      <p className="mt-2 text-body text-muted">{vehicle.year}</p>
      <p
        className="mt-3 flex flex-wrap items-center gap-2 text-small text-muted"
        aria-label={`${vehicle.rating} out of 5, ${vehicle.reviews} reviews`}
      >
        <span className="flex" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={16}
              className={index < stars ? 'fill-accent text-accent' : 'text-border'}
            />
          ))}
        </span>
        <span className="font-semibold text-foreground">{vehicle.rating.toFixed(1)}</span>
        <span>({vehicle.reviews} reviews)</span>
      </p>
      <p className="mt-4 max-w-2xl text-body text-muted">{vehicle.description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={onBook}>
          Book This Car
        </Button>
        <Button to={routes.contact} variant="outline">
          Contact Us
        </Button>
      </div>
    </section>
  )
}
