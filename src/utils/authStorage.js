const USER_KEY = 'city-rental-car.user'
const TOKEN_KEY = 'city-rental-car.token'

function readJson(storage, key) {
  try {
    return JSON.parse(storage.getItem(key) || 'null')
  } catch {
    return null
  }
}

export function getStoredUser() {
  return readJson(sessionStorage, USER_KEY) || readJson(localStorage, USER_KEY)
}

export function getAuthToken() {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

export function setStoredUser(user, token, { remember = false } = {}) {
  clearAuth()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(USER_KEY, JSON.stringify(user))
  storage.setItem(TOKEN_KEY, token)
}

export function removeStoredUser() {
  clearAuth()
}

export function clearAuth() {
  sessionStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}
