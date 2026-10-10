import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.email('Enter a valid email address.'),
})

export function ForgotPasswordForm({ onSubmit }) {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  async function submit(values) {
    await onSubmit(values)
    setSent(true)
  }

  if (sent) {
    return (
      <p className="rounded-md border border-success/30 bg-success/10 px-3 py-3 text-small text-foreground" role="status">
        If an account exists for this email, password reset instructions have been sent.
      </p>
    )
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(submit)}>
      <Input id="forgot-email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  )
}
