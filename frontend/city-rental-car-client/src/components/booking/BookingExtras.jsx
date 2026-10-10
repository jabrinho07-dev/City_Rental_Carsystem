import { Checkbox } from '@/components/ui/Checkbox'
import { rentalExtras } from '@/constants/vehicleOptions'
import { formatPricePerDay } from '@/constants/mockVehicles'
import { formatDuration } from '@/utils/bookingPrice'
import { cn } from '@/utils/cn'

export function BookingExtras({ selectedIds, days, onToggle }) {
  return (
    <section aria-labelledby="booking-extras-heading">
      <h2 id="booking-extras-heading" className="text-h3 text-foreground">
        Rental Extras
      </h2>
      <p className="mt-1 text-small text-muted">
        Optional extras are charged for {days > 0 ? formatDuration(days).toLowerCase() : 'the rental'}.
      </p>
      <div className="mt-4 space-y-2">
        {rentalExtras.map((extra) => {
          const checked = selectedIds.includes(extra.id)
          const lineTotal = extra.pricePerDay * (days || 0)
          return (
            <div key={extra.id} className={cn('rounded-md border p-3', checked ? 'border-accent bg-accent/5' : 'border-border')}>
              <Checkbox
                id={`booking-extra-${extra.id}`}
                label={`${extra.name} · ${formatPricePerDay(extra.pricePerDay)}/day`}
                hint={extra.description}
                checked={checked}
                onChange={() => onToggle(extra.id)}
              />
              <p className="mt-2 pl-7 text-caption text-muted">
                {days > 0 ? `${formatPricePerDay(extra.pricePerDay)} × ${days} = ${formatPricePerDay(lineTotal)}` : 'Select dates to calculate this extra.'}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
