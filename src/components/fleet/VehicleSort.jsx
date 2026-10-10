import { Select } from '@/components/ui/Select'

const options = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
]

export function VehicleSort({ id = 'fleet-sort', value, onChange }) {
  return (
    <Select
      id={id}
      label="Sort by"
      value={value}
      options={options}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
