import { z } from 'zod'

export const expenseCategories = [
  'Fuel',
  'Vehicle Maintenance',
  'Vehicle Insurance',
  'Vehicle Registration',
  'Vehicle Cleaning',
  'Vehicle Repairs',
  'Staff Salaries',
  'Office Rent',
  'Utilities',
  'Marketing',
  'Software and Subscriptions',
  'Transport',
  'Office Supplies',
  'Other',
]

export const expensePaymentMethods = ['Cash', 'EVC Plus', 'Zaad', 'Hormuud', 'Visa', 'Mastercard', 'Bank Transfer', 'Other']
export const expensePaymentStatuses = ['Unpaid', 'Paid', 'Partially Paid', 'Cancelled']
export const expenseApprovalStatuses = ['Pending', 'Approved', 'Rejected']

function moneyField(label, { allowZero = false } = {}) {
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
    if (number < 0 || (!allowZero && number <= 0)) {
      ctx.addIssue({ code: 'custom', message: allowZero ? `${label} cannot be negative.` : `${label} must be greater than zero.` })
    }
  }).transform((value) => Number(value))
}

export const expenseSchema = z.object({
  title: z.string().trim().min(3, 'Enter a title of at least 3 characters.').max(80, 'Keep the title under 80 characters.'),
  category: z.enum(expenseCategories, { error: 'Choose a category.' }),
  description: z.string().trim().min(10, 'Describe the expense in at least 10 characters.').max(500, 'Keep the description under 500 characters.'),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid expense date.'),
  vendor: z.string().trim().min(2, 'Enter the vendor.').max(80, 'Keep the vendor name under 80 characters.'),
  amount: moneyField('Amount'),
  currency: z.literal('USD', { error: 'Currency must be USD.' }),
  paymentMethod: z.enum(expensePaymentMethods, { error: 'Choose a payment method.' }),
  paymentStatus: z.enum(['Unpaid', 'Paid', 'Partially Paid'], { error: 'Choose a payment status.' }),
  amountPaid: z.any(),
  receiptReference: z.string().trim().max(40, 'Keep the receipt reference under 40 characters.'),
  vehicleId: z.string(),
  maintenanceId: z.string(),
  notes: z.string().max(500, 'Keep notes under 500 characters.'),
}).superRefine((value, ctx) => {
  if (value.paymentStatus !== 'Partially Paid') return
  const paid = Number(value.amountPaid)
  if (!Number.isFinite(paid) || paid <= 0) {
    ctx.addIssue({ code: 'custom', path: ['amountPaid'], message: 'Enter the amount already paid.' })
    return
  }
  if (paid >= Number(value.amount)) {
    ctx.addIssue({ code: 'custom', path: ['amountPaid'], message: 'A partial payment must be less than the full amount.' })
  }
})

export const emptyExpenseForm = {
  title: '',
  category: 'Fuel',
  description: '',
  expenseDate: '',
  vendor: '',
  amount: '',
  currency: 'USD',
  paymentMethod: 'Cash',
  paymentStatus: 'Unpaid',
  amountPaid: '',
  receiptReference: '',
  vehicleId: '',
  maintenanceId: '',
  notes: '',
}

export function expenseToForm(expense) {
  if (!expense) return emptyExpenseForm
  return {
    title: expense.title || '',
    category: expense.category || 'Fuel',
    description: expense.description || '',
    expenseDate: expense.expenseDate || '',
    vendor: expense.vendor || '',
    amount: String(expense.amount ?? ''),
    currency: expense.currency || 'USD',
    paymentMethod: expense.paymentMethod || 'Cash',
    paymentStatus: expense.paymentStatus === 'Cancelled' ? 'Unpaid' : expense.paymentStatus || 'Unpaid',
    amountPaid: expense.paymentStatus === 'Partially Paid' ? String(expense.amountPaid ?? '') : '',
    receiptReference: expense.receiptReference || '',
    vehicleId: expense.vehicleId || '',
    maintenanceId: expense.maintenanceId || '',
    notes: expense.notes || '',
  }
}
