import { formatPricePerDay } from '@/constants/mockVehicles'
import { VehicleActions } from '@/components/admin/vehicles/VehicleActions'
import { VehicleStatusBadge } from '@/components/admin/vehicles/VehicleStatusBadge'

export function VehicleTable({ vehicles, onView, onEdit, onStatus, onDelete }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-border bg-surface shadow-card md:block">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Fleet vehicles</caption>
        <thead className="bg-canvas text-caption font-semibold tracking-wide text-muted uppercase">
          <tr>
            {['Vehicle', 'Year', 'Category', 'Daily price', 'Transmission', 'Status', 'Actions'].map((heading) => (
              <th key={heading} scope="col" className="px-4 py-3 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="border-t border-border">
              <th scope="row" className="px-4 py-3 font-medium">
                <div className="flex items-center gap-3">
                  {vehicle.images[0] ? (
                    <img src={vehicle.images[0]} alt="" className="size-14 rounded-md object-cover" />
                  ) : (
                    <div className="grid size-14 place-items-center rounded-md bg-canvas text-caption text-muted">No photo</div>
                  )}
                  <span>
                    {vehicle.brand} {vehicle.model}
                  </span>
                </div>
              </th>
              <td className="px-4 py-3 text-small text-foreground">{vehicle.year}</td>
              <td className="px-4 py-3 text-small text-foreground">{vehicle.category}</td>
              <td className="px-4 py-3 text-small font-semibold text-foreground">{formatPricePerDay(vehicle.dailyPrice)}</td>
              <td className="px-4 py-3 text-small text-foreground">{vehicle.transmission}</td>
              <td className="px-4 py-3">
                <VehicleStatusBadge status={vehicle.status} />
              </td>
              <td className="px-4 py-3">
                <VehicleActions vehicle={vehicle} onView={onView} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
