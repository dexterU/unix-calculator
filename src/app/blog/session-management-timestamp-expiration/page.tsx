import type { Metadata } from 'next'
import SessionManagementTimestampsClient from './SessionManagementTimestampsClient'

export const metadata: Metadata = {
  title: 'Session management & timestamp expiration | Unix Calculator',
  description:
    'JWT exp, refresh rotation, sliding sessions, and server-side time for secure session policies.',
}

export default function Page() {
  return <SessionManagementTimestampsClient />
}
