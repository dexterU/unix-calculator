import type { Metadata } from 'next'
import TimestampPrecisionClient from './TimestampPrecisionClient'

export const metadata: Metadata = {
  title: 'Timestamp Precision — Nanoseconds to Seconds Reference',
  description:
    'Millisecond vs microsecond vs nanosecond storage, JSON doubles, and safe integer limits across languages and databases.',
  alternates: { canonical: 'https://unixcalculator.com/reference/timestamp-precision' },
}

export default function Page() {
  return <TimestampPrecisionClient />
}
