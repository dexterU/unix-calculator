import type { Metadata } from 'next'
import UserProfileClient from './UserProfileClient'

export const metadata: Metadata = {
  title: 'Profile — Unix Calculator',
  description: 'Manage your Unix Calculator account profile.',
  alternates: { canonical: 'https://unixcalculator.com/profile' },
}

export default function ProfilePage() {
  return <UserProfileClient />
}
