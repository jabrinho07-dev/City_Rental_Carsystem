import {
  mockBookings,
  mockInvoices,
  mockNotifications,
  mockPaymentSummary,
  mockPayments,
  mockStats,
} from '@/constants/mockCustomerData'
import { findMockVehicle } from '@/constants/mockVehicles'
import { getBooking, listBookings, updateBooking } from '@/services/bookingService'

const statusOverrides = new Map()
let notifications = mockNotifications.map((item) => ({ ...item }))

function withVehicle(booking) {
  const vehicle = findMockVehicle(booking.vehicleId)
  return {
    ...booking,
    status: statusOverrides.get(booking.id) || booking.status,
    image: booking.image || vehicle?.image || '',
    vehicleName: booking.vehicleName || (vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehicle'),
  }
}

function fromSession(booking) {
  const vehicle = findMockVehicle(booking.vehicleId)
  return withVehicle({
    id: booking.id,
    vehicleId: booking.vehicleId,
    vehicleName: booking.vehicleName,
    image: vehicle?.image || '',
    pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation,
    pickupDate: booking.pickupDate,
    returnDate: booking.returnDate,
    pickupTime: booking.pickupTime,
    returnTime: booking.returnTime,
    status: booking.status,
    amount: booking.pricing?.total || 0,
    paymentStatus: booking.status === 'Cancelled' ? 'Refunded' : 'Pending',
    createdAt: booking.createdAt,
    extras: booking.extras || [],
    pricing: booking.pricing || null,
    customer: booking.customer || null,
    source: 'session',
  })
}

export function listCustomerBookings() {
  const session = listBookings().map(fromSession)
  const sessionIds = new Set(session.map((item) => item.id))
  const catalog = mockBookings.filter((item) => !sessionIds.has(item.id)).map((item) => withVehicle({ ...item }))
  return [...session, ...catalog].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export async function getBookings() {
  return listCustomerBookings()
}

export async function getBookingById(id) {
  return listCustomerBookings().find((booking) => booking.id === id) || null
}

export async function cancelCustomerBooking(id) {
  if (getBooking(id)) {
    updateBooking(id, { status: 'Cancelled' })
  } else {
    statusOverrides.set(id, 'Cancelled')
  }
  return getBookingById(id)
}

export async function getPayments() {
  return mockPayments.map((payment) => ({ ...payment }))
}

export async function getInvoices() {
  return mockInvoices.map((invoice) => ({ ...invoice }))
}

export async function getNotifications() {
  return notifications.map((item) => ({ ...item }))
}

export async function markNotificationRead(id) {
  notifications = notifications.map((item) => (item.id === id ? { ...item, unread: false } : item))
  return getNotifications()
}

export async function markAllNotificationsRead() {
  notifications = notifications.map((item) => ({ ...item, unread: false }))
  return getNotifications()
}

export async function deleteNotification(id) {
  notifications = notifications.filter((item) => item.id !== id)
  return getNotifications()
}

export async function getDashboard() {
  const bookings = listCustomerBookings()
  const notes = await getNotifications()
  const upcoming = bookings
    .filter((booking) => booking.status === 'Confirmed')
    .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate))

  return {
    stats: { ...mockStats },
    activeRental: bookings.find((booking) => booking.status === 'Active') || null,
    upcomingBooking: upcoming[0] || null,
    recentBookings: bookings.slice(0, 5),
    paymentSummary: { ...mockPaymentSummary, lastPayment: { ...mockPaymentSummary.lastPayment } },
    notifications: notes.slice(0, 3),
  }
}

export async function updateProfile(profile) {
  return {
    firstName: profile.firstName?.trim() || '',
    lastName: profile.lastName?.trim() || '',
    email: profile.email?.trim() || '',
    phone: profile.phone?.trim() || '',
    country: profile.country?.trim() || '',
    preferences: { ...profile.preferences },
  }
}
