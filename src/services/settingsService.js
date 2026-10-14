import { getStoredUser } from '@/utils/authStorage'
import { defaultSettings } from '@/utils/settingsDefaults'
import { settingsSchema } from '@/validators/settingsSchema'

const STORAGE_KEY = 'city-rental-car.settings'

export class SettingsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SettingsError'
  }
}

export function canEditSettings(role = getStoredUser()?.role) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

function merge(base, saved) {
  if (!saved || typeof saved !== 'object') return structuredClone(base)
  const next = Array.isArray(base) ? [...base] : { ...base }
  Object.keys(base).forEach((key) => {
    if (saved[key] === undefined) return
    if (base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) next[key] = merge(base[key], saved[key])
    else next[key] = saved[key]
  })
  if (saved.savedAt) next.savedAt = saved.savedAt
  return next
}

export function getSettings() {
  if (typeof window === 'undefined') return structuredClone(defaultSettings)
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    return merge(defaultSettings, saved)
  } catch {
    return structuredClone(defaultSettings)
  }
}

export async function saveSettings(values) {
  if (!canEditSettings()) throw new SettingsError('Only an admin can change system settings.')
  const parsed = settingsSchema.parse(values)
  const record = { ...parsed, savedAt: new Date().toISOString() }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  return record
}

export async function resetSettings() {
  if (!canEditSettings()) throw new SettingsError('Only an admin can reset system settings.')
  window.localStorage.removeItem(STORAGE_KEY)
  return structuredClone(defaultSettings)
}
