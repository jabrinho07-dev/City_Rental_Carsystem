import { formatPricePerDay } from '@/constants/mockVehicles'
import { VehicleActions } from '@/components/admin/vehicles/VehicleActions'
import { VehicleStatusBadge } from '@/components/admin/vehicles/VehicleStatusBadge'

export function VehicleMobileCards({ vehicles, onView, onEdit, onStatus, onDelete }) {
  return (
    <div className="grid gap-3 md:hidden">
      {vehicles.map((vehicle) => (
        <article key={vehicle.id} className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
          {vehicle.images[0] ? <img src={vehicle.images[0]} alt="" className="h-36 w-full object-cover" /> : null}
          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-h3 text-foreground">
                  {vehicle.brand} {vehicle.model}
                </h2>
                <p className="mt-1 text-small text-muted">
                  {vehicle.year} · {vehicle.category} · {vehicle.transmission}
                </p>
              </div>
              <VehicleStatusBadge status={vehicle.status} />
            </div>
            <p className="text-small font-semibold text-foreground">{formatPricePerDay(vehicle.dailyPrice)} / day</p>
            <VehicleActions
              vehicle={vehicle}
              layout="grid"
              onView={onView}
              onEdit={onEdit}
              onStatus={onStatus}
              onDelete={onDelete}
            />
          </div>
        </article>
      ))}
    </div>
  )
}
