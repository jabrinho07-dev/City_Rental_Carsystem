import { recentCustomers } from '@/constants/mockAdminData'
import {
  mockBookings,
  mockInvoices,
  mockNotifications,
  mockPaymentSummary,
  mockStats,
} from '@/constants/mockCustomerData'
import { findMockVehicle } from '@/constants/mockVehicles'
import { getBooking, listAdminBookings, listBookings, updateBooking } from '@/services/bookingService'
import { readPayments } from '@/services/paymentStore'
import { netCollected } from '@/utils/paymentCalculations'
import { customerProfileSchema } from '@/validators/customerSchema'

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
  return readPayments().map((payment) => ({
    id: payment.transactionReference,
    bookingId: payment.bookingId,
    date: (payment.paidAt || payment.createdAt || '').slice(0, 10),
    method: payment.paymentMethod,
    amount: payment.amount,
    status: payment.status,
  }))
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

const CUSTOMER_KEY = 'city-rental-car.admin-customers'
export const customerStatuses = ['Active', 'Inactive', 'Suspended']

export class CustomerError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CustomerError'
  }
}

function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  return { firstName: parts[0] || 'Customer', lastName: parts.slice(1).join(' ') || 'Record' }
}

function seedProfiles() {
  const directory = recentCustomers.map((item) => {
    const names = splitName(item.name)
    return {
      id: item.id,
      firstName: names.firstName,
      lastName: names.lastName,
      email: item.email,
      phone: item.phone,
      profileImage: '',
      address: '',
      city: '',
      country: '',
      createdAt: item.joined || '',
      status: item.status === 'Blocked' ? 'Suspended' : item.status,
      notes: '',
    }
  })
  return [
    {
      id: 'user-001',
      firstName: 'Abdi',
      lastName: 'Mohamed',
      email: 'customer@cityrentalcar.com',
      phone: '+252 61 000 0001',
      profileImage: '',
      address: '',
      city: '',
      country: '',
      createdAt: '',
      status: 'Active',
      notes: '',
    },
    ...directory,
  ]
}

function readOverrides() {
  if (typeof window === 'undefined') return {}
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOMER_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeOverrides(overrides) {
  window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(overrides))
}

function profiles() {
  const overrides = readOverrides()
  return seedProfiles().map((profile) => {
    const saved = overrides[profile.id]
    if (!saved || typeof saved !== 'object') return { ...profile }
    const next = { ...profile }
    ;['firstName', 'lastName', 'email', 'phone', 'profileImage', 'address', 'city', 'country', 'notes', 'status'].forEach((key) => {
      if (saved[key] !== undefined) next[key] = saved[key]
    })
    return next
  })
}

function belongsTo(profile, booking) {
  if (booking.customer?.id && booking.customer.id === profile.id) return true
  const email = profile.email.trim().toLowerCase()
  return Boolean(email) && String(booking.customer?.email || '').trim().toLowerCase() === email
}

function presentCustomer(profile, bookings, payments) {
  const related = bookings.filter((booking) => belongsTo(profile, booking))
  const ids = new Set(related.map((booking) => booking.id))
  const relatedPayments = payments.filter((payment) => ids.has(payment.bookingId))
  const dates = related.map((booking) => booking.createdAt || booking.pickupDate).filter(Boolean).sort()
  const openBookings = related.filter((booking) => booking.status === 'Active' || booking.status === 'Confirmed').length
  return {
    ...profile,
    name: `${profile.firstName} ${profile.lastName}`.trim(),
    totalBookings: related.length,
    completedBookings: related.filter((booking) => booking.status === 'Completed').length,
    cancelledBookings: related.filter((booking) => booking.status === 'Cancelled').length,
    openBookings,
    totalSpent: netCollected(relatedPayments),
    lastBookingDate: dates.length ? dates[dates.length - 1].slice(0, 10) : '',
    spendingSource: 'linked-payments',
  }
}

function catalog() {
  const bookings = listAdminBookings()
  const payments = readPayments()
  return profiles().map((profile) => presentCustomer(profile, bookings, payments))
}

function currentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export async function getCustomers(params = {}) {
  const search = String(params.search || '').trim().toLowerCase()
  let rows = catalog().filter((customer) => {
    if (search) {
      const haystack = [customer.id, customer.name, customer.email, customer.phone].join(' ').toLowerCase()
      if (!haystack.includes(search)) return false
    }
    if (params.status && customer.status !== params.status) return false
    if (params.registeredFrom && customer.createdAt && customer.createdAt < params.registeredFrom) return false
    if (params.registeredFrom && !customer.createdAt) return false
    if (params.registeredTo && customer.createdAt && customer.createdAt > params.registeredTo) return false
    if (params.registeredTo && !customer.createdAt) return false
    if (params.activity === 'bookings' && customer.totalBookings < 1) return false
    if (params.activity === 'none' && customer.totalBookings > 0) return false
    if (params.activity === 'open' && customer.openBookings < 1) return false
    return true
  })
  const sort = params.sort || 'newest'
  rows = [...rows].sort((left, right) => {
    if (sort === 'oldest') return String(left.createdAt).localeCompare(String(right.createdAt))
    if (sort === 'name-asc') return left.name.localeCompare(right.name)
    if (sort === 'name-desc') return right.name.localeCompare(left.name)
    if (sort === 'spent') return right.totalSpent - left.totalSpent || right.totalBookings - left.totalBookings
    if (sort === 'bookings') return right.totalBookings - left.totalBookings || right.name.localeCompare(left.name)
    return String(right.createdAt).localeCompare(String(left.createdAt)) || right.name.localeCompare(left.name)
  })
  const month = currentMonthKey()
  const all = catalog()
  const pageSize = Math.min(500, Math.max(1, Number(params.pageSize) || 6))
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const page = Math.min(pageCount, Math.max(1, Number(params.page) || 1))
  const start = (page - 1) * pageSize
  return {
    customers: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageCount,
    pageSize,
    stats: {
      total: all.length,
      active: all.filter((item) => item.status === 'Active').length,
      inactive: all.filter((item) => item.status === 'Inactive').length,
      suspended: all.filter((item) => item.status === 'Suspended').length,
      newThisMonth: all.filter((item) => item.createdAt.startsWith(month)).length,
    },
  }
}

export async function getCustomerById(id) {
  if (!id) return null
  return catalog().find((customer) => customer.id === id) || null
}

export async function updateCustomer(id, updates) {
  const current = profiles().find((item) => item.id === id)
  if (!current) throw new CustomerError('That customer could not be found.')
  const parsed = customerProfileSchema.parse({ ...current, ...updates })
  const overrides = readOverrides()
  overrides[id] = {
    ...(overrides[id] || {}),
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    email: parsed.email,
    phone: parsed.phone,
    address: parsed.address,
    city: parsed.city,
    country: parsed.country,
    notes: parsed.notes,
  }
  writeOverrides(overrides)
  return getCustomerById(id)
}

export async function updateCustomerStatus(id, status) {
  if (!customerStatuses.includes(status)) throw new CustomerError('Choose Active, Inactive, or Suspended.')
  const current = profiles().find((item) => item.id === id)
  if (!current) throw new CustomerError('That customer could not be found.')
  const overrides = readOverrides()
  overrides[id] = { ...(overrides[id] || {}), status }
  writeOverrides(overrides)
  return getCustomerById(id)
}

export async function getCustomerBookings(customerId) {
  const customer = await getCustomerById(customerId)
  if (!customer) return []
  return listAdminBookings()
    .filter((booking) => belongsTo(customer, booking))
    .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
}

export async function getCustomerPayments(customerId) {
  const bookings = await getCustomerBookings(customerId)
  const ids = new Set(bookings.map((booking) => booking.id))
  return readPayments()
    .filter((payment) => ids.has(payment.bookingId))
    .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
    .map((payment) => ({
      id: payment.id,
      reference: payment.transactionReference || payment.id,
      bookingId: payment.bookingId,
      date: (payment.paidAt || payment.createdAt || '').slice(0, 10),
      amount: payment.amount,
      method: payment.paymentMethod,
      status: payment.status,
      paymentType: payment.paymentType,
    }))
}
