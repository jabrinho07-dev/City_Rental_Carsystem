import { Input } from '@/components/ui/Input'
import { SettingsSection } from '@/components/admin/settings/SettingsSection'

function Toggle({ id, label, hint, register }) {
  return (
    <label className="flex items-start gap-2 text-small text-foreground" htmlFor={id}>
      <input id={id} type="checkbox" className="mt-1" {...register} />
      <span>
        {label}
        {hint ? <span className="mt-1 block text-caption text-muted">{hint}</span> : null}
      </span>
    </label>
  )
}

export function BookingSettingsForm({ register, errors }) {
  const field = errors.booking || {}
  return (
    <SettingsSection title="Booking settings" description="These preferences are saved and shown here. The current booking flow is not changed by them.">
      <Input id="prefix" label="Booking reference prefix" error={field.referencePrefix?.message} {...register('booking.referencePrefix')} />
      <Input id="min-advance" label="Minimum advance booking (hours)" type="number" min="0" error={field.minAdvanceHours?.message} {...register('booking.minAdvanceHours')} />
      <Input id="max-advance" label="Maximum advance window (days)" type="number" min="1" error={field.maxAdvanceDays?.message} {...register('booking.maxAdvanceDays')} />
      <Input id="buffer" label="Buffer between rentals (hours)" type="number" min="0" error={field.bufferHours?.message} {...register('booking.bufferHours')} />
      <Toggle id="allow-create" label="Allow customers to create bookings" register={register('booking.allowCustomerCreate')} />
      <Toggle id="allow-cancel" label="Allow customers to cancel bookings" register={register('booking.allowCustomerCancel')} />
      <Toggle id="require-confirm" label="Require booking confirmation" hint="A preference only. Existing status rules stay as they are." register={register('booking.requireConfirmation')} />
      <Toggle id="require-phone" label="Require customer phone number" register={register('booking.requirePhone')} />
      <Toggle id="require-email" label="Require customer email address" register={register('booking.requireEmail')} />
      <Toggle id="require-locations" label="Require pickup and return locations" register={register('booking.requireLocations')} />
    </SettingsSection>
  )
}
