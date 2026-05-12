import type { Metadata } from 'next'
import RateLimitingTimestampsClient from './RateLimitingTimestampsClient'

export const metadata: Metadata = {
  title: 'Rate Limiting with Timestamps — Windows, Tokens & Redis',
  description:
    'Fixed vs sliding windows, leaky buckets, and using monotonic vs wall clocks safely in rate limiters.',
  alternates: { canonical: 'https://www.unixcalculator.com/knowledge/rate-limiting-timestamps' },
}

export default function Page() {
  return <RateLimitingTimestampsClient />
}
