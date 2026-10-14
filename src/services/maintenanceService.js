import { listAdminBookings } from '@/services/bookingService'
import { listStoredVehicles, updateVehicleStatus } from '@/services/vehicleService'
import {
  isOverdue,
  maintenanceStats,
  todayKey,
  totalCost,
} from '@/utils/maintenanceCalculations'

const STORAGE_KEY = 'city-rental-car.maintenance'

export const maintenanceTransitions = {
  Scheduled: ['In Progress', 'Cancelled'],
  'In Progress': ['Completed'],
  Completed: [],
  Cancelled: [],
}

const seed = [
  {
    id: 'MNT-2026-1001',
    reference: 'MNT-2026-1001',
    vehicleId: 'range-rover',
    maintenanceType: 'Routine Service',
    title: 'Scheduled service',
    description: 'Replace filters and inspect fluids while the Range Rover is already off the rental list.',
    priority: 'Medium',
    status: 'In Progress',
    scheduledDate: '2026-10-08',
    startedAt: '2026-10-08T08:00:00.000Z',
    completedAt: null,
    odometer: 18420,
    serviceProvider: 'City Service Bay',
    partsCost: 80,
    laborCost: 40,
    otherCost: 0,
    partsReplaced: ['Oil filter'],
    notes: '',
    nextServiceDate: '2027-04-08',
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-08T08:00:00.000Z',
  },
  {
    id: 'MNT-2026-1002',
    reference: 'MNT-2026-1002',
    vehicleId: 'toyota-corolla',
    maintenanceType: 'Oil Change',
    title: 'Oil and filter',
    description: 'Routine oil change before the next city rental block.',
    priority: 'Low',
    status: 'Scheduled',
    scheduledDate: '2026-10-22',
    startedAt: null,
    completedAt: null,
    odometer: 22110,
    serviceProvider: 'City Service Bay',
    partsCost: 25,
    laborCost: 15,
    otherCost: 0,
    partsReplaced: [],
    notes: '',
    nextServiceDate: '2027-01-22',
    createdAt: '2026-10-05T09:00:00.000Z',
    updatedAt: '2026-10-05T09:00:00.000Z',
  },
  {
    id: 'MNT-2026-1003',
    reference: 'MNT-2026-1003',
    vehicleId: 'hyundai-tucson',
    maintenanceType: 'Brake Service',
    title: 'Front brake pads',
    description: 'Pads are due. The job is still scheduled and the date has passed.',
    priority: 'High',
    status: 'Scheduled',
    scheduledDate: '2026-10-02',
    startedAt: null,
    completedAt: null,
    odometer: 30500,
    serviceProvider: 'Hodan Auto',
    partsCost: 70,
    laborCost: 35,
    otherCost: 0,
    partsReplaced: ['Front pads'],
    notes: '',
    nextServiceDate: null,
    createdAt: '2026-09-20T09:00:00.000Z',
    updatedAt: '2026-09-20T09:00:00.000Z',
  },
  {
    id: 'MNT-2026-1004',
    reference: 'MNT-2026-1004',
    vehicleId: 'toyota-prado',
    maintenanceType: 'Inspection',
    title: 'Safety inspection',
    description: 'Completed inspection before the current rental period.',
    priority: 'Medium',
    status: 'Completed',
    scheduledDate: '2026-09-12',
    startedAt: '2026-09-12T07:30:00.000Z',
    completedAt: '2026-09-12T11:00:00.000Z',
    odometer: 41200,
    serviceProvider: 'City Service Bay',
    partsCost: 0,
    laborCost: 45,
    otherCost: 5,
    partsReplaced: [],
    notes: 'No faults recorded.',
    nextServiceDate: '2027-03-12',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-12T11:00:00.000Z',
  },
  {
    id: 'MNT-2026-1005',
    reference: 'MNT-2026-1005',
    vehicleId: 'toyota-hiace',
    maintenanceType: 'Tire Replacement',
    title: 'Rear tires',
    description: 'Cancelled after the workshop found the tires still within wear limits.',
    priority: 'Low',
    status: 'Cancelled',
    scheduledDate: '2026-09-18',
    startedAt: null,
    completedAt: null,
    odometer: 56000,
    serviceProvider: 'Hodan Auto',
    partsCost: 0,
    laborCost: 0,
    otherCost: 0,
    partsReplaced: [],
    notes: 'Cancelled: tires still serviceable.',
    nextServiceDate: null,
    createdAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-16T09:00:00.000Z',
  },
  {
    id: 'MNT-2026-1006',
    reference: 'MNT-2026-1006',
    vehicleId: 'toyota-land-cruiser',
    maintenanceType: 'Engine Repair',
    title: 'Cooling check',
    description: 'Urgent cooling check before the confirmed October rental.',
    priority: 'Urgent',
    status: 'Scheduled',
    scheduledDate: '2026-10-18',
    startedAt: null,
    completedAt: null,
    odometer: 19880,
    serviceProvider: 'City Service Bay',
    partsCost: 40,
    laborCost: 60,
    otherCost: 10,
    partsReplaced: [],
    notes: '',
    nextServiceDate: null,
    createdAt: '2026-10-11T09:00:00.000Z',
    updatedAt: '2026-10-11T09:00:00.000Z',
  },
].map((record) => ({
  ...record,
  vehicleRegistration: '',
  totalCost: totalCost(record.partsCost, record.laborCost, record.otherCost),
}))

