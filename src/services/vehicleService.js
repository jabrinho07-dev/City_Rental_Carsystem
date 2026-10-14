import { mockVehicles } from '@/constants/mockVehicles'
import { assetSrc } from '@/lib/assetSrc'

const STORAGE_KEY = 'city-rental-car.admin-vehicles'
const NOTICE_KEY = 'city-rental-car.vehicle-notice'
const PAGE_SIZE = 6

const statusFromAvailability = {
  available: 'Available',
  reserved: 'Reserved',
  rented: 'Rented',
  maintenance: 'Maintenance',
  inactive: 'Inactive',
}

export class VehicleError extends Error {
  constructor(message) {
    super(message)
    this.name = 'VehicleError'
  }
}

function delay(ms = 200) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function parseMileage(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const match = String(value || '').match(/\d+/)
  return match ? Number(match[0]) : 0
}

function mapMockVehicle(vehicle, index) {
  const image = assetSrc(vehicle.image)
  const weekly = vehicle.pricePerWeek ?? vehicle.weeklyPrice ?? 0
  const availability = String(vehicle.availability || '').toLowerCase()
  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    category: vehicle.category,
    dailyPrice: vehicle.pricePerDay ?? vehicle.dailyPrice ?? 0,
    weeklyPrice: weekly,
    monthlyPrice: vehicle.monthlyPrice ?? weekly * 4,
    seats: vehicle.seats,
    doors: vehicle.doors,
    transmission: vehicle.transmission,
    fuel: vehicle.fuel,
    mileage: parseMileage(vehicle.mileage),
    description: vehicle.description || '',
    features: vehicle.features?.length ? vehicle.features : ['Air Conditioning'],
    images: vehicle.images?.length ? vehicle.images.map(assetSrc).filter(Boolean) : image ? [image] : [],
    status: statusFromAvailability[availability] || vehicle.status || 'Available',
    createdAt: vehicle.createdAt || new Date(Date.UTC(vehicle.year || 2024, 0, index + 1)).toISOString(),
  }
}

function readStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!Array.isArray(saved)) return null
    return saved.map((vehicle, index) => mapMockVehicle(vehicle, index))
  } catch {
    return null
  }
}

function writeStore(vehicles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles))
}

function fleet() {
  const saved = readStore()
  if (saved) return saved
  const seeded = mockVehicles.map(mapMockVehicle)
  writeStore(seeded)
  return seeded
}

function statsFor(vehicles) {
  const count = (status) => vehicles.filter((vehicle) => vehicle.status === status).length
  return {
    total: vehicles.length,
    available: count('Available'),
    reserved: count('Reserved'),
    rented: count('Rented'),
    maintenance: count('Maintenance'),
    inactive: count('Inactive'),
  }
}

function compareVehicles(sort) {
  return (left, right) => {
    if (sort === 'oldest') return left.createdAt.localeCompare(right.createdAt)
    if (sort === 'price-asc') return left.dailyPrice - right.dailyPrice
    if (sort === 'price-desc') return right.dailyPrice - left.dailyPrice
    if (sort === 'name') return `${left.brand} ${left.model}`.localeCompare(`${right.brand} ${right.model}`)
    return right.createdAt.localeCompare(left.createdAt)
  }
}

export function setVehicleNotice(message) {
  sessionStorage.setItem(NOTICE_KEY, message)
}

export function consumeVehicleNotice() {
  const message = sessionStorage.getItem(NOTICE_KEY)
  sessionStorage.removeItem(NOTICE_KEY)
  return message
}

export function listStoredVehicles() {
  if (typeof window === 'undefined') return []
  return fleet()
}

export async function getVehicles(params = {}) {
  await delay()
  const vehicles = fleet()
  const search = String(params.search || '').trim().toLowerCase()
  const filtered = vehicles.filter((vehicle) => {
    const name = `${vehicle.brand} ${vehicle.model}`.toLowerCase()
    if (search && !name.includes(search) && !vehicle.brand.toLowerCase().includes(search) && !vehicle.model.toLowerCase().includes(search)) {
      return false
    }
    if (params.category && vehicle.category !== params.category) return false
    if (params.status && vehicle.status !== params.status) return false
    if (params.transmission && vehicle.transmission !== params.transmission) return false
    if (params.fuel && vehicle.fuel !== params.fuel) return false
    return true
  })
  filtered.sort(compareVehicles(params.sort || 'newest'))
  const pageSize = params.pageSize || PAGE_SIZE
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(Math.max(Number(params.page) || 1, 1), pageCount)
  const start = (page - 1) * pageSize
  return {
    vehicles: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageCount,
    pageSize,
    stats: statsFor(vehicles),
  }
}

export async function getVehicleById(id) {
  await delay(120)
  const vehicle = fleet().find((item) => item.id === id)
  if (!vehicle) throw new VehicleError('This vehicle could not be found.')
  return vehicle
}

export async function createVehicle(vehicleData) {
  await delay()
  const vehicles = fleet()
  const id = `veh-${Date.now()}`
  const vehicle = mapMockVehicle({ ...vehicleData, id, createdAt: new Date().toISOString() }, vehicles.length)
  writeStore([vehicle, ...vehicles])
  return vehicle
}

export async function updateVehicle(id, vehicleData) {
  await delay()
  const vehicles = fleet()
  const index = vehicles.findIndex((item) => item.id === id)
  if (index < 0) throw new VehicleError('This vehicle could not be found.')
  const next = mapMockVehicle({ ...vehicles[index], ...vehicleData, id, createdAt: vehicles[index].createdAt }, index)
  vehicles[index] = next
  writeStore(vehicles)
  return next
}

export async function deleteVehicle(id) {
  await delay()
  const vehicles = fleet()
  if (!vehicles.some((item) => item.id === id)) throw new VehicleError('This vehicle could not be found.')
  writeStore(vehicles.filter((item) => item.id !== id))
}

export async function updateVehicleStatus(id, status) {
  return updateVehicle(id, { status })
}
