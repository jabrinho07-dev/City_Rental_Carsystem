import { clearAuth, getStoredUser, setStoredUser } from '@/utils/authStorage'

const mockAccounts = [
  {
    id: 'user-001',
    firstName: 'Abdi',
    lastName: 'Mohamed',
    email: 'customer@cityrentalcar.com',
    phone: '+252 61 000 0001',
    role: 'CUSTOMER',
    password: 'Customer123!',
  },
  {
    id: 'user-002',
    firstName: 'Amina',
    lastName: 'Hassan',
    email: 'staff@cityrentalcar.com',
    phone: '+252 61 000 0002',
    role: 'STAFF',
    password: 'Staff123!',
  },
  {
    id: 'user-003',
    firstName: 'Omar',
    lastName: 'Ali',
    email: 'admin@cityrentalcar.com',
    phone: '+252 61 000 0003',
    role: 'ADMIN',
    password: 'Admin123!',
  },
  {
    id: 'user-004',
    firstName: 'Hodan',
    lastName: 'Yusuf',
    email: 'superadmin@cityrentalcar.com',
    phone: '+252 61 000 0004',
    role: 'SUPER_ADMIN',
    password: 'SuperAdmin123!',
  },
]

function delay(ms = 500) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function toPublicUser(account) {
  return {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    phone: account.phone,
    role: account.role,
  }
}

export class AuthError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

async function loginWithDatabase({ email, password, remember }) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (response.status === 503) return null
  const data = await response.json()
  if (!response.ok) throw new AuthError(data.code || 'INVALID', data.message || 'Invalid email or password.')
  setStoredUser(data.user, data.token, { remember })
  return data.user
}

export async function login({ email, password, remember = false }) {
  await delay()
  const normalized = email.trim().toLowerCase()

  if (normalized === 'network@cityrentalcar.com') {
    throw new AuthError('NETWORK', 'We could not reach the server. Check your connection and try again.')
  }
  if (normalized === 'server@cityrentalcar.com') {
    throw new AuthError('SERVER', 'Something went wrong while signing in. Please try again.')
  }

  try {
    const databaseUser = await loginWithDatabase({ email: normalized, password, remember })
    if (databaseUser) return databaseUser
  } catch (error) {
    if (error instanceof AuthError) throw error
  }

  const account = mockAccounts.find((item) => item.email === normalized && item.password === password)
  if (!account) throw new AuthError('INVALID', 'Invalid email or password.')

  const user = toPublicUser(account)
  setStoredUser(user, `mock-session-${user.id}`, { remember })
  return user
}

export async function register(values) {
  await delay()
  const email = values.email.trim().toLowerCase()

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, email }),
    })
    if (response.status !== 503) {
      const data = await response.json()
      if (!response.ok) throw new AuthError(data.code || 'INVALID', data.message || 'Could not create the account.')
      setStoredUser(data.user, data.token, { remember: false })
      return data.user
    }
  } catch (error) {
    if (error instanceof AuthError) throw error
  }

  if (mockAccounts.some((item) => item.email === email)) {
    throw new AuthError('EXISTS', 'An account with this email already exists.')
  }

  const user = {
    id: `user-${Date.now()}`,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email,
    phone: values.phone.trim(),
    role: 'CUSTOMER',
  }
  setStoredUser(user, `mock-session-${user.id}`, { remember: false })
  return user
}

export async function logout() {
  await delay(200)
  clearAuth()
}

export async function getCurrentUser() {
  await delay(150)
  return getStoredUser()
}

export async function forgotPassword() {
  await delay()
  return { ok: true }
}

export async function resetPassword({ token }) {
  await delay()
  if (!token) throw new AuthError('INVALID', 'This reset link is not valid.')
  return { ok: true }
}
