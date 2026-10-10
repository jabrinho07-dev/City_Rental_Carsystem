import { findMockVehicle } from '@/constants/mockVehicles'
import { getStoredUser } from '@/utils/authStorage'
import { rentalExtras } from '@/constants/vehicleOptions'
import { generateBookingReference } from '@/utils/generateBookingReference'

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
