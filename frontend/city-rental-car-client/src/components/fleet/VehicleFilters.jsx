import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const categories = ['Economy', 'Sedan', 'SUV', 'Luxury', '4x4', 'Van']
const transmissions = ['Automatic', 'Manual']
const fuels = ['Petrol', 'Diesel', 'Hybrid']
const seats = [
  { value: '2', label: '2+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
  { value: '7', label: '7+' },
  { value: '8', label: '8+' },
]
const availability = [
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'rented', label: 'Rented' },
  { value: 'maintenance', label: 'Maintenance' },
]

export function VehicleFilters({ values, onChange, idPrefix = 'fleet' }) {
  return (
    <div className="grid gap-4">
      <Select
        id={`${idPrefix}-category`}
        label="Category"
        placeholder="All"
        value={values.category}
        options={categories.map((item) => ({ value: item, label: item }))}
        onChange={(event) => onChange('category', event.target.value)}
      />
      <Select
        id={`${idPrefix}-transmission`}
        label="Transmission"
        placeholder="All"
        value={values.transmission}
        options={transmissions.map((item) => ({ value: item, label: item }))}
        onChange={(event) => onChange('transmission', event.target.value)}
      />
      <Select
        id={`${idPrefix}-fuel`}
        label="Fuel type"
        placeholder="All"
        value={values.fuel}
        options={fuels.map((item) => ({ value: item, label: item }))}
        onChange={(event) => onChange('fuel', event.target.value)}
      />
      <Select
        id={`${idPrefix}-seats`}
        label="Seats"
        placeholder="All"
        value={values.seats}
        options={seats}
        onChange={(event) => onChange('seats', event.target.value)}
      />
      <Select
        id={`${idPrefix}-availability`}
        label="Availability"
        placeholder="All"
        value={values.availability}
        options={availability}
        onChange={(event) => onChange('availability', event.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          id={`${idPrefix}-min-price`}
          label="Minimum price"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="0"
          value={values.minPrice}
          onChange={(event) => onChange('minPrice', event.target.value)}
        />
        <Input
          id={`${idPrefix}-max-price`}
          label="Maximum price"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="Any"
          value={values.maxPrice}
          onChange={(event) => onChange('maxPrice', event.target.value)}
        />
      </div>
    </div>
  )
}
