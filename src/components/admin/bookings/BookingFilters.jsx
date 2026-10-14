import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'

const statuses = ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Rejected']
const payments = ['Paid', 'Pending', 'Failed', 'Refunded']

export function BookingFilters({ filters, categories, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Select
        id="booking-status"
        label="Booking status"
        value={filters.status}
        placeholder="All statuses"
        onChange={(event) => onChange('status', event.target.value)}
        options={statuses.map((value) => ({ value, label: value }))}
      />
      <Select
        id="payment-status"
        label="Payment status"
        value={filters.paymentStatus}
        placeholder="All payment statuses"
        onChange={(event) => onChange('paymentStatus', event.target.value)}
        options={payments.map((value) => ({ value, label: value }))}
      />
      <Select
        id="vehicle-category"
        label="Vehicle category"
        value={filters.category}
        placeholder="All categories"
        onChange={(event) => onChange('category', event.target.value)}
        options={categories.map((value) => ({ value, label: value }))}
      />
      <Input id="pickup-from" label="Pickup from" type="date" value={filters.pickupFrom} onChange={(event) => onChange('pickupFrom', event.target.value)} />
      <Input id="pickup-to" label="Pickup to" type="date" value={filters.pickupTo} onChange={(event) => onChange('pickupTo', event.target.value)} />
    </div>
  )
}