export class MaintenanceError extends Error {
  constructor(message) {
    super(message)
    this.name = 'MaintenanceError'
  }
}

function delay(ms = 120) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function readAll() {
  if (typeof window === 'undefined') return seed.map((record) => ({ ...record }))
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return writeAll(seed)
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : writeAll(seed)
  } catch {
    return writeAll(seed)
  }
}

function writeAll(records) {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  return records
}

function vehicleMap() {
  return new Map(listStoredVehicles().map((vehicle) => [vehicle.id, vehicle]))
}

function present(record, vehicles = vehicleMap()) {
  const vehicle = vehicles.get(record.vehicleId)
  const today = todayKey()
  return {
    ...record,
    vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehicle unavailable',
    vehicleRegistration: record.vehicleRegistration || '',
    vehicleStatus: vehicle?.status || '',
    vehicleMissing: !vehicle,
    overdue: isOverdue(record, today),
    totalCost: totalCost(record.partsCost, record.laborCost, record.otherCost) ?? 0,
  }
}

function nextReference(records) {
  const year = new Date().getFullYear()
  const used = new Set(records.map((record) => record.reference))
  let reference = ''
  do {
    reference = `MNT-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`
  } while (used.has(reference))
  return reference
}

function partsList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
}

function normalize(data, vehicle) {
  const cost = totalCost(data.partsCost, data.laborCost, data.otherCost)
  if (cost === null) throw new MaintenanceError('Costs must be zero or greater.')
  return {
    vehicleId: vehicle.id,
    vehicleRegistration: '',
    maintenanceType: data.maintenanceType,
    title: String(data.title || '').trim(),
    description: String(data.description || '').trim(),
    priority: data.priority,
    scheduledDate: data.scheduledDate,
    odometer: data.odometer === '' || data.odometer === null || data.odometer === undefined ? null : Number(data.odometer),
    serviceProvider: String(data.serviceProvider || '').trim(),
    partsCost: Number(data.partsCost),
    laborCost: Number(data.laborCost),
    otherCost: Number(data.otherCost),
    totalCost: cost,
    partsReplaced: partsList(data.partsReplaced),
    notes: String(data.notes || '').trim(),
    nextServiceDate: data.nextServiceDate || null,
  }
}

function requireVehicle(vehicleId) {
  const vehicle = vehicleMap().get(vehicleId)
  if (!vehicle) throw new MaintenanceError('Choose a vehicle that exists in the fleet.')
  return vehicle
}

function openRental(vehicleId) {
  const today = todayKey()
  return listAdminBookings().find((booking) => {
    if (booking.vehicle.id !== vehicleId) return false
    if (!['Confirmed', 'Active'].includes(booking.status)) return false
    return booking.returnDate >= today
  })
}

