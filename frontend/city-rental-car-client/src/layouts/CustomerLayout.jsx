import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CustomerHeader } from '@/components/customer/CustomerHeader'
import { CustomerMobileHeader } from '@/components/customer/CustomerMobileHeader'
import { CustomerSidebar } from '@/components/customer/CustomerSidebar'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getNotifications } from '@/services/customerService'

const pageCopy = [
  {
    test: (path) => path === routes.customer.root,
    title: 'Dashboard',
    subtitle: 'Manage your rentals and account from one place.',
  },
  {
    test: (path) => path === routes.customer.bookings,
    title: 'My Bookings',
    subtitle: 'View and manage all your rental bookings.',
  },
  {
    test: (path) => path === routes.customer.newBooking,
    title: 'New booking',
    subtitle: 'Review the vehicle and send your rental request.',
  },
  {
    test: (path) => path.includes('/confirmation'),
    title: 'Booking confirmation',
    subtitle: 'Your request is saved in this browser session.',
  },
  {
    test: (path) => path.startsWith('/customer/bookings/'),
    title: 'Booking details',
    subtitle: 'Review the vehicle, schedule, and price for this rental.',
  },
  {
    test: (path) => path === routes.customer.payments,
    title: 'Payments',
    subtitle: 'Review sample charges linked to your bookings.',
  },
  {
    test: (path) => path === routes.customer.invoices,
    title: 'Invoices',
    subtitle: 'Preview invoice records for your rentals.',
  },
  {
    test: (path) => path === routes.customer.notifications,
    title: 'Notifications',
    subtitle: 'Booking, payment, and rental updates.',
  },
  {
    test: (path) => path === routes.customer.profile,
    title: 'Profile',
    subtitle: 'Personal details, security, and notification preferences.',
  },
]

function pageMeta(pathname) {
  return pageCopy.find((item) => item.test(pathname)) || {
    title: 'Dashboard',
    subtitle: 'Manage your rentals and account from one place.',
  }
}

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const meta = pageMeta(location.pathname)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    let active = true
    getNotifications().then((items) => {
      if (active) setUnreadCount(items.filter((item) => item.unread).length)
    })
    return () => {
      active = false
    }
  }, [location.pathname])

  async function onLogout() {
    setOpen(false)
    await logout()
    navigate(routes.login)
  }

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <CustomerSidebar user={user} open={open} onClose={() => setOpen(false)} onLogout={onLogout} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <CustomerMobileHeader user={user} unreadCount={unreadCount} menuOpen={open} onOpenMenu={() => setOpen(true)} />
        <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <CustomerHeader title={meta.title} subtitle={meta.subtitle} unreadCount={unreadCount} />
          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
