const FILTER_KEYS = ['search', 'category', 'transmission', 'fuel', 'seats', 'availability', 'minPrice', 'maxPrice']

export const PAGE_SIZE = 6

export function readFleetQuery(params) {
  const page = Number(params.get('page') || 1)
  const allowedSorts = new Set(['recommended', 'price-low', 'price-high', 'newest', 'rating'])
  const sort = params.get('sort') || 'recommended'

  return {
    search: params.get('search') || '',
    category: params.get('category') || '',
    transmission: params.get('transmission') || '',
    fuel: params.get('fuel') || '',
    seats: params.get('seats') || '',
    availability: (params.get('availability') || '').toLowerCase(),
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    sort: allowedSorts.has(sort) ? sort : 'recommended',
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  }
}

export function writeFleetQuery(current, updates, { resetPage = true } = {}) {
  const next = { ...current, ...updates }
  if (resetPage && !Object.prototype.hasOwnProperty.call(updates, 'page')) next.page = 1

  const params = new URLSearchParams()
  FILTER_KEYS.forEach((key) => {
    if (next[key]) params.set(key, String(next[key]))
  })
  if (next.sort && next.sort !== 'recommended') params.set('sort', next.sort)
  if (next.page > 1) params.set('page', String(next.page))
  return params
}

export function filterVehicles(vehicles, query) {
  const search = query.search.trim().toLowerCase()
  const min = query.minPrice === '' ? null : Number(query.minPrice)
  const max = query.maxPrice === '' ? null : Number(query.maxPrice)
  const minimumSeats = query.seats === '' ? null : Number(query.seats)

  const matched = vehicles.filter((vehicle) => {
    if (search) {
      const haystack = `${vehicle.brand} ${vehicle.model} ${vehicle.category}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }
    if (query.category && vehicle.category.toLowerCase() !== query.category.toLowerCase()) return false
    if (query.transmission && vehicle.transmission.toLowerCase() !== query.transmission.toLowerCase()) return false
    if (query.fuel && vehicle.fuel.toLowerCase() !== query.fuel.toLowerCase()) return false
    if (minimumSeats !== null && vehicle.seats < minimumSeats) return false
    if (query.availability && vehicle.availability !== query.availability) return false
    if (min !== null && !Number.isNaN(min) && vehicle.pricePerDay < min) return false
    if (max !== null && !Number.isNaN(max) && vehicle.pricePerDay > max) return false
    return true
  })

  return sortVehicles(matched, query.sort)
}

function sortVehicles(vehicles, sort) {
  const list = [...vehicles]

  if (sort === 'price-low') return list.sort((a, b) => a.pricePerDay - b.pricePerDay)
  if (sort === 'price-high') return list.sort((a, b) => b.pricePerDay - a.pricePerDay)
  if (sort === 'newest') return list.sort((a, b) => b.year - a.year || a.brand.localeCompare(b.brand))
  if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating || a.brand.localeCompare(b.brand))

  return list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
}

export function paginateVehicles(vehicles, page) {
  const pageCount = Math.max(1, Math.ceil(vehicles.length / PAGE_SIZE))
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const start = (currentPage - 1) * PAGE_SIZE

  return {
    pageCount,
    currentPage,
    items: vehicles.slice(start, start + PAGE_SIZE),
  }
}
