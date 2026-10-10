import { z } from 'zod'
import { validateBookingSchedule } from '@/utils/bookingPrice'

export const bookingSteps = [
  { id: 'vehicle', label: 'Vehicle', fields: [] },
  {
    id: 'rental',
    label: 'Rental Details',
    fields: ['pickupLocation', 'dropoffLocation', 'pickupDate', 'returnDate', 'pickupTime', 'returnTime'],
  },
  {
    id: 'customer',
    label: 'Customer Details',
    fields: ['firstName', 'lastName', 'email', 'phone', 'country', 'licenseNumber'],
  },
  { id: 'review', label: 'Review', fields: ['acceptedTerms'] },
  { id: 'confirmation', label: 'Confirmation', fields: [] },
]

export const pickupLocations = [
  { value: 'Mogadishu Airport', label: 'Mogadishu Airport' },
  { value: 'City Center', label: 'City Center' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Office', label: 'Office' },
]

export const bookingSchema = z
  .object({
    pickupLocation: z.string().min(1, 'Pickup location is required.'),
    dropoffLocation: z.string().min(1, 'Drop-off location is required.'),
    pickupDate: z.string().min(1, 'Pickup date is required.'),
    returnDate: z.string().min(1, 'Return date is required.'),
    pickupTime: z.string().min(1, 'Pickup time is required.'),
    returnTime: z.string().min(1, 'Return time is required.'),
    firstName: z.string().trim().min(1, 'First name is required.'),
    lastName: z.string().trim().min(1, 'Last name is required.'),
    email: z.email('Enter a valid email address.'),
    phone: z.string().trim().min(1, 'Phone number is required.'),
    country: z.string().trim().min(1, 'Country is required.'),
    licenseNumber: z.string().trim().min(1, 'Driving license number is required.'),
    notes: z.string().optional(),
    extras: z.array(z.string()),
    acceptedTerms: z.boolean(),
  })
  .superRefine((values, context) => {
    const scheduleErrors = validateBookingSchedule(values)
    Object.entries(scheduleErrors).forEach(([path, message]) => {
      context.addIssue({ code: 'custom', path: [path], message })
    })
    if (!values.acceptedTerms) {
      context.addIssue({
        code: 'custom',
        path: ['acceptedTerms'],
        message: 'Please agree to the rental terms and conditions.',
      })
    }
  })

export const emptyCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  licenseNumber: '',
  notes: '',
}
