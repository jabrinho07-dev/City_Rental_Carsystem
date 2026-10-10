import { rentalExtras } from '@/constants/vehicleOptions'
import { Checkbox } from '@/components/ui/Checkbox'
import { formatPricePerDay } from '@/constants/mockVehicles'
import { cn } from '@/utils/cn'

export function RentalExtras({ selectedIds, onChange }) {
  function toggle(id) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  }

  return (
    <fieldset>
      <legend className="text-small font-semibold text-foreground">Optional extras</legend>
      <div className="mt-3 space-y-2">
        {rentalExtras.map((extra) => {
          const checked = selectedIds.includes(extra.id)
          return (
            <div
              key={extra.id}
              className={cn('rounded-md border p-3', checked ? 'border-accent bg-accent/5' : 'border-border')}
            >
              <Checkbox
                id={`extra-${extra.id}`}
                label={`${extra.name} · +${formatPricePerDay(extra.pricePerDay)}/day`}
                hint={extra.description}
                checked={checked}
                onChange={() => toggle(extra.id)}
              />
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