async function applyAvailability(vehicleId, nextStatus, records) {
  const vehicle = vehicleMap().get(vehicleId)
  if (!vehicle) return 'The vehicle is no longer in the fleet, so its status was not changed.'
  const rental = openRental(vehicleId)
  const otherOpen = records.some((record) => record.vehicleId === vehicleId && record.status === 'In Progress')

  if (nextStatus === 'In Progress') {
    if (rental && (vehicle.status === 'Reserved' || vehicle.status === 'Rented' || vehicle.status === 'Available')) {
      if (vehicle.status !== 'Available') {
        return `${vehicle.brand} ${vehicle.model} stays ${vehicle.status} because ${rental.bookingReference} is ${rental.status} until ${rental.returnDate}. This is a local check only.`
      }
    }
    if (vehicle.status === 'Reserved' || vehicle.status === 'Rented') {
      return `${vehicle.brand} ${vehicle.model} stays ${vehicle.status}. An in-progress job does not replace a rental status. This is a local check only.`
    }
    if (vehicle.status === 'Available') {
      await updateVehicleStatus(vehicleId, 'Maintenance')
      const bookingNote = rental
        ? ` ${rental.bookingReference} stays ${rental.status} until ${rental.returnDate}.`
        : ''
      return `${vehicle.brand} ${vehicle.model} is now Maintenance.${bookingNote} This local check is not a production lock.`
    }
    return `${vehicle.brand} ${vehicle.model} stays ${vehicle.status}.`
  }

  if (vehicle.status !== 'Maintenance') {
    return `${vehicle.brand} ${vehicle.model} stays ${vehicle.status}.`
  }
  if (otherOpen) {
    return `${vehicle.brand} ${vehicle.model} stays Maintenance because another job is still in progress.`
  }
  if (rental) {
    return `${vehicle.brand} ${vehicle.model} stays Maintenance because ${rental.bookingReference} is ${rental.status} until ${rental.returnDate}.`
  }
  await updateVehicleStatus(vehicleId, 'Available')
  return `${vehicle.brand} ${vehicle.model} is Available again. Confirm this on the server before offering the car.`
}

function matches(record, params) {
  const search = String(params.search || '').trim().toLowerCase()
  if (search) {
    const haystack = [record.reference, record.vehicleName, record.vehicleRegistration, record.title].join(' ').toLowerCase()
    if (!haystack.includes(search)) return false
  }
  if (params.status && record.status !== params.status) return false
  if (params.type && record.maintenanceType !== params.type) return false
  if (params.priority && record.priority !== params.priority) return false
  if (params.vehicleId && record.vehicleId !== params.vehicleId) return false
  if (params.dateFrom && record.scheduledDate < params.dateFrom) return false
  if (params.dateTo && record.scheduledDate > params.dateTo) return false
  return true
}

const priorityRank = { Urgent: 0, High: 1, Medium: 2, Low: 3 }

function sortRecords(records, sort) {
  const copy = [...records]
  copy.sort((left, right) => {
    if (sort === 'oldest') return left.createdAt.localeCompare(right.createdAt)
    if (sort === 'upcoming') return left.scheduledDate.localeCompare(right.scheduledDate)
    if (sort === 'priority') return (priorityRank[left.priority] ?? 9) - (priorityRank[right.priority] ?? 9)
    if (sort === 'cost-desc') return right.totalCost - left.totalCost
    if (sort === 'cost-asc') return left.totalCost - right.totalCost
    return right.createdAt.localeCompare(left.createdAt)
  })
  return copy
}

export function listStoredMaintenance() {
  return readAll()
}

export function listMaintenanceVehicles() {
  return listStoredVehicles()
}

export async function getMaintenanceRecords(params = {}) {
  await delay()
  const vehicles = vehicleMap()
  const records = readAll().map((record) => present(record, vehicles))
  const filtered = sortRecords(records.filter((record) => matches(record, params)), params.sort || 'newest')
  const pageSize = params.pageSize || 4
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(Math.max(Number(params.page) || 1, 1), pageCount)
  const start = (page - 1) * pageSize
  return {
    records: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageCount,
    pageSize,
    stats: maintenanceStats(records),
    upcoming: filteredUpcoming(records),
    recent: [...records].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, 4),
  }
}

