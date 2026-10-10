export function formatBookingDate(value) {
  if (!value) return ''
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function generateBookingReference(existingIds = [], date = new Date()) {
  const year = date.getFullYear()
  const prefix = `CR-${year}-`
  const used = existingIds
    .filter((id) => id.startsWith(prefix))
    .map((id) => Number(id.slice(prefix.length)))
    .filter((value) => Number.isInteger(value))
  const next = Math.max(0, ...used) + 1
  return `${prefix}${String(next).padStart(4, '0')}`
}
