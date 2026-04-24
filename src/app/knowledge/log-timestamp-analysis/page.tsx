import type { Metadata } from 'next'
import LogTimestampAnalysisClient from './LogTimestampAnalysisClient'

export const metadata: Metadata = {
  title: 'Log Timestamp Analysis | Unix Calculator',
  description: 'Log Timestamp Analysis — Unix Calculator',
}

export default function Page() {
  return <LogTimestampAnalysisClient />
}
