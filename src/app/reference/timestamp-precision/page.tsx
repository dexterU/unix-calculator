import type { Metadata } from 'next'
import TimestampPrecisionClient from './TimestampPrecisionClient'

export const metadata: Metadata = {
  title: 'Timestamp Precision | Unix Calculator',
  description: 'Timestamp Precision — Unix Calculator',
}

export default function Page() {
  return <TimestampPrecisionClient />
}
