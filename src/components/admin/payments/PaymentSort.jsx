import { Select } from '@/components/ui/Select'

const options = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'amount-asc', label: 'Amount low to high' },
  { value: 'amount-desc', label: 'Amount high to low' },
]

export function PaymentSort({ value, onChange }) {
  return (
    <Select
      id="payment-sort"
      label="Sort"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      options={options}
    />
  )
}
