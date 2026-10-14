import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from '@/lib/router'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminMobileHeader } from '@/components/admin/AdminMobileHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getHeaderNotices } from '@/services/adminService'

const pageCopy = [
  { test: (path) => path === routes.admin.root, title: 'Dashboard', subtitle: 'Fleet, bookings, and sample revenue in one view.' },
  { test: (path) => path === routes.admin.newVehicle, title: 'Add vehicle', subtitle: 'Add a vehicle to the City Rental Car fleet.' },
  { test: (path) => /\/admin\/vehicles\/[^/]+\/edit$/.test(path), title: 'Edit vehicle', subtitle: 'Update prices, specifications, and availability.' },
  { test: (path) => /\/admin\/vehicles\/[^/]+$/.test(path), title: 'Vehicle details', subtitle: 'Review this vehicle before editing it.' },
  { test: (path) => path.startsWith(routes.admin.vehicles), title: 'Vehicle Management', subtitle: 'Search, filter, and update every vehicle in the fleet.' },
  { test: (path) => /^\/admin\/bookings\/[^/]+$/.test(path), title: 'Booking details', subtitle: 'Review the reservation, customer, vehicle, and price.' },
  { test: (path) => path === routes.admin.bookings, title: 'Booking Management', subtitle: 'Review requests, confirm reservations, and follow each rental.' },
  { test: (path) => /^\/admin\/customers\/[^/]+$/.test(path), title: 'Customer details', subtitle: 'Profile, linked bookings, and recorded payments.' },
  { test: (path) => path === routes.admin.customers, title: 'Customers', subtitle: 'Renter profiles and linked booking activity.' },
  { test: (path) => /^\/admin\/payments\/[^/]+$/.test(path), title: 'Payment details', subtitle: 'Review the transaction, customer, and amount retained.' },
  { test: (path) => path === routes.admin.payments, title: 'Payments Management', subtitle: 'Record office payments and refunds against existing bookings.' },
  { test: (path) => path === routes.admin.newExpense, title: 'Add expense', subtitle: 'Record an operating cost without treating it as paid until payment is recorded.' },
  { test: (path) => /\/admin\/expenses\/[^/]+\/edit$/.test(path), title: 'Edit expense', subtitle: 'Update details without erasing an approval or payment decision.' },
  { test: (path) => /\/admin\/expenses\/[^/]+$/.test(path), title: 'Expense details', subtitle: 'Review the cost, approval, and payment separately.' },
  { test: (path) => path === routes.admin.expenses, title: 'Expenses Management', subtitle: 'Track operating costs separately from money already paid.' },
  { test: (path) => path === routes.admin.newMaintenance, title: 'Add maintenance', subtitle: 'Schedule service against a vehicle already in the fleet.' },
  { test: (path) => /\/admin\/maintenance\/[^/]+\/edit$/.test(path), title: 'Edit maintenance', subtitle: 'Update the service details and recorded costs.' },
  { test: (path) => /\/admin\/maintenance\/[^/]+$/.test(path), title: 'Maintenance details', subtitle: 'Review the job, cost, and vehicle status.' },
  { test: (path) => path === routes.admin.maintenance, title: 'Vehicle Maintenance', subtitle: 'Schedule service and keep cars off the rental list while work is underway.' },
  { test: (path) => path === routes.admin.reports, title: 'Reports & Analytics', subtitle: 'Bookings, collections, and expenses for the selected period.' },
  { test: (path) => path === routes.admin.settings, title: 'System Settings', subtitle: 'Business details and desk preferences saved in this browser.' },
  { test: (path) => path === routes.admin.profile, title: 'Profile', subtitle: 'The signed-in desk account.' },
]

function pageMeta(pathname) {
  return pageCopy.find((item) => item.test(pathname)) || pageCopy[0]
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [noticesOpen, setNoticesOpen] = useState(false)
  const [notices, setNotices] = useState([])
  const meta = pageMeta(location.pathname)

  useEffect(() => {
    setOpen(false)
    setNoticesOpen(false)
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
    getHeaderNotices().then((items) => {
      if (active) setNotices(items)
    })
    return () => {
      active = false
    }
  }, [])

  async function onLogout() {
    setOpen(false)
    await logout()
    navigate(routes.login)
  }

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <AdminSidebar user={user} open={open} onClose={() => setOpen(false)} onLogout={onLogout} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <AdminMobileHeader
          title={meta.title}
          noticeCount={notices.length}
          menuOpen={open}
          onOpenMenu={() => setOpen(true)}
          onOpenNotices={() => setNoticesOpen((current) => !current)}
        />
        {noticesOpen ? (
          <div className="border-b border-border bg-surface px-4 py-3 lg:hidden" data-admin-notices>
            <p className="text-caption font-semibold tracking-[0.14em] text-muted uppercase">Sample updates</p>
            <ul className="mt-2 space-y-2">
              {notices.map((notice) => (
                <li key={notice.id}>
                  <p className="text-small font-medium text-foreground">{notice.title}</p>
                  <p className="text-caption text-muted">{notice.time}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <AdminHeader
            title={meta.title}
            subtitle={meta.subtitle}
            notices={notices}
            noticesOpen={noticesOpen}
            onToggleNotices={setNoticesOpen}
          />
          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
