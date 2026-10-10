import { SearchInput } from '@/components/ui/SearchInput'

export function VehicleSearch({ value, onChange }) {
  return (
    <SearchInput
      id="vehicle-search"
      label="Search vehicles"
      placeholder="Search by car name, brand or model..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
