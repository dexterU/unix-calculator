import type { Metadata } from 'next'
import RateLimitingAlgorithmsClient from './RateLimitingAlgorithmsClient'

export const metadata: Metadata = {
  title: 'Rate Limiting Timestamp Algorithms | Unix Calculator',
  description: 'Rate Limiting Timestamp Algorithms — Unix Calculator',
}

export default function Page() {
  return <RateLimitingAlgorithmsClient />
}
