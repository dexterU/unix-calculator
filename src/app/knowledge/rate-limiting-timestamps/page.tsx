import type { Metadata } from 'next'
import RateLimitingTimestampsClient from './RateLimitingTimestampsClient'

export const metadata: Metadata = {
  title: 'Rate Limiting Timestamps | Unix Calculator',
  description: 'Rate Limiting Timestamps — Unix Calculator',
}

export default function Page() {
  return <RateLimitingTimestampsClient />
}
