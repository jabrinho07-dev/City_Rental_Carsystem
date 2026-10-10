import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminMobileHeader } from '@/components/admin/AdminMobileHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getHeaderNotices } from '@/services/adminService'

const pageCopy = [
  { test: (path) => path === routes.admin.root, title: 'Dashboard', subtitle: 'Fleet, bookings, and sample revenue in one view.' },
  { test: (path) => path === routes.admin.newVehicle, title: 'New vehicle', subtitle: 'Add a vehicle to the fleet.' },
  { test: (path) => path.endsWith('/edit'), title: 'Edit vehicle', subtitle: 'Update a fleet record.' },
  { test: (path) => path.startsWith(routes.admin.vehicles), title: 'Vehicles', subtitle: 'Fleet records and availability.' },
  { test: (path) => path === routes.admin.bookings, title: 'Bookings', subtitle: 'Reservations across the desk.' },
  { test: (path) => path === routes.admin.customers, title: 'Customers', subtitle: 'Renter profiles and documents.' },
  { test: (path) => path === routes.admin.payments, title: 'Payments', subtitle: 'Charges collected against bookings.' },
  { test: (path) => path === routes.admin.expenses, title: 'Expenses', subtitle: 'Operating costs for the fleet.' },
  { test: (path) => path === routes.admin.maintenance, title: 'Maintenance', subtitle: 'Service work that takes a car offline.' },
  { test: (path) => path === routes.admin.reports, title: 'Reports', subtitle: 'Summaries for the rental operation.' },
  { test: (path) => path === routes.admin.settings, title: 'Settings', subtitle: 'Desk preferences and company details.' },
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
