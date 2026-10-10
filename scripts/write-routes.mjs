import fs from 'node:fs'
import path from 'node:path'

const pages = [
  ['app/(public)/page.js', '@/screens/public/HomePage'],
  ['app/(public)/cars/page.js', '@/screens/public/Cars'],
  ['app/(public)/cars/[id]/page.js', '@/screens/public/CarDetailsPage'],
  ['app/(public)/about/page.js', '@/screens/public/AboutPage'],
  ['app/(public)/contact/page.js', '@/screens/public/ContactPage'],
  ['app/(public)/design-system/page.js', '@/screens/public/DesignSystemPage'],
  ['app/(public)/login/page.js', '@/screens/public/Login'],
  ['app/(public)/register/page.js', '@/screens/public/Register'],
  ['app/(public)/forgot-password/page.js', '@/screens/public/ForgotPassword'],
  ['app/(public)/reset-password/[token]/page.js', '@/screens/public/ResetPassword'],
  ['app/(public)/unauthorized/page.js', '@/screens/public/Unauthorized'],
  ['app/customer/page.js', '@/screens/customer/Dashboard'],
  ['app/customer/profile/page.js', '@/screens/customer/Profile'],
  ['app/customer/bookings/page.js', '@/screens/customer/MyBookings'],
  ['app/customer/bookings/new/page.js', '@/screens/customer/NewBooking'],
  ['app/customer/bookings/[id]/confirmation/page.js', '@/screens/customer/BookingConfirmation'],
  ['app/customer/bookings/[id]/page.js', '@/screens/customer/BookingDetails'],
  ['app/customer/payments/page.js', '@/screens/customer/MyPayments'],
  ['app/customer/invoices/page.js', '@/screens/customer/MyInvoices'],
  ['app/customer/notifications/page.js', '@/screens/customer/Notifications'],
  ['app/admin/page.js', '@/screens/admin/Dashboard'],
  ['app/admin/vehicles/page.js', '@/screens/admin/VehiclesPage'],
  ['app/admin/vehicles/new/page.js', '@/screens/admin/NewVehiclePage'],
  ['app/admin/vehicles/[id]/edit/page.js', '@/screens/admin/EditVehiclePage'],
  ['app/admin/bookings/page.js', '@/screens/admin/BookingsPage'],
  ['app/admin/customers/page.js', '@/screens/admin/CustomersPage'],
  ['app/admin/payments/page.js', '@/screens/admin/PaymentsPage'],
  ['app/admin/maintenance/page.js', '@/screens/admin/MaintenancePage'],
  ['app/admin/expenses/page.js', '@/screens/admin/ExpensesPage'],
  ['app/admin/reports/page.js', '@/screens/admin/ReportsPage'],
  ['app/admin/settings/page.js', '@/screens/admin/SettingsPage'],
  ['app/admin/profile/page.js', '@/screens/admin/AdminProfile'],
]

for (const [file, source] of pages) {
  const full = path.resolve(file)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(
    full,
    `'use client'\n\nimport Page from '${source}'\n\nexport default function RoutePage() {\n  return <Page />\n}\n`,
  )
}

console.log(`wrote ${pages.length} pages`)
