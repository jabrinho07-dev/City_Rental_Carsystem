import { z } from 'zod'
import {
  fuelPolicies,
  landingPages,
  paymentMethodNames,
  settingsCurrencies,
  settingsDateFormats,
  settingsLocales,
  settingsTimeZones,
} from '@/utils/settingsDefaults'

function wholeNumber(label, { min = 0, max = 100000 } = {}) {
  return z.any().superRefine((value, ctx) => {
    const number = Number(value)
    if (!Number.isInteger(number)) {
      ctx.addIssue({ code: 'custom', message: `${label} must be a whole number.` })
      return
    }
    if (number < min || number > max) {
      ctx.addIssue({ code: 'custom', message: `${label} must be between ${min} and ${max}.` })
    }
  }).transform((value) => Number(value))
}

function money(label) {
  return z.any().superRefine((value, ctx) => {
    const number = Number(value)
    if (!Number.isFinite(number) || number < 0) {
      ctx.addIssue({ code: 'custom', message: `${label} cannot be negative.` })
    }
  }).transform((value) => Number(value))
}

const email = z.email('Enter a valid email address.')

export const settingsSchema = z.object({
  general: z.object({
    businessName: z.string().trim().min(2, 'Enter the business name.').max(80),
    tagline: z.string().trim().max(140, 'Keep the tagline under 140 characters.'),
    contactEmail: email,
    contactPhone: z.string().trim().min(7, 'Enter a contact phone number.').max(30),
    website: z.string().trim().refine((value) => value === '' || /^https?:\/\/\S+\.\S+/.test(value), 'Enter a valid website URL starting with http:// or https://.'),
    address: z.string().trim().min(3, 'Enter the business address.').max(160),
    city: z.string().trim().min(2, 'Enter the city.').max(60),
    country: z.string().trim().min(2, 'Enter the country.').max(60),
    supportEmail: email,
    supportPhone: z.string().trim().min(7, 'Enter a support phone number.').max(30),
    logoDataUrl: z.string(),
  }),
  localization: z.object({
    currency: z.enum(settingsCurrencies, { error: 'Choose a currency.' }),
    locale: z.enum(settingsLocales.map((item) => item.value), { error: 'Choose a locale.' }),
    timeZone: z.enum(settingsTimeZones, { error: 'Choose a time zone.' }),
    dateFormat: z.enum(settingsDateFormats, { error: 'Choose a date format.' }),
    timeFormat: z.enum(['12-hour', '24-hour'], { error: 'Choose a time format.' }),
  }),
  rental: z.object({
    minDays: wholeNumber('Minimum rental duration', { min: 1, max: 365 }),
    maxDays: wholeNumber('Maximum rental duration', { min: 1, max: 365 }),
    defaultPickupTime: z.string().regex(/^\d{2}:\d{2}$/, 'Enter a pickup time.'),
    defaultReturnTime: z.string().regex(/^\d{2}:\d{2}$/, 'Enter a return time.'),
    graceMinutes: wholeNumber('Grace period', { min: 0, max: 1440 }),
    dailyMileage: wholeNumber('Daily mileage allowance', { min: 0, max: 2000 }),
    extraMileageFee: money('Extra-mileage fee'),
    fuelPolicy: z.enum(fuelPolicies, { error: 'Choose a fuel policy.' }),
    securityDeposit: money('Security deposit'),
    minimumDriverAge: wholeNumber('Minimum driver age', { min: 18, max: 80 }),
    licenceRequirement: z.string().trim().min(5, 'Describe the licence requirement.').max(240),
    cancellationPolicy: z.string().trim().min(10, 'Describe the cancellation policy.').max(500),
  }),
  booking: z.object({
    referencePrefix: z.string().trim().regex(/^[A-Za-z]{2,8}$/, 'Use 2 to 8 letters for the booking prefix.'),
    allowCustomerCreate: z.boolean(),
    allowCustomerCancel: z.boolean(),
    requireConfirmation: z.boolean(),
    minAdvanceHours: wholeNumber('Minimum advance booking', { min: 0, max: 720 }),
    maxAdvanceDays: wholeNumber('Maximum advance window', { min: 1, max: 730 }),
    bufferHours: wholeNumber('Booking buffer', { min: 0, max: 72 }),
    requirePhone: z.boolean(),
    requireEmail: z.boolean(),
    requireLocations: z.boolean(),
  }),
  payments: z.object({
    methods: z.object(Object.fromEntries(paymentMethodNames.map((item) => [item.key, z.boolean()]))),
    depositPercent: wholeNumber('Deposit percentage', { min: 0, max: 100 }),
    terms: z.string().trim().min(10, 'Enter payment instructions.').max(500),
    refundPolicy: z.string().trim().min(10, 'Enter a refund policy.').max(500),
  }),
  notifications: z.object({
    bookingCreated: z.boolean(),
    bookingConfirmed: z.boolean(),
    bookingCancelled: z.boolean(),
    paymentRecorded: z.boolean(),
    paymentFailed: z.boolean(),
    returnReminder: z.boolean(),
    maintenanceReminder: z.boolean(),
    inApp: z.boolean(),
    email: z.boolean(),
  }),
  admin: z.object({
    landingPage: z.enum(landingPages.map((item) => item.value), { error: 'Choose a landing page.' }),
    pageSize: z.union([z.literal(4), z.literal(6), z.literal(10), z.coerce.number()]).refine((value) => [4, 6, 10].includes(Number(value)), 'Choose a page size.'),
    sessionTimeoutMinutes: z.union([z.literal(15), z.literal(30), z.literal(60), z.literal(120), z.coerce.number()]).refine((value) => [15, 30, 60, 120].includes(Number(value)), 'Choose a timeout preference.'),
    showSummaryWidgets: z.boolean(),
  }),
}).superRefine((value, ctx) => {
  if (value.rental.maxDays < value.rental.minDays) {
    ctx.addIssue({ code: 'custom', path: ['rental', 'maxDays'], message: 'Maximum duration cannot be less than the minimum.' })
  }
  if (value.booking.maxAdvanceDays * 24 < value.booking.minAdvanceHours) {
    ctx.addIssue({ code: 'custom', path: ['booking', 'maxAdvanceDays'], message: 'The advance window must cover the minimum advance period.' })
  }
  if (!Object.values(value.payments.methods).some(Boolean)) {
    ctx.addIssue({ code: 'custom', path: ['payments', 'methods', 'cash'], message: 'Keep at least one payment method enabled.' })
  }
})

export function settingsToForm(settings) {
  return {
    ...settings,
    rental: { ...settings.rental, minDays: String(settings.rental.minDays), maxDays: String(settings.rental.maxDays), graceMinutes: String(settings.rental.graceMinutes), dailyMileage: String(settings.rental.dailyMileage), extraMileageFee: String(settings.rental.extraMileageFee), securityDeposit: String(settings.rental.securityDeposit), minimumDriverAge: String(settings.rental.minimumDriverAge) },
    booking: { ...settings.booking, minAdvanceHours: String(settings.booking.minAdvanceHours), maxAdvanceDays: String(settings.booking.maxAdvanceDays), bufferHours: String(settings.booking.bufferHours) },
    payments: { ...settings.payments, depositPercent: String(settings.payments.depositPercent) },
    admin: { ...settings.admin, pageSize: String(settings.admin.pageSize), sessionTimeoutMinutes: String(settings.admin.sessionTimeoutMinutes) },
  }
}
