import { z } from 'zod'
import { adminVehicleFeatures, vehicleCategories, vehicleStatuses } from '@/constants/vehicleOptions'

export { adminVehicleFeatures, vehicleCategories, vehicleStatuses }

export const transmissionOptions = ['Automatic', 'Manual']
export const fuelOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric']

const currentYear = new Date().getFullYear()

function requiredNumber({ label, integer = false, min = 0 }) {
  return z.any().superRefine((value, ctx) => {
    if (value === '' || value === null || value === undefined) {
      ctx.addIssue({ code: 'custom', message: `${label} is required.` })
      return
    }
    const number = Number(value)
    if (!Number.isFinite(number)) {
      ctx.addIssue({ code: 'custom', message: `Enter a valid ${label.toLowerCase()}.` })
      return
    }
    if (integer && !Number.isInteger(number)) {
      ctx.addIssue({ code: 'custom', message: `${label} must be a whole number.` })
      return
    }
    if (number < min) {
      ctx.addIssue({
        code: 'custom',
        message: min > 0 ? `${label} must be at least ${min}.` : `${label} cannot be negative.`,
      })
    }
  }).transform((value) => Number(value))
}

export const vehicleSchema = z.object({
  brand: z.string().trim().min(1, 'Brand is required.'),
  model: z.string().trim().min(1, 'Model is required.'),
  year: z.any().superRefine((value, ctx) => {
    const number = Number(value)
    if (!Number.isInteger(number) || String(value).trim().length !== 4) {
      ctx.addIssue({ code: 'custom', message: 'Enter a four-digit year.' })
      return
    }
    if (number < 1990 || number > currentYear + 1) {
      ctx.addIssue({ code: 'custom', message: `Enter a year from 1990 to ${currentYear + 1}.` })
    }
  }).transform((value) => Number(value)),
  category: z.enum(vehicleCategories, { error: 'Choose a category.' }),
  description: z.string().trim().min(20, 'Describe the vehicle in at least 20 characters.'),
  dailyPrice: requiredNumber({ label: 'Daily price' }),
  weeklyPrice: requiredNumber({ label: 'Weekly price' }),
  monthlyPrice: requiredNumber({ label: 'Monthly price' }),
  seats: requiredNumber({ label: 'Seats', integer: true, min: 1 }),
  doors: requiredNumber({ label: 'Doors', integer: true, min: 1 }),
  transmission: z.enum(transmissionOptions, { error: 'Choose a transmission.' }),
  fuel: z.enum(fuelOptions, { error: 'Choose a fuel type.' }),
  mileage: requiredNumber({ label: 'Mileage' }),
  features: z.array(z.string()),
  images: z.array(z.string()),
  status: z.enum(vehicleStatuses, { error: 'Choose a status.' }),
})

export const emptyVehicleForm = {
  brand: '',
  model: '',
  year: '',
  category: '',
  description: '',
  dailyPrice: '',
  weeklyPrice: '',
  monthlyPrice: '',
  seats: '',
  doors: '',
  transmission: '',
  fuel: '',
  mileage: '',
  features: [],
  images: [],
  status: 'Available',
}

export function vehicleToForm(vehicle) {
  return {
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    category: vehicle.category,
    description: vehicle.description,
    dailyPrice: vehicle.dailyPrice,
    weeklyPrice: vehicle.weeklyPrice,
    monthlyPrice: vehicle.monthlyPrice,
    seats: vehicle.seats,
    doors: vehicle.doors,
    transmission: vehicle.transmission,
    fuel: vehicle.fuel,
    mileage: vehicle.mileage,
    features: vehicle.features || [],
    images: vehicle.images || [],
    status: vehicle.status,
  }
}
