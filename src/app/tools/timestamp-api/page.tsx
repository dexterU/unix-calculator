import type { Metadata } from 'next'
import { TimestampApiClient } from './TimestampApiClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp API — Free JSON API for Timestamp Conversion',
  description:
    'Free REST API for Unix timestamp conversion. Returns ISO 8601, RFC 2822, relative time, timezone-aware output. 100 requests/hour. No API key required.',
  alternates: {
    canonical: 'https://unixcalculator.com/tools/timestamp-api',
  },
}

export default function Page() {
  return <TimestampApiClient />
}
