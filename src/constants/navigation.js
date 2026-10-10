import {
  BarChart3,
  Bell,
  CalendarCheck,
  CarFront,
  CreditCard,
  LayoutDashboard,
  Receipt,
  Settings,
  User,
  Users,
  WalletCards,
  Wrench,
} from 'lucide-react'
import { routes } from '@/constants/routes'

export const publicNav = [
  { label: 'Home', to: routes.home, end: true },
  { label: 'Cars', to: routes.cars },
  { label: 'About', to: routes.about },
  { label: 'Contact', to: routes.contact },
]

export function accountNav(role) {
  if (role === 'CUSTOMER') {
    return [
      { label: 'Dashboard', to: routes.customer.root },
      { label: 'My Bookings', to: routes.customer.bookings },
      { label: 'Profile', to: routes.customer.profile },
    ]
  }
  if (role === 'STAFF') {
    return [
      { label: 'Staff Dashboard', to: routes.admin.root },
      { label: 'Bookings', to: routes.admin.bookings },
      { label: 'Profile', to: routes.admin.profile },
    ]
  }
  return [
    { label: 'Admin Dashboard', to: routes.admin.root },
    { label: 'Bookings', to: routes.admin.bookings },
    { label: 'Profile', to: routes.admin.profile },
  ]
}

export const customerNav = [
  { label: 'Dashboard', to: routes.customer.root, icon: LayoutDashboard, end: true },
  { label: 'My Bookings', to: routes.customer.bookings, icon: CalendarCheck },
  { label: 'Payments', to: routes.customer.payments, icon: CreditCard },
  { label: 'Invoices', to: routes.customer.invoices, icon: Receipt },
  { label: 'Notifications', to: routes.customer.notifications, icon: Bell },
  { label: 'Profile', to: routes.customer.profile, icon: User },
]

export const adminNavSections = [
  {
    label: 'Main',
    items: [{ label: 'Dashboard', to: routes.admin.root, icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Vehicles', to: routes.admin.vehicles, icon: CarFront },
      { label: 'Bookings', to: routes.admin.bookings, icon: CalendarCheck },
      { label: 'Customers', to: routes.admin.customers, icon: Users },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Payments', to: routes.admin.payments, icon: CreditCard },
      { label: 'Expenses', to: routes.admin.expenses, icon: WalletCards },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Maintenance', to: routes.admin.maintenance, icon: Wrench },
      { label: 'Reports', to: routes.admin.reports, icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [{ label: 'Settings', to: routes.admin.settings, icon: Settings }],
  },
]

export const adminNav = adminNavSections.flatMap((section) => section.items)
