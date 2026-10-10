import { Navigate, Outlet } from '@/lib/router'
import { AuthLoading } from '@/components/auth/AuthLoading'
import { useAuth } from '@/hooks/useAuth'
import { routes } from '@/constants/routes'

export function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <AuthLoading />
  if (!isAuthenticated) return <Navigate to={routes.login} replace />
  if (user.role === 'SUPER_ADMIN' || allowedRoles.includes(user.role)) return <Outlet />
  return <Navigate to={routes.unauthorized} replace />
}
