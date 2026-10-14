import { todayKey } from '@/utils/maintenanceCalculations'

export function shiftDays(day, amount) {
  const [year, month, date] = day.split('-').map(Number)
  const next = new Date(year, month - 1, date)
  next.setDate(next.getDate() + amount)
  return todayKey(next)
}

export function eachDay(from, to) {
  const days = []
  let cursor = from
  while (cursor && to && cursor <= to && days.length < 400) {
    days.push(cursor)
    cursor = shiftDays(cursor, 1)
  }
  return days
}

export function periodRange({ preset = 'year', from = '', to = '' } = {}, today = todayKey()) {
  const [year, month] = today.split('-').map(Number)
  const monthKey = String(month).padStart(2, '0')
  if (preset === 'today') return { from: today, to: today, label: 'Today' }
  if (preset === '7') return { from: shiftDays(today, -6), to: today, label: 'Last 7 days' }
  if (preset === '30') return { from: shiftDays(today, -29), to: today, label: 'Last 30 days' }
  if (preset === 'month') return { from: `${year}-${monthKey}-01`, to: today, label: 'This month' }
  if (preset === 'last-month') {
    const start = new Date(year, month - 2, 1)
    const end = new Date(year, month - 1, 0)
    return { from: todayKey(start), to: todayKey(end), label: 'Last month' }
  }
  if (preset === 'year') return { from: `${year}-01-01`, to: today, label: 'This year' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return { error: 'Enter a valid start and end date.' }
  }
  if (to < from) return { error: 'The end date cannot be earlier than the start date.' }
  return { from, to, label: `${from} to ${to}` }
}

export function inRange(day, range) {
  return Boolean(day) && day >= range.from && day <= range.to
}

export function dayOf(value) {
  return String(value || '').slice(0, 10)
}

export function groupMode(range) {
  const span = eachDay(range.from, range.to).length
  if (span <= 31) return 'day'
  if (span <= 120) return 'week'
  return 'month'
}

export function bucketKey(day, mode) {
  if (mode === 'month') return day.slice(0, 7)
  if (mode === 'week') {
    const [year, month, date] = day.split('-').map(Number)
    const current = new Date(year, month - 1, date)
    const offset = (current.getDay() + 6) % 7
    current.setDate(current.getDate() - offset)
    return todayKey(current)
  }
  return day
}

export function cents(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.round(number * 100)
}

export function fromCents(value) {
  return value / 100
}
