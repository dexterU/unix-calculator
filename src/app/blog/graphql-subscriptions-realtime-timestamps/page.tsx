import type { Metadata } from 'next'
import GraphqlTimestampsClient from './GraphqlTimestampsClient'

export const metadata: Metadata = {
  title: 'GraphQL subscriptions & real-time timestamps | Unix Calculator',
  description:
    'Scalars, ordering, and clock skew for GraphQL subscriptions and WebSocket payloads using epoch conventions.',
}

export default function Page() {
  return <GraphqlTimestampsClient />
}
