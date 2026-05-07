import type { Metadata } from 'next'
import CalendarTimestampComponentsClient from './CalendarTimestampComponentsClient'

export const metadata: Metadata = {
  title: 'Calendar Timestamp Components — Years, Months & Timezones',
  description:
    'Civil date math vs instants: leap years, month boundaries, and timezone-safe scheduling patterns.',
  alternates: { canonical: 'https://unixcalculator.com/tutorials/calendar-timestamp-components' },
}

export default function Page() {
  return <CalendarTimestampComponentsClient />
}
