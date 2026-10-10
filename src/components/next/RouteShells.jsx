'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleRoute } from '@/components/auth/RoleRoute'
import AdminLayout from '@/layouts/AdminLayout'
import CustomerLayout from '@/layouts/CustomerLayout'
import PublicLayout from '@/layouts/PublicLayout'
import { OutletProvider } from '@/lib/router'

export function PublicShell({ children }) {
  return (
    <OutletProvider outlet={children}>
      <PublicLayout />
    </OutletProvider>
  )
}

export function CustomerShell({ children }) {
  return (
    <OutletProvider
      outlet={
        <OutletProvider
          outlet={
            <OutletProvider outlet={children}>
              <CustomerLayout />
            </OutletProvider>
          }
        >
          <RoleRoute allowedRoles={['CUSTOMER']} />
        </OutletProvider>
      }
    >
      <ProtectedRoute />
    </OutletProvider>
  )
}

export function AdminShell({ children }) {
  return (
    <OutletProvider
      outlet={
        <OutletProvider
          outlet={
            <OutletProvider outlet={children}>
              <AdminLayout />
            </OutletProvider>
          }
        >
          <RoleRoute allowedRoles={['STAFF', 'ADMIN']} />
        </OutletProvider>
      }
    >
      <ProtectedRoute />
    </OutletProvider>
  )
}
