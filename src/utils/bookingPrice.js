export function todayDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function calculateRentalDays(pickupDate, returnDate) {
  return countRentalDays(pickupDate, returnDate)
}

export function countRentalDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return 0
  const start = Date.parse(`${pickupDate}T00:00:00`)
  const end = Date.parse(`${returnDate}T00:00:00`)
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0
  return Math.max(1, Math.round((end - start) / 86_400_000))
}

function remainderAfterWeeks(days, dailyRate, weeklyRate) {
  const weeks = Math.floor(days / 7)
  const remainder = days % 7
  return weeks * weeklyRate + remainder * dailyRate
}

export function calculateBaseRentalPrice({ dailyRate, weeklyRate, monthlyRate, days }) {
  return calculateRentalPrice({ dailyRate, weeklyRate, monthlyRate, days, extras: [] }).base
}

export function calculateExtrasPrice(extras = [], days = 0) {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 0
  return extras.reduce((sum, extra) => sum + extra.pricePerDay * safeDays, 0)
}

export function calculateTotalPrice({ dailyRate, weeklyRate, monthlyRate, days, extras = [] }) {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 0
  const base = calculateBaseRentalPrice({ dailyRate, weeklyRate, monthlyRate, days: safeDays })
  const extraLines = extras.map((extra) => ({
    id: extra.id,
    name: extra.name,
    amount: extra.pricePerDay * safeDays,
  }))
  const extrasTotal = calculateExtrasPrice(extras, safeDays)
  const subtotal = base + extrasTotal

  return {
    days: safeDays,
    base,
    extraLines,
    extrasTotal,
    taxes: 0,
    deposit: 0,
    subtotal,
    total: subtotal,
  }
}

export function calculateRentalPrice({ dailyRate, weeklyRate, monthlyRate, days, extras = [] }) {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 0
  let base = 0

  if (safeDays > 0) {
    if (safeDays >= 30 && monthlyRate) {
      const months = Math.floor(safeDays / 30)
      const remainder = safeDays % 30
      const remainderPrice = weeklyRate
        ? remainderAfterWeeks(remainder, dailyRate, weeklyRate)
        : remainder * dailyRate
      base = months * monthlyRate + remainderPrice
    } else if (safeDays >= 7 && weeklyRate) {
      base = remainderAfterWeeks(safeDays, dailyRate, weeklyRate)
    } else {
      base = safeDays * dailyRate
    }
  }

  const extrasTotal = extras.reduce((sum, extra) => sum + extra.pricePerDay * safeDays, 0)

  return {
    days: safeDays,
    base,
    extrasTotal,
    total: base + extrasTotal,
  }
}

export function validateBookingSchedule(values, today = todayDateString()) {
  const errors = {}
  const { pickupDate, returnDate, pickupTime, returnTime } = values

  if (!pickupDate) errors.pickupDate = 'Pickup date is required.'
  else if (pickupDate < today) errors.pickupDate = 'Pickup date cannot be in the past.'

  if (!returnDate) errors.returnDate = 'Return date is required.'
  else if (pickupDate && returnDate < pickupDate) errors.returnDate = 'Return date cannot be before the pickup date.'

  if (!pickupTime) errors.pickupTime = 'Pickup time is required.'
  if (!returnTime) errors.returnTime = 'Return time is required.'
  else if (pickupDate && returnDate && pickupDate === returnDate && pickupTime && returnTime <= pickupTime) {
    errors.returnTime = 'Return time must be after the pickup time on the same day.'
  }

  return errors
}

export function formatDuration(days) {
  if (!days) return 'Select dates'
  return days === 1 ? '1 Day' : `${days} Days`
}
