export const defaultSettings = {
  general: {
    businessName: 'City Rental Car',
    tagline: 'Premium vehicles for city, airport, and longer journeys.',
    contactEmail: 'hello@cityrentalcar.example',
    contactPhone: '+252 61 000 0000',
    website: 'https://cityrentalcar.example',
    address: 'City center desk',
    city: 'Mogadishu',
    country: 'Somalia',
    supportEmail: 'support@cityrentalcar.example',
    supportPhone: '+252 61 000 0001',
    logoDataUrl: '',
  },
  localization: {
    currency: 'USD',
    locale: 'en-US',
    timeZone: 'Africa/Mogadishu',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12-hour',
  },
  rental: {
    minDays: 1,
    maxDays: 30,
    defaultPickupTime: '10:00',
    defaultReturnTime: '10:00',
    graceMinutes: 60,
    dailyMileage: 200,
    extraMileageFee: 1,
    fuelPolicy: 'Full to Full',
    securityDeposit: 100,
    minimumDriverAge: 21,
    licenceRequirement: 'A valid driving licence is required for every rental.',
    cancellationPolicy: 'Cancellations are reviewed by the desk. This text is a preference, not an enforced rule.',
  },
  booking: {
    referencePrefix: 'CR',
    allowCustomerCreate: true,
    allowCustomerCancel: true,
    requireConfirmation: true,
    minAdvanceHours: 2,
    maxAdvanceDays: 90,
    bufferHours: 2,
    requirePhone: true,
    requireEmail: true,
    requireLocations: true,
  },
  payments: {
    methods: {
      cash: true,
      evcPlus: true,
      zaad: true,
      hormuud: true,
      visa: true,
      mastercard: true,
      bankTransfer: true,
    },
    depositPercent: 20,
    terms: 'Recorded payments are office records until a provider confirms them.',
    refundPolicy: 'Refunds are recorded separately and do not move money by themselves.',
  },
  notifications: {
    bookingCreated: true,
    bookingConfirmed: true,
    bookingCancelled: true,
    paymentRecorded: true,
    paymentFailed: true,
    returnReminder: true,
    maintenanceReminder: true,
    inApp: true,
    email: false,
  },
  admin: {
    landingPage: '/admin',
    pageSize: 6,
    sessionTimeoutMinutes: 60,
    showSummaryWidgets: true,
  },
  savedAt: null,
}

export const settingsCurrencies = ['USD', 'SOS', 'UGX', 'AED', 'KES']
export const settingsLocales = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'so-SO', label: 'Somali' },
  { value: 'sw-KE', label: 'Swahili (Kenya)' },
  { value: 'ar-AE', label: 'Arabic (UAE)' },
]
export const settingsTimeZones = ['Africa/Mogadishu', 'Africa/Nairobi', 'Africa/Kampala', 'Asia/Dubai', 'UTC']
export const settingsDateFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY']
export const fuelPolicies = ['Full to Full', 'Same to Same', 'Prepaid fuel']
export const paymentMethodNames = [
  { key: 'cash', label: 'Cash' },
  { key: 'evcPlus', label: 'EVC Plus' },
  { key: 'zaad', label: 'Zaad' },
  { key: 'hormuud', label: 'Hormuud' },
  { key: 'visa', label: 'Visa' },
  { key: 'mastercard', label: 'Mastercard' },
  { key: 'bankTransfer', label: 'Bank transfer' },
]
export const landingPages = [
  { value: '/admin', label: 'Dashboard' },
  { value: '/admin/bookings', label: 'Bookings' },
  { value: '/admin/vehicles', label: 'Vehicles' },
  { value: '/admin/payments', label: 'Payments' },
]
