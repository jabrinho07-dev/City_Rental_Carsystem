import { z } from 'zod'

export const maintenanceTypes = [
  'Routine Service',
  'Oil Change',
  'Tire Replacement',
  'Brake Service',
  'Engine Repair',
  'Electrical Repair',
  'Accident Repair',
  'Inspection',
  'Other',
]

export const maintenancePriorities = ['Low', 'Medium', 'High', 'Urgent']
export const maintenanceStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled']

function moneyField(label) {
  return z.any().superRefine((value, ctx) => {
    if (value === '' || value === null || value === undefined) {
      ctx.addIssue({ code: 'custom', message: `${label} is required.` })
      return
    }
    const number = Number(value)
    if (!Number.isFinite(number)) {
      ctx.addIssue({ code: 'custom', message: `Enter a valid ${label.toLowerCase()}.` })
      return
    }
    if (number < 0) ctx.addIssue({ code: 'custom', message: `${label} cannot be negative.` })
  }).transform((value) => Number(value))
}

function optionalWholeNumber(label) {
  return z.any().superRefine((value, ctx) => {
    if (value === '' || value === null || value === undefined) return
    const number = Number(value)
    if (!Number.isInteger(number) || number < 0) {
      ctx.addIssue({ code: 'custom', message: `${label} must be a whole number of zero or more.` })
    }
  }).transform((value) => (value === '' || value === null || value === undefined ? null : Number(value)))
}

export const maintenanceSchema = z.object({
  vehicleId: z.string().trim().min(1, 'Choose a vehicle from the fleet.'),
  title: z.string().trim().min(3, 'Enter a title of at least 3 characters.').max(80, 'Keep the title under 80 characters.'),
  maintenanceType: z.enum(maintenanceTypes, { error: 'Choose a maintenance type.' }),
  description: z.string().trim().min(10, 'Describe the work in at least 10 characters.').max(500, 'Keep the description under 500 characters.'),
  priority: z.enum(maintenancePriorities, { error: 'Choose a priority.' }),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid scheduled date.'),
  odometer: optionalWholeNumber('Odometer'),
  serviceProvider: z.string().trim().min(2, 'Enter the service provider.').max(80, 'Keep the provider name under 80 characters.'),
  partsCost: moneyField('Parts cost'),
  laborCost: moneyField('Labor cost'),
  otherCost: moneyField('Other cost'),
  partsReplaced: z.string().max(300, 'Keep the parts list under 300 characters.'),
  notes: z.string().max(500, 'Keep notes under 500 characters.'),
  nextServiceDate: z.string(),
}).superRefine((value, ctx) => {
  if (!value.nextServiceDate) return
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.nextServiceDate)) {
    ctx.addIssue({ code: 'custom', path: ['nextServiceDate'], message: 'Enter a valid next service date.' })
    return
  }
  if (value.nextServiceDate < value.scheduledDate) {
    ctx.addIssue({ code: 'custom', path: ['nextServiceDate'], message: 'Next service date cannot be before the scheduled date.' })
  }
})

export const emptyMaintenanceForm = {
  vehicleId: '',
  title: '',
  maintenanceType: 'Routine Service',
  description: '',
  priority: 'Medium',
  scheduledDate: '',
  odometer: '',
  serviceProvider: '',
  partsCost: '0',
  laborCost: '0',
  otherCost: '0',
  partsReplaced: '',
  notes: '',
  nextServiceDate: '',
}

export function maintenanceToForm(record) {
  if (!record) return emptyMaintenanceForm
  return {
    vehicleId: record.vehicleId || '',
    title: record.title || '',
    maintenanceType: record.maintenanceType || 'Routine Service',
    description: record.description || '',
    priority: record.priority || 'Medium',
    scheduledDate: record.scheduledDate || '',
    odometer: record.odometer ?? '',
    serviceProvider: record.serviceProvider || '',
    partsCost: String(record.partsCost ?? 0),
    laborCost: String(record.laborCost ?? 0),
    otherCost: String(record.otherCost ?? 0),
    partsReplaced: (record.partsReplaced || []).join(', '),
    notes: record.notes || '',
    nextServiceDate: record.nextServiceDate || '',
  }
}
