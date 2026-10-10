import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getVehicleById } from '@/services/vehicleCatalog'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const vehicleId = pathname.match(/^\/cars\/([^/]+)$/)?.[1]
  const showBookingBar = vehicleId ? getVehicleById(decodeURIComponent(vehicleId))?.availability === 'available' : false

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showBookingBar ? <div className="h-16 lg:hidden" aria-hidden="true" /> : null}
    </div>
  )
}