function filteredUpcoming(records) {
  return records
    .filter((record) => ['Scheduled', 'In Progress'].includes(record.status))
    .sort((left, right) => Number(right.overdue) - Number(left.overdue) || left.scheduledDate.localeCompare(right.scheduledDate))
    .slice(0, 5)
}

export async function getMaintenanceStats() {
  await delay(60)
  return maintenanceStats(readAll().map((record) => present(record)))
}

export async function getUpcomingMaintenance() {
  await delay(60)
  return filteredUpcoming(readAll().map((record) => present(record)))
}

export async function getMaintenanceById(id) {
  await delay(80)
  const record = readAll().find((item) => item.id === id)
  return record ? present(record) : null
}

export async function createMaintenance(data) {
  await delay()
  const vehicle = requireVehicle(data.vehicleId)
  const records = readAll()
  const reference = nextReference(records)
  const now = new Date().toISOString()
  const record = {
    id: reference,
    reference,
    ...normalize(data, vehicle),
    status: 'Scheduled',
    startedAt: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  }
  writeAll([record, ...records])
  return present(record)
}

export async function updateMaintenance(id, data) {
  await delay()
  const records = readAll()
  const current = records.find((item) => item.id === id)
  if (!current) throw new MaintenanceError('This maintenance record could not be found.')
  const vehicle = requireVehicle(data.vehicleId)
  const next = {
    ...current,
    ...normalize(data, vehicle),
    status: current.status,
    startedAt: current.startedAt,
    completedAt: current.completedAt,
    updatedAt: new Date().toISOString(),
  }
  writeAll(records.map((item) => (item.id === id ? next : item)))
  return present(next)
}

export async function updateMaintenanceStatus(id, nextStatus, extra = {}) {
  await delay()
  const records = readAll()
  const current = records.find((item) => item.id === id)
  if (!current) throw new MaintenanceError('This maintenance record could not be found.')
  if (!maintenanceTransitions[current.status]?.includes(nextStatus)) {
    throw new MaintenanceError(`${current.status} maintenance cannot move to ${nextStatus}.`)
  }
  const now = new Date().toISOString()
  let next = { ...current, status: nextStatus, updatedAt: now }
  if (nextStatus === 'In Progress') next = { ...next, startedAt: now }
  if (nextStatus === 'Completed') {
    const partsCost = extra.partsCost ?? current.partsCost
    const laborCost = extra.laborCost ?? current.laborCost
    const otherCost = extra.otherCost ?? current.otherCost
    const cost = totalCost(partsCost, laborCost, otherCost)
    if (cost === null) throw new MaintenanceError('Final costs must be zero or greater.')
    next = {
      ...next,
      partsCost: Number(partsCost),
      laborCost: Number(laborCost),
      otherCost: Number(otherCost),
      totalCost: cost,
      notes: extra.notes != null ? String(extra.notes).trim() : current.notes,
      completedAt: now,
    }
  }
  const saved = records.map((item) => (item.id === id ? next : item))
  writeAll(saved)
  const availabilityNote = await applyAvailability(current.vehicleId, nextStatus, saved)
  return { record: present(next), availabilityNote }
}

export async function cancelMaintenance(id, reason = '') {
  const note = String(reason || '').trim()
  if (note.length < 3) throw new MaintenanceError('Enter a short reason for cancelling.')
  const records = readAll()
  const current = records.find((item) => item.id === id)
  if (!current) throw new MaintenanceError('This maintenance record could not be found.')
  return updateMaintenanceStatus(id, 'Cancelled', {}).then(async (result) => {
    const latest = readAll()
    const updated = latest.map((item) => (
      item.id === id
        ? { ...item, notes: [item.notes, `Cancelled: ${note}`].filter(Boolean).join(' ') }
        : item
    ))
    writeAll(updated)
    return { ...result, record: present(updated.find((item) => item.id === id)) }
  })
}
