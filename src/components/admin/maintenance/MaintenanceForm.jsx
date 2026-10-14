import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  maintenancePriorities,
  maintenanceSchema,
  maintenanceTypes,
} from '@/validators/maintenanceSchema'
import { formatMaintenanceMoney, totalCost } from '@/utils/maintenanceCalculations'

function Section({ title, children }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <h2 className="text-h3 text-foreground">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function MaintenanceForm({ values, vehicles, submitLabel, resetKey = 'new', onSubmit, onCancel }) {
  const form = useForm({ resolver: zodResolver(maintenanceSchema), defaultValues: values })
  const selectedId = form.watch('vehicleId')
  const selected = vehicles.find((vehicle) => vehicle.id === selectedId)
  const parts = form.watch('partsCost')
  const labor = form.watch('laborCost')
  const other = form.watch('otherCost')
  const calculated = totalCost(parts, labor, other)

  useEffect(() => {
    form.reset(values)
    // Reset only when a different record is loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Section title="Vehicle">
        <Select
          id="maintenance-vehicle-id"
          label="Vehicle"
          placeholder="Select a vehicle"
          options={vehicles.map((vehicle) => ({ value: vehicle.id, label: `${vehicle.brand} ${vehicle.model}` }))}
          error={form.formState.errors.vehicleId?.message}
          {...form.register('vehicleId')}
        />
        <p className="text-small text-muted sm:col-span-2">
          {selected
            ? `${selected.brand} ${selected.model} · ${selected.year} · Registration not on file · Status ${selected.status}`
            : 'Choose a vehicle that already exists in the fleet.'}
        </p>
      </Section>
      <Section title="Service details">
        <Input id="maintenance-title" label="Title" error={form.formState.errors.title?.message} {...form.register('title')} />
        <Select
          id="maintenance-type-field"
          label="Maintenance type"
          options={maintenanceTypes.map((type) => ({ value: type, label: type }))}
          error={form.formState.errors.maintenanceType?.message}
          {...form.register('maintenanceType')}
        />
        <div className="sm:col-span-2">
          <Textarea id="maintenance-description" label="Description" error={form.formState.errors.description?.message} {...form.register('description')} />
        </div>
        <Select
          id="maintenance-priority-field"
          label="Priority"
          options={maintenancePriorities.map((priority) => ({ value: priority, label: priority }))}
          error={form.formState.errors.priority?.message}
          {...form.register('priority')}
        />
        <Input id="maintenance-date" label="Scheduled date" type="date" error={form.formState.errors.scheduledDate?.message} {...form.register('scheduledDate')} />
        <Input id="maintenance-odometer" label="Odometer" type="number" min="0" step="1" hint="Leave blank if unknown." error={form.formState.errors.odometer?.message} {...form.register('odometer')} />
        <Input id="maintenance-provider" label="Service provider" error={form.formState.errors.serviceProvider?.message} {...form.register('serviceProvider')} />
      </Section>
      <Section title="Cost details">
        <Input id="maintenance-parts" label="Parts cost (USD)" type="number" min="0" step="0.01" error={form.formState.errors.partsCost?.message} {...form.register('partsCost')} />
        <Input id="maintenance-labor" label="Labor cost (USD)" type="number" min="0" step="0.01" error={form.formState.errors.laborCost?.message} {...form.register('laborCost')} />
        <Input id="maintenance-other" label="Other cost (USD)" type="number" min="0" step="0.01" error={form.formState.errors.otherCost?.message} {...form.register('otherCost')} />
        <p className="text-small text-foreground">
          Total {calculated === null ? '—' : formatMaintenanceMoney(calculated)} USD
          <span className="mt-1 block text-caption text-muted">This stays an estimate until the job is completed.</span>
        </p>
      </Section>
      <Section title="Additional information">
        <div className="sm:col-span-2">
          <Input id="maintenance-parts-list" label="Parts replaced" hint="Separate parts with commas." error={form.formState.errors.partsReplaced?.message} {...form.register('partsReplaced')} />
        </div>
        <div className="sm:col-span-2">
          <Textarea id="maintenance-notes" label="Notes" error={form.formState.errors.notes?.message} {...form.register('notes')} />
        </div>
        <Input id="maintenance-next" label="Next service date" type="date" error={form.formState.errors.nextServiceDate?.message} {...form.register('nextServiceDate')} />
      </Section>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={form.formState.isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  )
}
