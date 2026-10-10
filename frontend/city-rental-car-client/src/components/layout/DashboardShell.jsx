import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { Sidebar } from '@/components/layout/Sidebar'
import { useDisclosure } from '@/hooks/useDisclosure'

export function DashboardShell({ label, title, items }) {
  const { isOpen, open, close } = useDisclosure()
  const location = useLocation()

  useEffect(() => {
    close()
  }, [location.pathname, close])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close])

  return (
    <div className="min-h-screen bg-sand lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <Sidebar label={label} items={items} open={isOpen} onClose={close} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <DashboardHeader title={title} onOpenMenu={open} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
