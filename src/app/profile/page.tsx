import type { Metadata } from 'next'
import UserProfileClient from './UserProfileClient'

export const metadata: Metadata = {
  title: 'Profile | Unix Calculator',
  description: 'Your account profile',
}

export default function ProfilePage() {
  return <UserProfileClient />
}
