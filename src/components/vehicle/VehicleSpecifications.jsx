import { Calendar, DoorOpen, Fuel, Gauge, Settings2, Snowflake, Tag, Users } from 'lucide-react'

export function VehicleSpecifications({ vehicle }) {
  const specs = [
    { icon: Users, label: 'Seats', value: String(vehicle.seats) },
    { icon: DoorOpen, label: 'Doors', value: String(vehicle.doors) },
    { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuel },
    { icon: Gauge, label: 'Mileage', value: vehicle.mileage },
    { icon: Calendar, label: 'Year', value: String(vehicle.year) },
    { icon: Tag, label: 'Category', value: vehicle.category },
    { icon: Snowflake, label: 'Air Conditioning', value: vehicle.airConditioning ? 'Yes' : 'No' },
  ]

  return (
    <section aria-labelledby="vehicle-specs-heading">
      <h2 id="vehicle-specs-heading" className="text-h2 text-foreground">
        Specifications
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {specs.map((spec) => {
          const Icon = spec.icon
          return (
            <div key={spec.label} className="min-w-0 rounded-lg border border-border bg-surface p-4 shadow-card">
              <dt className="flex items-center gap-2 text-caption text-muted">
                <Icon size={16} aria-hidden="true" className="shrink-0" />
                <span className="truncate">{spec.label}</span>
              </dt>
              <dd className="mt-2 text-small font-semibold break-words text-foreground">{spec.value}</dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
