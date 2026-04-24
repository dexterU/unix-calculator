import type { Metadata } from 'next'
import AdminDashboardClient from './AdminDashboardClient'

export const metadata: Metadata = {
  title: 'Admin | Unix Calculator',
  description: 'Administrator dashboard',
}

export default function AdminPage() {
  return <AdminDashboardClient />
}
