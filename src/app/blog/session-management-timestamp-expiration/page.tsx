import type { Metadata } from 'next'
import SessionManagementTimestampsClient from './SessionManagementTimestampsClient'

export const metadata: Metadata = {
  title: 'Session Management Timestamp Expiration | Unix Calculator',
  description: 'Session Management Timestamp Expiration — Unix Calculator',
}

export default function Page() {
  return <SessionManagementTimestampsClient />
}
