import { Fuel, Settings2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatPricePerDay } from '@/constants/mockVehicles'
import { routes } from '@/constants/routes'

const availabilityLabel = {
  available: 'Available',
  reserved: 'Reserved',
  rented: 'Rented',
  maintenance: 'Maintenance',
}

export function BookingVehicleCard({ vehicle }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative aspect-[16/9] bg-[#e7e5e2]">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">{vehicle.category}</p>
            <h2 className="mt-1 text-h3 break-words text-foreground">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="text-small text-muted">{vehicle.year}</p>
          </div>
          <Badge variant={vehicle.availability}>{availabilityLabel[vehicle.availability]}</Badge>
        </div>
        <ul className="grid grid-cols-3 gap-2 text-caption text-muted">
          <li className="flex min-w-0 items-center gap-1.5">
            <Settings2 size={14} aria-hidden="true" />
            <span className="truncate">{vehicle.transmission}</span>
          </li>
          <li className="flex min-w-0 items-center gap-1.5">
            <Fuel size={14} aria-hidden="true" />
            <span className="truncate">{vehicle.fuel}</span>
          </li>
          <li className="flex min-w-0 items-center gap-1.5">
            <Users size={14} aria-hidden="true" />
            <span className="truncate">{vehicle.seats} seats</span>
          </li>
        </ul>
        <p className="text-small text-foreground">
          <span className="font-semibold">{formatPricePerDay(vehicle.pricePerDay)}</span>
          <span className="text-muted"> / day</span>
        </p>
        <Button to={routes.cars} variant="outline" size="sm" className="w-full">
          Change Vehicle
        </Button>
      </div>
    </Card>
  )
}
