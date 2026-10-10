import { Info } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { rentalRequirements } from '@/constants/vehicleOptions'

export function RentalRequirements() {
  return (
    <section aria-labelledby="rental-requirements-heading">
      <Card>
        <div className="flex items-center gap-2">
          <Info size={18} aria-hidden="true" className="text-accent" />
          <h2 id="rental-requirements-heading" className="text-h3 text-foreground">
            Rental Requirements
          </h2>
        </div>
        <ul className="mt-4 space-y-2 text-small text-muted">
          {rentalRequirements.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}
