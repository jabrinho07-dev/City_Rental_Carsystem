import { DateInput } from '@/components/ui/DateInput'
import { Select } from '@/components/ui/Select'
import { TimeInput } from '@/components/ui/TimeInput'
import { pickupLocations } from '@/constants/bookingOptions'
import { todayDateString } from '@/utils/bookingPrice'

export function BookingDetailsForm({ register, errors, pickupDate }) {
  const today = todayDateString()

  return (
    <section aria-labelledby="rental-details-heading" className="space-y-4">
      <div>
        <h2 id="rental-details-heading" className="text-h3 text-foreground">
          Rental Details
        </h2>
        <p className="mt-1 text-small text-muted">Tell us where and when you need the vehicle.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="pickup-location"
          label="Pickup Location"
          placeholder="Select a pickup location"
          options={pickupLocations}
          error={errors.pickupLocation?.message}
          {...register('pickupLocation')}
        />
        <Select
          id="dropoff-location"
          label="Drop-off Location"
          placeholder="Select a drop-off location"
          options={pickupLocations}
          error={errors.dropoffLocation?.message}
          {...register('dropoffLocation')}
        />
        <DateInput
          id="booking-pickup-date"
          label="Pickup Date"
          min={today}
          error={errors.pickupDate?.message}
          {...register('pickupDate')}
        />
        <DateInput
          id="booking-return-date"
          label="Return Date"
          min={pickupDate || today}
          error={errors.returnDate?.message}
          {...register('returnDate')}
        />
        <TimeInput id="booking-pickup-time" label="Pickup Time" error={errors.pickupTime?.message} {...register('pickupTime')} />
        <TimeInput id="booking-return-time" label="Return Time" error={errors.returnTime?.message} {...register('returnTime')} />
      </div>
    </section>
  )
}
