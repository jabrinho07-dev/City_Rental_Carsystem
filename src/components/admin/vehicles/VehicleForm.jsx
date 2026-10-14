import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { VehicleImageUploader } from '@/components/admin/vehicles/VehicleImageUploader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  adminVehicleFeatures,
  fuelOptions,
  transmissionOptions,
  vehicleCategories,
  vehicleSchema,
  vehicleStatuses,
} from '@/validators/vehicleSchema'

function Section({ title, children }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <h2 className="text-h3 text-foreground">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function VehicleForm({ values, submitLabel, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: values,
  })
  const features = watch('features') || []
  const images = watch('images') || []

  useEffect(() => {
    reset(values)
  }, [reset, values])

  function toggleFeature(feature) {
    const next = features.includes(feature) ? features.filter((item) => item !== feature) : [...features, feature]
    setValue('features', next, { shouldDirty: true })
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Section title="Basic information">
        <Input id="brand" label="Brand" error={errors.brand?.message} {...register('brand')} />
        <Input id="model" label="Model" error={errors.model?.message} {...register('model')} />
        <Input id="year" label="Year" inputMode="numeric" error={errors.year?.message} {...register('year')} />
        <Select
          id="category"
          label="Category"
          placeholder="Choose a category"
          options={vehicleCategories.map((value) => ({ value, label: value }))}
          error={errors.category?.message}
          {...register('category')}
        />
        <div className="sm:col-span-2">
          <Textarea id="description" label="Description" error={errors.description?.message} {...register('description')} />
        </div>
      </Section>

      <Section title="Pricing">
        <Input id="dailyPrice" label="Daily price" inputMode="decimal" error={errors.dailyPrice?.message} {...register('dailyPrice')} />
        <Input id="weeklyPrice" label="Weekly price" inputMode="decimal" error={errors.weeklyPrice?.message} {...register('weeklyPrice')} />
        <Input id="monthlyPrice" label="Monthly price" inputMode="decimal" error={errors.monthlyPrice?.message} {...register('monthlyPrice')} />
      </Section>

      <Section title="Vehicle specifications">
        <Input id="seats" label="Number of seats" inputMode="numeric" error={errors.seats?.message} {...register('seats')} />
        <Input id="doors" label="Number of doors" inputMode="numeric" error={errors.doors?.message} {...register('doors')} />
        <Select
          id="transmission"
          label="Transmission"
          placeholder="Choose a transmission"
          options={transmissionOptions.map((value) => ({ value, label: value }))}
          error={errors.transmission?.message}
          {...register('transmission')}
        />
        <Select
          id="fuel"
          label="Fuel type"
          placeholder="Choose a fuel type"
          options={fuelOptions.map((value) => ({ value, label: value }))}
          error={errors.fuel?.message}
          {...register('fuel')}
        />
        <Input id="mileage" label="Mileage" hint="Kilometres included per day. Use 0 for unlimited city mileage." inputMode="numeric" error={errors.mileage?.message} {...register('mileage')} />
      </Section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Features</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {adminVehicleFeatures.map((feature) => (
            <label key={feature} className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-small text-foreground">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={features.includes(feature)}
                onChange={() => toggleFeature(feature)}
              />
              {feature}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Images</h2>
        <div className="mt-5">
          <VehicleImageUploader images={images} error={errors.images?.message} onChange={(next) => setValue('images', next, { shouldDirty: true })} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Availability</h2>
        <div className="mt-5 max-w-sm">
          <Select
            id="status"
            label="Initial status"
            options={vehicleStatuses.map((value) => ({ value, label: value }))}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
