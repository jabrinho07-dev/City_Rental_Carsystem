import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

export function CustomerInformationForm({ register, errors }) {
  return (
    <section aria-labelledby="customer-details-heading" className="space-y-4">
      <div>
        <h2 id="customer-details-heading" className="text-h3 text-foreground">
          Customer Information
        </h2>
        <p className="mt-1 text-small text-muted">These details are used for the rental agreement.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="first-name" label="First Name" autoComplete="given-name" placeholder="Amina" error={errors.firstName?.message} {...register('firstName')} />
        <Input id="last-name" label="Last Name" autoComplete="family-name" placeholder="Hassan" error={errors.lastName?.message} {...register('lastName')} />
        <Input id="email" type="email" label="Email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <Input id="phone" type="tel" label="Phone Number" autoComplete="tel" placeholder="+252 61 000 0000" error={errors.phone?.message} {...register('phone')} />
        <Input id="country" label="Country" autoComplete="country-name" placeholder="Somalia" error={errors.country?.message} {...register('country')} />
        <Input id="license-number" label="Driving License Number" placeholder="License number" error={errors.licenseNumber?.message} {...register('licenseNumber')} />
      </div>
      <Textarea id="additional-notes" label="Additional Notes" placeholder="Optional notes for the rental desk" error={errors.notes?.message} {...register('notes')} />
    </section>
  )
}
