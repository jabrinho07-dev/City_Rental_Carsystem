import { useParams } from 'react-router-dom'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { useAuth } from '@/hooks/useAuth'

export default function ResetPassword() {
  const { token } = useParams()
  const { resetPassword } = useAuth()

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-h2 text-foreground">Reset Password</h1>
        <p className="mt-2 text-small text-muted">Choose a new password for your account.</p>
        <div className="mt-6">
          <ResetPasswordForm onSubmit={(values) => resetPassword({ token, password: values.password })} />
        </div>
      </div>
    </AuthLayout>
  )
}
