import { SearchInput } from '@/components/ui/SearchInput'

export function PaymentSearch({ value, onChange, resultCount }) {
  return (
    <div className="space-y-2">
      <SearchInput
        id="payment-search"
        label="Search payments"
        placeholder="Transaction, booking, customer, or email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-caption text-muted">{resultCount} matching records</p>
    </div>
  )
}
