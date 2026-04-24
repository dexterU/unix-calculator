import type { Metadata } from 'next'
import CachingStrategiesTimestampsClient from './CachingStrategiesTimestampsClient'

export const metadata: Metadata = {
  title: 'Caching Strategies Time Sensitive Data | Unix Calculator',
  description: 'Caching Strategies Time Sensitive Data — Unix Calculator',
}

export default function Page() {
  return <CachingStrategiesTimestampsClient />
}
