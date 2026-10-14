import { SearchInput } from '@/components/ui/SearchInput'

export function MaintenanceSearch({ value, onChange, resultCount }) {
  return (
    <div className="space-y-2">
      <SearchInput
        id="maintenance-search"
        label="Search maintenance"
        placeholder="Reference, vehicle, registration, or title"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-caption text-muted">{resultCount} matching records</p>
    </div>
  )
}
