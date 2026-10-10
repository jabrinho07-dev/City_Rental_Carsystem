import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RentalExtras } from '@/components/vehicle/RentalExtras'
import { DateInput } from '@/components/ui/DateInput'
import { TimeInput } from '@/components/ui/TimeInput'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { rentalExtras } from '@/constants/vehicleOptions'
import { formatPricePerDay } from '@/constants/mockVehicles'
import { routes } from '@/constants/routes'
import { calculateRentalPrice, countRentalDays, formatDuration, todayDateString, validateBookingSchedule } from '@/utils/bookingPrice'

const availabilityCopy = {
  available: { label: 'Available', message: 'Available for Booking', bookable: true },
  reserved: { label: 'Reserved', message: 'Currently Reserved', bookable: false },
  rented: { label: 'Rented', message: 'Currently Rented', bookable: false },
  maintenance: { label: 'Maintenance', message: 'Under Maintenance', bookable: false },
}

const emptySchedule = {
  pickupDate: '',
  returnDate: '',
  pickupTime: '',
  returnTime: '',
}

export function VehicleBookingCard({ vehicle }) {
  const navigate = useNavigate()
  const status = availabilityCopy[vehicle.availability] || availabilityCopy.maintenance
  const today = todayDateString()
  const [schedule, setSchedule] = useState(emptySchedule)
  const [selectedIds, setSelectedIds] = useState([])
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const selectedExtras = rentalExtras.filter((extra) => selectedIds.includes(extra.id))
  const scheduleErrors = validateBookingSchedule(schedule, today)
  const days = scheduleErrors.pickupDate || scheduleErrors.returnDate ? 0 : countRentalDays(schedule.pickupDate, schedule.returnDate)
  const price = calculateRentalPrice({
    dailyRate: vehicle.pricePerDay,
    weeklyRate: vehicle.pricePerWeek,
    monthlyRate: vehicle.pricePerMonth,
    days,
    extras: selectedExtras,
  })
  const visibleErrors = submitted ? errors : {}

  function updateSchedule(key, value) {
    const next = { ...schedule, [key]: value }
    setSchedule(next)
    if (submitted) setErrors(validateBookingSchedule(next, today))
  }

  function continueToBooking(event) {
    event.preventDefault()
    if (!status.bookable) return
    setSubmitted(true)
    const nextErrors = validateBookingSchedule(schedule, today)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const estimate = calculateRentalPrice({
      dailyRate: vehicle.pricePerDay,
      weeklyRate: vehicle.pricePerWeek,
      monthlyRate: vehicle.pricePerMonth,
      days: countRentalDays(schedule.pickupDate, schedule.returnDate),
      extras: selectedExtras,
    })

    navigate(routes.customer.newBooking, {
      state: {
        vehicleId: vehicle.id,
        pickupDate: schedule.pickupDate,
        returnDate: schedule.returnDate,
        pickupTime: schedule.pickupTime,
        returnTime: schedule.returnTime,
        extras: selectedExtras.map(({ id, name, pricePerDay }) => ({ id, name, pricePerDay })),
        estimatedTotal: estimate.total,
      },
    })
  }

  return (
    <Card id="vehicle-booking" className="scroll-mt-24">
      <form className="space-y-5" noValidate onSubmit={continueToBooking}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-small font-medium text-foreground">{status.message}</p>
            <p className="mt-1 text-caption text-muted">Estimated price only. Payment is not collected here.</p>
          </div>
          <Badge variant={vehicle.availability}>{status.label}</Badge>
        </div>

        <dl className="space-y-2 text-small">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted">Daily Rate</dt>
            <dd className="font-semibold text-foreground">{formatPricePerDay(vehicle.pricePerDay)} / day</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted">Weekly Rate</dt>
            <dd className="font-semibold text-foreground">{formatPricePerDay(vehicle.pricePerWeek)} / week</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted">Monthly Rate</dt>
            <dd className="font-semibold text-foreground">{formatPricePerDay(vehicle.pricePerMonth)} / month</dd>
          </div>
        </dl>

        <div className="grid gap-3 sm:grid-cols-2">
          <DateInput
            id={`pickup-date-${vehicle.id}`}
            label="Pickup Date"
            value={schedule.pickupDate}
            min={today}
            error={visibleErrors.pickupDate}
            onChange={(event) => updateSchedule('pickupDate', event.target.value)}
          />
          <DateInput
            id={`return-date-${vehicle.id}`}
            label="Return Date"
            value={schedule.returnDate}
            min={schedule.pickupDate || today}
            error={visibleErrors.returnDate}
            onChange={(event) => updateSchedule('returnDate', event.target.value)}
          />
          <TimeInput
            id={`pickup-time-${vehicle.id}`}
            label="Pickup Time"
            value={schedule.pickupTime}
            error={visibleErrors.pickupTime}
            onChange={(event) => updateSchedule('pickupTime', event.target.value)}
          />
          <TimeInput
            id={`return-time-${vehicle.id}`}
            label="Return Time"
            value={schedule.returnTime}
            error={visibleErrors.returnTime}
            onChange={(event) => updateSchedule('returnTime', event.target.value)}
          />
        </div>

        <RentalExtras selectedIds={selectedIds} onChange={setSelectedIds} />

        <div className="space-y-2 border-t border-border pt-4 text-small" aria-live="polite">
          <div className="flex justify-between gap-3">
            <span className="text-muted">Rental Duration</span>
            <span className="font-medium text-foreground">{formatDuration(price.days)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted">Base Rental</span>
            <span className="font-medium text-foreground">{formatPricePerDay(price.base)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted">Extras</span>
            <span className="font-medium text-foreground">{formatPricePerDay(price.extrasTotal)}</span>
          </div>
          <div className="flex justify-between gap-3 text-body">
            <span className="font-semibold text-foreground">Estimated Total</span>
            <span className="font-semibold text-foreground">{formatPricePerDay(price.total)}</span>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={!status.bookable}>
          Continue to Booking
        </Button>
      </form>
    </Card>
  )
}
