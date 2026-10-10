import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from '@/lib/router'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { resolvePostLoginPath } from '@/utils/authRedirect'

export default function Login() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    sessionStorage.removeItem('city-rental-car.logout')
  }, [])

  if (isAuthenticated) {
    return <Navigate to={resolvePostLoginPath(user.role, params.get('redirect'))} replace />
  }

  async function onSubmit(values) {
    const next = await login({
      email: values.email,
      password: values.password,
      remember: values.remember,
    })
    navigate(resolvePostLoginPath(next.role, params.get('redirect')), { replace: true })
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-h2 text-foreground">Welcome Back</h1>
        <p className="mt-2 text-small text-muted">Sign in to continue to City Rental Car.</p>
        <div className="mt-6">
          <LoginForm onSubmit={onSubmit} />
        </div>
        <p className="mt-6 text-small text-muted">
          Don't have an account?{' '}
          <Link to={routes.register} className="font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
