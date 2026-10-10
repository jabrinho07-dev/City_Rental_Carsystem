import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PasswordField } from '@/components/auth/PasswordField'
import { Button } from '@/components/ui/Button'
import { AuthError } from '@/services/authService'

const schema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match.' })
    }
  })

export function ResetPasswordForm({ onSubmit }) {
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function submit(values) {
    setFormError('')
    try {
      await onSubmit(values)
      setDone(true)
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : 'Something went wrong. Please try again.')
    }
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="rounded-md border border-success/30 bg-success/10 px-3 py-3 text-small text-foreground" role="status">
          Your password has been reset successfully.
        </p>
        <Button to="/login" className="w-full">
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(submit)}>
      <PasswordField id="reset-password" label="New Password" autoComplete="new-password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} />
      <PasswordField id="reset-confirm" label="Confirm Password" autoComplete="new-password" placeholder="Repeat your new password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      {formError ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-small text-danger" role="alert">
          {formError}
        </p>
      ) : null}
      <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  )
}
