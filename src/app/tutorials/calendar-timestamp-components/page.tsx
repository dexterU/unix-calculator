import type { Metadata } from 'next'
import CalendarTimestampComponentsClient from './CalendarTimestampComponentsClient'

export const metadata: Metadata = {
  title: 'Calendar Timestamp Components | Unix Calculator',
  description: 'Calendar Timestamp Components — Unix Calculator',
}

export default function Page() {
  return <CalendarTimestampComponentsClient />
}
