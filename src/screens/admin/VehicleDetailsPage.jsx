import { useEffect, useState } from 'react'
import { useParams } from '@/lib/router'
import { VehicleStatusBadge } from '@/components/admin/vehicles/VehicleStatusBadge'
import { Button } from '@/components/ui/Button'
import { formatPricePerDay } from '@/constants/mockVehicles'
import { routes } from '@/constants/routes'
import { getVehicleById } from '@/services/vehicleService'

function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-1 text-small font-medium text-foreground">{value}</dd>
    </div>
  )
}

export default function VehicleDetailsPage() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [missing, setMissing] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    let active = true
    getVehicleById(id)
      .then((item) => {
        if (active) setVehicle(item)
      })
      .catch(() => {
        if (active) setMissing(true)
      })
    return () => {
      active = false
    }
  }, [id])

  if (missing) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
        <h2 className="text-h3 text-foreground">Vehicle not found</h2>
        <p className="mt-2 text-small text-muted">No fleet record matches this link.</p>
        <Button className="mt-5" to={routes.admin.vehicles}>
          Back to vehicles
        </Button>
      </div>
    )
  }

  if (!vehicle) return <p className="text-small text-muted">Loading vehicle...</p>

  const image = vehicle.images[imageIndex] || vehicle.images[0]
  const created = new Date(vehicle.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        {image ? <img src={image} alt={`${vehicle.brand} ${vehicle.model}`} className="aspect-[16/10] w-full rounded-md object-cover" /> : <div className="grid aspect-[16/10] place-items-center rounded-md bg-canvas text-small text-muted">No photo</div>}
        {vehicle.images.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {vehicle.images.map((item, index) => (
              <button key={item.slice(0, 32) + index} type="button" className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border ${index === imageIndex ? 'border-accent' : 'border-border'}`} aria-label={`Show photo ${index + 1}`} onClick={() => setImageIndex(index)}>
                <img src={item} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </section>
      <section className="space-y-5 rounded-lg border border-border bg-surface p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-h2 text-foreground">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="mt-1 text-small text-muted">
              {vehicle.year} · {vehicle.category}
            </p>
          </div>
          <VehicleStatusBadge status={vehicle.status} />
        </div>
        <dl className="grid grid-cols-2 gap-4">
          <Fact label="Daily price" value={formatPricePerDay(vehicle.dailyPrice)} />
          <Fact label="Weekly price" value={formatPricePerDay(vehicle.weeklyPrice)} />
          <Fact label="Monthly price" value={formatPricePerDay(vehicle.monthlyPrice)} />
          <Fact label="Seats" value={vehicle.seats} />
          <Fact label="Doors" value={vehicle.doors} />
          <Fact label="Transmission" value={vehicle.transmission} />
          <Fact label="Fuel" value={vehicle.fuel} />
          <Fact label="Mileage" value={vehicle.mileage === 0 ? 'Unlimited city mileage' : `${vehicle.mileage} km per day`} />
          <Fact label="Created" value={created} />
        </dl>
        <div>
          <h3 className="text-small font-semibold text-foreground">Description</h3>
          <p className="mt-2 text-small text-muted">{vehicle.description}</p>
        </div>
        <div>
          <h3 className="text-small font-semibold text-foreground">Features</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {vehicle.features.length ? vehicle.features.map((feature) => (
              <li key={feature} className="rounded-full border border-border px-2.5 py-1 text-caption text-foreground">
                {feature}
              </li>
            )) : <li className="text-small text-muted">No features listed.</li>}
          </ul>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button to={routes.admin.editVehicle(vehicle.id)}>Edit vehicle</Button>
          <Button to={routes.admin.vehicles} variant="outline">
            Back to list
          </Button>
        </div>
      </section>
    </div>
  )
}
