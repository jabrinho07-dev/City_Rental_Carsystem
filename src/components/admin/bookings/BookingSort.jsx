import { Select } from '@/components/ui/Select'

const sorts = [
  { value: 'newest', label: 'Newest booking first' },
  { value: 'oldest', label: 'Oldest booking first' },
  { value: 'pickup-asc', label: 'Pickup date ascending' },
  { value: 'pickup-desc', label: 'Pickup date descending' },
  { value: 'price-asc', label: 'Total price low to high' },
  { value: 'price-desc', label: 'Total price high to low' },
]

export function BookingSort({ value, onChange }) {
  return <Select id="booking-sort" label="Sort" value={value} onChange={(event) => onChange(event.target.value)} options={sorts} />
}
