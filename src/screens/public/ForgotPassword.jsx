import { Link } from '@/lib/router'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-h2 text-foreground">Forgot Your Password?</h1>
        <p className="mt-2 text-small text-muted">Enter your email address and we'll help you reset your password.</p>
        <div className="mt-6">
          <ForgotPasswordForm onSubmit={({ email }) => forgotPassword(email)} />
        </div>
        <p className="mt-6">
          <Link to={routes.login} className="text-small font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            Back to Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
