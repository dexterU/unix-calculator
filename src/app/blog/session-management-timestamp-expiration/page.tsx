import type { Metadata } from 'next'
import SessionManagementTimestampsClient from './SessionManagementTimestampsClient'

export const metadata: Metadata = {
  title: 'Session management & timestamp expiration | Unix Calculator',
  description:
    'JWT exp, refresh rotation, sliding sessions, and server-side time for secure session policies.',
  alternates: {
    canonical: 'https://www.unixcalculator.com/blog/session-management-timestamp-expiration',
  },
}

export default function Page() {
  return <SessionManagementTimestampsClient />
}
