import { mockBookings } from '@/constants/mockCustomerData'
import { readPayments } from '@/services/paymentStore'
import { netCollected } from '@/utils/paymentCalculations'
import { findMockVehicle } from '@/constants/mockVehicles'
import { getStoredUser } from '@/utils/authStorage'
import { rentalExtras } from '@/constants/vehicleOptions'
import { assetSrc } from '@/lib/assetSrc'
import { generateBookingReference } from '@/utils/generateBookingReference'
import { countRentalDays } from '@/utils/bookingPrice'

const STORAGE_KEY = 'city-rental-car.bookings'
const DRAFT_KEY = 'city-rental-car.booking-draft'

function readAll() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(bookings) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

export function listBookings() {
  return readAll()
}

export function getBooking(id) {
  return readAll().find((booking) => booking.id === id) || null
}

export function saveBooking(booking) {
  const bookings = readAll().filter((item) => item.id !== booking.id)
  bookings.unshift(booking)
  writeAll(bookings)
  return booking
}

export function updateBooking(id, changes) {
  const bookings = readAll().map((booking) => (booking.id === id ? { ...booking, ...changes } : booking))
  writeAll(bookings)
  return bookings.find((booking) => booking.id === id) || null
}

export function saveBookingDraft(draft) {
  if (!draft?.vehicleId) return
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function readBookingDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null')
  } catch {
    return null
  }
}

export function clearBookingDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
}

export function getCurrentCustomer() {
  const user = getStoredUser()
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: '',
    licenseNumber: '',
    notes: '',
  }
}

export function buildBooking({ values, vehicle, pricing }) {
  const selected = rentalExtras.filter((extra) => values.extras.includes(extra.id))

  return {
    id: generateBookingReference(readAll().map((booking) => booking.id)),
    vehicleId: vehicle.id,
    vehicleName: `${vehicle.brand} ${vehicle.model}`,
    customer: {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      country: values.country.trim(),
      licenseNumber: values.licenseNumber.trim(),
      notes: values.notes?.trim() || '',
    },
    pickupLocation: values.pickupLocation,
    dropoffLocation: values.dropoffLocation,
    pickupDate: values.pickupDate,
    returnDate: values.returnDate,
    pickupTime: values.pickupTime,
    returnTime: values.returnTime,
    extras: selected.map(({ id, name, pricePerDay }) => ({ id, name, pricePerDay })),
    pricing,
    acceptedTerms: true,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  }
}

export async function submitBooking(booking) {
  // Replace this mock with POST /api/bookings when the API is connected.
  await new Promise((resolve) => {
    window.setTimeout(resolve, 700)
  })
  return saveBooking(booking)
}

export function getBookingVehicle(booking) {
  if (!booking) return null
  return findMockVehicle(booking.vehicleId)
}

const transitions = {
  Pending: ['Confirmed', 'Rejected', 'Cancelled'],
  Confirmed: ['Active', 'Cancelled'],
  Active: ['Completed'],
  Completed: [],
  Cancelled: [],
  Rejected: [],
}

const demoCustomer = {
  id: 'user-001',
  firstName: 'Abdi',
  lastName: 'Mohamed',
  email: 'customer@cityrentalcar.com',
  phone: '+252 61 000 0001',
}

export class BookingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BookingError'
  }
}

function delay(ms = 180) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function allowedTransitions(status) {
  return transitions[status] ? [...transitions[status]] : []
}

function rangesOverlap(startA, endA, startB, endB) {
  if (!startA || !endA || !startB || !endB) return false
  return startA <= endB && startB <= endA
}

export function findBookingConflict(booking, records = readAll()) {
  return records.find((other) => {
    if (other.id === booking.id) return false
    if (other.vehicleId !== booking.vehicleId) return false
    if (other.status !== 'Confirmed' && other.status !== 'Active') return false
    return rangesOverlap(booking.pickupDate, booking.returnDate, other.pickupDate, other.returnDate)
  })
}

function seedCustomer(record) {
  if (record.customer?.email || record.customer?.firstName) return record.customer
  return { ...demoCustomer }
}

function ensureCatalog() {
  const current = readAll()
  const ids = new Set(current.map((item) => item.id))
  const missing = mockBookings
    .filter((item) => !ids.has(item.id))
    .map((item) => ({
      ...item,
      customer: seedCustomer(item),
      notes: item.notes || '',
      paymentStatus: item.paymentStatus || 'Pending',
    }))
  if (missing.length) writeAll([...missing, ...current])
  return readAll()
}

