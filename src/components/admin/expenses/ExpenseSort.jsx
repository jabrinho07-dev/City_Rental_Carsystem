import { Select } from '@/components/ui/Select'

const options = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'amount-asc', label: 'Amount low to high' },
  { value: 'amount-desc', label: 'Amount high to low' },
  { value: 'title', label: 'Expense title alphabetically' },
]

export function ExpenseSort({ value, onChange }) {
  return <Select id="expense-sort" label="Sort" value={value} onChange={(event) => onChange(event.target.value)} options={options} />
}
