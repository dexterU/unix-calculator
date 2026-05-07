import type { Metadata } from 'next'
import AdminDashboardClient from './AdminDashboardClient'

export const metadata: Metadata = {
  title: 'Admin Dashboard — Unix Calculator',
  description: 'Administrator dashboard for Unix Calculator.',
  alternates: { canonical: 'https://unixcalculator.com/admin' },
}

export default function AdminPage() {
  return <AdminDashboardClient />
}
