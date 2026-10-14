import { z } from 'zod'

export const customerProfileSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter a first name.').max(40),
  lastName: z.string().trim().min(2, 'Enter a last name.').max(40),
  email: z.email('Enter a valid email address.'),
  phone: z.string().trim().min(7, 'Enter a phone number.').max(30),
  address: z.string().trim().max(160, 'Keep the address under 160 characters.'),
  city: z.string().trim().max(60),
  country: z.string().trim().max(60),
  notes: z.string().trim().max(500, 'Keep notes under 500 characters.'),
})
