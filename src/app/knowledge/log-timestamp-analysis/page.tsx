import type { Metadata } from 'next'
import LogTimestampAnalysisClient from './LogTimestampAnalysisClient'

export const metadata: Metadata = {
  title: 'Log Timestamp Analysis — Parse, Normalize & Correlate',
  description:
    'Extract epochs from nginx, Apache, syslog, and JSON logs; handle fractional seconds, offsets, and DST ambiguities.',
  alternates: { canonical: 'https://unixcalculator.com/knowledge/log-timestamp-analysis' },
}

export default function Page() {
  return <LogTimestampAnalysisClient />
}
