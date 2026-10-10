import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { FormNotice } from '@/components/forms/AuthCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.email('Enter a valid email address'),
  message: z.string().min(10, 'Write at least a short message'),
})

export default function ContactPage() {
  const [acknowledged, setAcknowledged] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  })

  return (
    <div className="py-10 sm:py-14">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <PageHeader
          eyebrow="Contact"
          title="Speak with the desk"
          description="Ask about pickup points, fleet questions, or partnership. This form checks your details locally and does not send them yet."
        />
        <form
          className="space-y-4 rounded-2xl border border-line bg-paper p-6 sm:p-8"
          onSubmit={handleSubmit(() => setAcknowledged(true))}
          noValidate
        >
          <FormField label="Name" htmlFor="contact-name" error={errors.name?.message}>
            <Input id="contact-name" autoComplete="name" {...register('name')} />
          </FormField>
          <FormField label="Email" htmlFor="contact-email" error={errors.email?.message}>
            <Input id="contact-email" type="email" autoComplete="email" {...register('email')} />
          </FormField>
          <FormField label="Message" htmlFor="contact-message" error={errors.message?.message}>
            <Textarea id="contact-message" {...register('message')} />
          </FormField>
          {acknowledged ? (
            <FormNotice>The form is valid. Message delivery will be connected in a later module.</FormNotice>
          ) : null}
          <Button type="submit">Send message</Button>
        </form>
      </Container>
    </div>
  )
}