export function toAdminBooking(record) {
  const vehicle = findMockVehicle(record.vehicleId)
  const customer = seedCustomer(record)
  const name = customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Customer'
  const pricing = record.pricing || {}
  const total = Number(pricing.total ?? record.amount ?? 0)
  const rentalDays = Number(pricing.rentalDays || pricing.days) || countRentalDays(record.pickupDate, record.returnDate)
  const base = Number(pricing.base)
  const relatedPayments = readPayments().filter((item) => item.bookingId === record.id && item.paymentType !== 'Refund')
  const payment = relatedPayments[0]
  const paymentStatus = record.paymentStatus || payment?.status || 'Pending'
  const closed = record.status === 'Cancelled' || record.status === 'Rejected'
  const amountPaid = netCollected(readPayments().filter((item) => item.bookingId === record.id))
  return {
    id: record.id,
    bookingReference: record.id,
    customer: {
      id: customer.id || '',
      name,
      email: customer.email || '',
      phone: customer.phone || '',
    },
    vehicle: {
      id: record.vehicleId || '',
      brand: vehicle?.brand || '',
      model: vehicle?.model || record.vehicleName || 'Vehicle',
      year: vehicle?.year || null,
      image: assetSrc(vehicle?.image || record.image),
      category: vehicle?.category || '',
    },
    pickupLocation: record.pickupLocation || '',
    dropoffLocation: record.dropoffLocation || '',
    pickupDate: record.pickupDate || '',
    returnDate: record.returnDate || '',
    pickupTime: record.pickupTime || '',
    returnTime: record.returnTime || '',
    extras: record.extras || [],
    pricing: {
      rentalDays,
      dailyRate: rentalDays > 0 && Number.isFinite(base) ? Math.round(base / rentalDays) : Number(pricing.dailyRate) || 0,
      extrasTotal: Number(pricing.extrasTotal) || 0,
      discount: Number(pricing.discount) || 0,
      base: Number.isFinite(base) ? base : null,
      total,
      currency: 'USD',
    },
    status: record.status || 'Pending',
    paymentStatus,
    paymentReference: payment?.id || '',
    amountPaid,
    outstanding: closed ? 0 : Math.max(0, total - amountPaid),
    notes: record.notes || customer.notes || '',
    createdAt: record.createdAt || '',
  }
}

function statsFor(records) {
  const count = (status) => records.filter((item) => item.status === status).length
  const cancelled = count('Cancelled')
  const rejected = count('Rejected')
  return {
    total: records.length,
    pending: count('Pending'),
    confirmed: count('Confirmed'),
    active: count('Active'),
    completed: count('Completed'),
    cancelled,
    rejected,
    cancelledOrRejected: cancelled + rejected,
  }
}

function matchesSearch(booking, search) {
  if (!search) return true
  const vehicle = `${booking.vehicle.brand} ${booking.vehicle.model}`.toLowerCase()
  return [booking.bookingReference, booking.customer.name, booking.customer.email, vehicle].join(' ').toLowerCase().includes(search)
}

export function listAdminBookings() {
  return ensureCatalog().map(toAdminBooking)
}

export async function getBookingStats() {
  await delay(80)
  return statsFor(ensureCatalog().map(toAdminBooking))
}

export async function getBookings(params = {}) {
  await delay()
  const bookings = ensureCatalog().map(toAdminBooking)
  const search = String(params.search || '').trim().toLowerCase()
  const filtered = bookings.filter((booking) => {
    if (!matchesSearch(booking, search)) return false
    if (params.status && booking.status !== params.status) return false
    if (params.paymentStatus && booking.paymentStatus !== params.paymentStatus) return false
    if (params.category && booking.vehicle.category !== params.category) return false
    if (params.pickupFrom && booking.pickupDate < params.pickupFrom) return false
    if (params.pickupTo && booking.pickupDate > params.pickupTo) return false
    return true
  })
  const sort = params.sort || 'newest'
  filtered.sort((left, right) => {
    if (sort === 'oldest') return left.createdAt.localeCompare(right.createdAt)
    if (sort === 'pickup-asc') return left.pickupDate.localeCompare(right.pickupDate)
    if (sort === 'pickup-desc') return right.pickupDate.localeCompare(left.pickupDate)
    if (sort === 'price-asc') return left.pricing.total - right.pricing.total
    if (sort === 'price-desc') return right.pricing.total - left.pricing.total
    return right.createdAt.localeCompare(left.createdAt)
  })
  const pageSize = params.pageSize || 4
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(Math.max(Number(params.page) || 1, 1), pageCount)
  const start = (page - 1) * pageSize
  return {
    bookings: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageCount,
    pageSize,
    stats: statsFor(bookings),
  }
}

export async function getBookingById(id) {
  await delay(100)
  const record = ensureCatalog().find((item) => item.id === id)
  if (!record) throw new BookingError('This booking could not be found.')
  return toAdminBooking(record)
}

export async function createBooking(bookingData) {
  await delay()
  const booking = {
    ...bookingData,
    id: bookingData.id || generateBookingReference(readAll().map((item) => item.id)),
    status: bookingData.status || 'Pending',
    paymentStatus: bookingData.paymentStatus || 'Pending',
    createdAt: bookingData.createdAt || new Date().toISOString(),
  }
  return saveBooking(booking)
}

export async function updateBookingStatus(id, nextStatus) {
  await delay()
  const records = ensureCatalog()
  const current = records.find((item) => item.id === id)
  if (!current) throw new BookingError('This booking could not be found.')
  if (!allowedTransitions(current.status).includes(nextStatus)) {
    throw new BookingError(`${current.status} bookings cannot move to ${nextStatus}.`)
  }
  if (nextStatus === 'Confirmed' || nextStatus === 'Active') {
    const conflict = findBookingConflict({ ...current, status: nextStatus }, records)
    if (conflict) {
      throw new BookingError(`This overlaps ${conflict.id}, which is already ${conflict.status.toLowerCase()} for the same vehicle.`)
    }
  }
  const saved = updateBooking(id, { status: nextStatus })
  return toAdminBooking(saved)
}

export async function cancelBooking(id, reason = '') {
  await delay()
  const current = ensureCatalog().find((item) => item.id === id)
  if (!current) throw new BookingError('This booking could not be found.')
  if (!allowedTransitions(current.status).includes('Cancelled')) {
    throw new BookingError(`${current.status} bookings cannot be cancelled.`)
  }
  const note = reason.trim()
  const saved = updateBooking(id, {
    status: 'Cancelled',
    notes: note ? [current.notes, `Cancelled: ${note}`].filter(Boolean).join(' ') : current.notes || '',
  })
  return toAdminBooking(saved)
}
