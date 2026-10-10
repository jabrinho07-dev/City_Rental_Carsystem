import { Fuel, Settings2, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPricePerDay } from '@/mocks/vehicles'

const availabilityLabel = {
  available: 'Available',
  reserved: 'Reserved',
  rented: 'Rented',
  maintenance: 'Maintenance',
}

export function VehicleCard({ vehicle, to, bookTo = '/#booking-search' }) {
  const href = to || `/cars/${vehicle.id}`

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-float">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e7e5e2]">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain motion-safe:transition motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={vehicle.availability}>{availabilityLabel[vehicle.availability]}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">{vehicle.category}</p>
        <h3 className="mt-2 text-h3 break-words text-foreground">
          {vehicle.brand} {vehicle.model}
        </h3>
        {typeof vehicle.rating === 'number' ? (
          <p className="mt-2 flex items-center gap-1.5 text-caption text-muted" aria-label={`${vehicle.rating} out of 5, ${vehicle.reviews} reviews`}>
            <Star size={14} className="fill-accent text-accent" aria-hidden="true" />
            <span>{vehicle.rating.toFixed(1)}</span>
            {vehicle.reviews ? <span>({vehicle.reviews})</span> : null}
          </p>
        ) : null}
        <ul className="mt-4 grid grid-cols-3 gap-2 text-caption text-muted">
          <li className="flex min-w-0 items-center gap-1.5">
            <Settings2 size={14} aria-hidden="true" />
            {vehicle.transmission}
          </li>
          <li className="flex min-w-0 items-center gap-1.5">
            <Fuel size={14} aria-hidden="true" />
            {vehicle.fuel}
          </li>
          <li className="flex min-w-0 items-center gap-1.5">
            <Users size={14} aria-hidden="true" />
            {vehicle.seats} seats
          </li>
        </ul>
        <p className="mt-5">
          <span className="text-h3 text-foreground">{formatPricePerDay(vehicle.pricePerDay)}</span>
          <span className="text-small text-muted"> / day</span>
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Button to={href} variant="outline" size="sm">
            View Details
          </Button>
          <Button to={bookTo} size="sm">
            Book Now
          </Button>
        </div>
      </div>
    </article>
  )
}
