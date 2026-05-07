import type { Metadata } from 'next'
import RateLimitingAlgorithmsClient from './RateLimitingAlgorithmsClient'

export const metadata: Metadata = {
  title: 'Rate Limiting Timestamp Algorithms — Sliding Windows Tutorial',
  description:
    'Implement token bucket and sliding window limiters with Redis sorted sets and accurate TTL math.',
  alternates: { canonical: 'https://unixcalculator.com/tutorials/rate-limiting-timestamp-algorithms' },
}

export default function Page() {
  return <RateLimitingAlgorithmsClient />
}
