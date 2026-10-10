import { CalendarCheck, CarFront } from 'lucide-react'
import { useState } from 'react'
import { BookingCard } from '@/components/cards/BookingCard'
import { FeatureCard } from '@/components/cards/FeatureCard'
import { StatCard } from '@/components/cards/StatCard'
import { TestimonialCard } from '@/components/cards/TestimonialCard'
import { VehicleCard } from '@/components/cards/VehicleCard'
import { Container } from '@/components/common/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { DateInput } from '@/components/ui/DateInput'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Radio } from '@/components/ui/Radio'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import { TimeInput } from '@/components/ui/TimeInput'
import { mockVehicles } from '@/mocks/vehicles'

const badges = [
  ['available', 'Available'],
  ['reserved', 'Reserved'],
  ['rented', 'Rented'],
  ['maintenance', 'Maintenance'],
  ['pending', 'Pending'],
  ['confirmed', 'Confirmed'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
  ['paid', 'Paid'],
  ['unpaid', 'Unpaid'],
]

export default function DesignSystemPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="py-section">
      <Container className="space-y-section">
        <header className="max-w-3xl">
          <p className="text-caption font-semibold tracking-[0.16em] text-accent uppercase">Foundation</p>
          <h1 className="mt-3 text-display text-primary">Design system</h1>
          <p className="mt-4 text-body text-muted">
            Reusable City Rental Car interface pieces. This screen is for checking the system, not a customer page.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-h2 text-primary">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <Button icon={CarFront} size="sm">Small</Button>
            <Button icon={CarFront} iconPosition="right" size="lg">Large</Button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 text-primary">Fields</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Input id="ds-name" label="Full name" placeholder="Your name" hint="As it appears on your license." />
            <Input id="ds-email" label="Email" type="email" placeholder="you@example.com" error="Enter a valid email address." />
            <SearchInput id="ds-search" label="Search" placeholder="Search the fleet" />
            <Select
              id="ds-class"
              label="Vehicle class"
              placeholder="Choose a class"
              options={[
                { value: 'sedan', label: 'Sedan' },
                { value: 'suv', label: 'SUV' },
              ]}
            />
            <DateInput id="ds-date" label="Pickup date" />
            <TimeInput id="ds-time" label="Pickup time" />
            <Textarea id="ds-note" label="Note" placeholder="Anything the desk should know" className="md:col-span-2" />
            <Checkbox id="ds-terms" label="I agree to the sample terms" />
            <Radio id="ds-desk" name="pickup" label="City desk" />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 text-primary">Badges</h2>
          <div className="flex flex-wrap gap-2">
            {badges.map(([variant, label]) => (
              <Badge key={variant} variant={variant}>
                {label}
              </Badge>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 text-primary">Cards</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <StatCard icon={CarFront} label="Fleet" value="6" hint="Sample vehicles" />
            <FeatureCard icon={CalendarCheck} title="Clear terms" text="Rates and conditions stay visible before a reservation." />
            <TestimonialCard quote="The desk was calm, and the car was ready when I arrived." name="Amina Hassan" detail="Sample traveler" />
          </div>
          <BookingCard
            reference="BK-1042"
            vehicle="Toyota Prado"
            dates="12 Oct – 16 Oct"
            status="confirmed"
            statusLabel="Confirmed"
            amount="$480"
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mockVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 text-primary">Feedback</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Spinner />
            <Button variant="outline" onClick={() => setOpen(true)}>
              Open modal
            </Button>
          </div>
          <div className="grid max-w-md gap-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Modal open={open} title="Sample dialog" onClose={() => setOpen(false)}>
            This dialog is part of the design system. It does not save anything.
          </Modal>
        </section>
      </Container>
    </div>
  )
}
