import type { Metadata } from 'next'
import TimestampConverterPageClient from './TimestampConverterPageClient'

export const metadata: Metadata = {
  title: 'Timestamp Converter | Unix Calculator',
  description:
    'Convert between Unix epoch seconds and human-readable UTC/local datetime.',
}

export default function Page() {
  return <TimestampConverterPageClient />
}
