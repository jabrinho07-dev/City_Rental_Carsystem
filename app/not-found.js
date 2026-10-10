'use client'

import NotFoundPage from '@/screens/public/NotFoundPage'
import { PublicShell } from '@/components/next/RouteShells'

export default function NotFound() {
  return (
    <PublicShell>
      <NotFoundPage />
    </PublicShell>
  )
}
