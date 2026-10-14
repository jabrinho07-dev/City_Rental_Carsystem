import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { customerProfileSchema } from '@/validators/customerSchema'

export function CustomerEditDialog({ customer, loading, error, onClose, onSave }) {
  const form = useForm({
    resolver: zodResolver(customerProfileSchema),
    values: customer
      ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address || '',
          city: customer.city || '',
          country: customer.country || '',
          notes: customer.notes || '',
        }
      : undefined,
  })
  const field = form.formState.errors
  return (
    <Modal open={Boolean(customer)} title="Edit contact details" onClose={onClose}>
      {customer ? (
        <form className="mt-3 space-y-3" onSubmit={form.handleSubmit(onSave)}>
          <p className="text-small text-muted">Login credentials stay unchanged. Bookings and payments are not edited here.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input id="customer-first" label="First name" error={field.firstName?.message} {...form.register('firstName')} />
            <Input id="customer-last" label="Last name" error={field.lastName?.message} {...form.register('lastName')} />
            <Input id="customer-email" label="Email" error={field.email?.message} {...form.register('email')} />
            <Input id="customer-phone" label="Phone" error={field.phone?.message} {...form.register('phone')} />
            <Input id="customer-city" label="City" error={field.city?.message} {...form.register('city')} />
            <Input id="customer-country" label="Country" error={field.country?.message} {...form.register('country')} />
          </div>
          <Input id="customer-address" label="Address" error={field.address?.message} {...form.register('address')} />
          <Textarea id="customer-notes" label="Administrative notes" error={field.notes?.message} {...form.register('notes')} />
          {error ? <p className="text-small text-danger" role="alert">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading || form.formState.isSubmitting}>Save details</Button>
          </div>
        </form>
      ) : null}
    </Modal>
  )
}
