import { SearchInput } from '@/components/ui/SearchInput'

export function ExpenseSearch({ value, onChange, resultCount }) {
  return (
    <div className="space-y-2">
      <SearchInput
        id="expense-search"
        label="Search expenses"
        placeholder="Reference, title, vendor, description, or receipt"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-caption text-muted">{resultCount} matching records</p>
    </div>
  )
}
