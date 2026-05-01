import type { Metadata } from 'next'
import CachingStrategiesTimestampsClient from './CachingStrategiesTimestampsClient'

export const metadata: Metadata = {
  title: 'Caching strategies for time-sensitive data | Unix Calculator',
  description:
    'TTL, stale-while-revalidate, and using Unix timestamps for cache expiry and invalidation in production systems.',
}

export default function Page() {
  return <CachingStrategiesTimestampsClient />
}
