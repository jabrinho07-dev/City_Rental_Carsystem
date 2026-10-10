import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function Register() {
  const { register: registerAccount } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(values) {
    await registerAccount(values)
    navigate(routes.customer.root, { replace: true })
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-h2 text-foreground">Create Your Account</h1>
        <p className="mt-2 text-small text-muted">Open a customer account to request and manage rentals.</p>
        <div className="mt-6">
          <RegisterForm onSubmit={onSubmit} />
        </div>
        <p className="mt-6 text-small text-muted">
          Already have an account?{' '}
          <Link to={routes.login} className="font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
