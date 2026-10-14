export function toCents(value) {
  if (value === '' || value === null || value === undefined) return 0
  const number = Number(value)
  if (!Number.isFinite(number)) return null
  return Math.round(number * 100)
}

export function totalCost(partsCost, laborCost, otherCost) {
  const parts = toCents(partsCost)
  const labor = toCents(laborCost)
  const other = toCents(otherCost)
  if ([parts, labor, other].some((cents) => cents === null || cents < 0)) return null
  return (parts + labor + other) / 100
}

export function formatMaintenanceMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
}

export function todayKey(date = new Date()) {
  const copy = new Date(date)
  const month = String(copy.getMonth() + 1).padStart(2, '0')
  const day = String(copy.getDate()).padStart(2, '0')
  return `${copy.getFullYear()}-${month}-${day}`
}

export function isOverdue(record, today = todayKey()) {
  if (!record || !['Scheduled', 'In Progress'].includes(record.status)) return false
  return Boolean(record.scheduledDate) && record.scheduledDate < today
}

export function costLabel(record) {
  return record?.status === 'Completed' ? 'Recorded' : 'Estimate'
}

export function maintenanceStats(records = [], today = todayKey()) {
  const count = (status) => records.filter((record) => record.status === status).length
  const recordedCents = records
    .filter((record) => record.status === 'Completed')
    .reduce((sum, record) => sum + (toCents(record.totalCost) || 0), 0)
  return {
    total: records.length,
    scheduled: count('Scheduled'),
    inProgress: count('In Progress'),
    completed: count('Completed'),
    cancelled: count('Cancelled'),
    overdue: records.filter((record) => isOverdue(record, today)).length,
    recordedCost: recordedCents / 100,
    currency: 'USD',
  }
}
