import type { Metadata } from 'next'
import TimestampPrecision2025Client from './TimestampPrecision2025Client'

export const metadata: Metadata = {
  title: 'Unix timestamp precision — complete guide | Unix Calculator',
  description:
    'Seconds vs milliseconds, JavaScript pitfalls, POSIX time, and Y2038 — practical precision guide for APIs.',
  alternates: {
    canonical: 'https://unixcalculator.com/blog/complete-guide-unix-timestamp-precision-2025',
  },
}

export default function Page() {
  return <TimestampPrecision2025Client />
}
