import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { PasswordField } from '@/components/auth/PasswordField'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { routes } from '@/constants/routes'
import { AuthError } from '@/services/authService'

const schema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.').min(8, 'Use at least 8 characters.'),
  remember: z.boolean(),
})

export function LoginForm({ onSubmit }) {
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  })

  async function submit(values) {
    setFormError('')
    try {
      await onSubmit(values)
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : 'Something went wrong while signing in. Please try again.')
    }
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(submit)}>
      <Input id="login-email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <PasswordField id="login-password" label="Password" autoComplete="current-password" placeholder="Your password" error={errors.password?.message} {...register('password')} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Checkbox id="remember-me" label="Remember Me" {...register('remember')} />
        <Link to={routes.forgotPassword} className="text-small font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          Forgot Password?
        </Link>
      </div>
      {formError ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-small text-danger" role="alert">
          {formError}
        </p>
      ) : null}
      <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
      <div className="space-y-2" aria-label="Future sign-in options">
        <p className="text-center text-caption text-muted">Social sign-in is not available yet.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" disabled>
            Google
          </Button>
          <Button type="button" variant="outline" disabled>
            Facebook
          </Button>
        </div>
      </div>
    </form>
  )
}
