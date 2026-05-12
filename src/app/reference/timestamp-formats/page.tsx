import type { Metadata } from 'next'
import TimestampFormatsClient from './TimestampFormatsClient'

export const metadata: Metadata = {
  title: 'Timestamp Formats — ISO 8601, RFC 3339, Unix Reference',
  description:
    'ISO 8601, RFC 3339, Unix seconds and milliseconds, HTTP-Date — choosing and naming timestamp formats in APIs.',
  alternates: { canonical: 'https://www.unixcalculator.com/reference/timestamp-formats' },
}

export default function Page() {
  return <TimestampFormatsClient />
}
