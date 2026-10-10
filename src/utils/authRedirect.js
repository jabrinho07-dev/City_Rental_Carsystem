import { routes } from '@/constants/routes'

const customerRoles = ['CUSTOMER', 'SUPER_ADMIN']
const adminRoles = ['STAFF', 'ADMIN', 'SUPER_ADMIN']

export function safeRedirect(value) {
  if (typeof value !== 'string') return ''
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('://')) return ''
  if (value.startsWith('/login') || value.startsWith('/register')) return ''
  return value
}

export function canAccessPath(role, path) {
  if (path.startsWith('/admin')) return adminRoles.includes(role)
  if (path.startsWith('/customer')) return customerRoles.includes(role)
  return true
}

export function dashboardPath(role) {
  return role === 'CUSTOMER' ? routes.customer.root : routes.admin.root
}

export function resolvePostLoginPath(role, redirect) {
  const safe = safeRedirect(redirect)
  if (safe && canAccessPath(role, safe)) return safe
  return dashboardPath(role)
}
