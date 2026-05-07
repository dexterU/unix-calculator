import type { Metadata } from 'next'
import TimestampConverterPageClient from './TimestampConverterPageClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter — Epoch to Date & Time Converter',
  description:
    'Convert Unix timestamps to human-readable dates instantly. Supports seconds, milliseconds, microseconds. 25+ timezones. Free epoch converter.',
  alternates: { canonical: 'https://unixcalculator.com/tools/timestamp-converter' },
}

export default function Page() {
  return <TimestampConverterPageClient />
}
