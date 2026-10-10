import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthLoading } from '@/components/auth/AuthLoading'
import { useAuth } from '@/hooks/useAuth'
import { routes } from '@/constants/routes'
import { saveBookingDraft } from '@/services/bookingService'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <AuthLoading />
  if (!isAuthenticated) {
    if (sessionStorage.getItem('city-rental-car.logout') === '1') {
      return <Navigate to={routes.login} replace />
    }
    if (location.state?.vehicleId) saveBookingDraft(location.state)
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`${routes.login}?redirect=${redirect}`} replace />
  }

  return <Outlet />
}
