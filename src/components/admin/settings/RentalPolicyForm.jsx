import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { SettingsSection } from '@/components/admin/settings/SettingsSection'
import { fuelPolicies } from '@/utils/settingsDefaults'

export function RentalPolicyForm({ register, errors }) {
  const field = errors.rental || {}
  return (
    <SettingsSection title="Rental policies" description="Stored for the desk. These values do not change existing rental calculations.">
      <Input id="min-days" label="Minimum rental duration (days)" type="number" min="1" error={field.minDays?.message} {...register('rental.minDays')} />
      <Input id="max-days" label="Maximum rental duration (days)" type="number" min="1" error={field.maxDays?.message} {...register('rental.maxDays')} />
      <Input id="pickup-time" label="Default pickup time" type="time" error={field.defaultPickupTime?.message} {...register('rental.defaultPickupTime')} />
      <Input id="return-time" label="Default return time" type="time" error={field.defaultReturnTime?.message} {...register('rental.defaultReturnTime')} />
      <Input id="grace" label="Grace period (minutes)" type="number" min="0" error={field.graceMinutes?.message} {...register('rental.graceMinutes')} />
      <Input id="mileage" label="Daily mileage allowance" type="number" min="0" error={field.dailyMileage?.message} {...register('rental.dailyMileage')} />
      <Input id="extra-fee" label="Extra-mileage fee" type="number" min="0" step="0.01" error={field.extraMileageFee?.message} {...register('rental.extraMileageFee')} />
      <Select id="fuel-policy" label="Fuel policy" options={fuelPolicies.map((item) => ({ value: item, label: item }))} error={field.fuelPolicy?.message} {...register('rental.fuelPolicy')} />
      <Input id="deposit" label="Security deposit" type="number" min="0" step="0.01" error={field.securityDeposit?.message} {...register('rental.securityDeposit')} />
      <Input id="driver-age" label="Minimum driver age" type="number" min="18" max="80" error={field.minimumDriverAge?.message} {...register('rental.minimumDriverAge')} />
      <div className="sm:col-span-2">
        <Textarea id="licence" label="Driving licence requirement" error={field.licenceRequirement?.message} {...register('rental.licenceRequirement')} />
      </div>
      <div className="sm:col-span-2">
        <Textarea id="cancellation" label="Cancellation policy" error={field.cancellationPolicy?.message} {...register('rental.cancellationPolicy')} />
      </div>
    </SettingsSection>
  )
}
