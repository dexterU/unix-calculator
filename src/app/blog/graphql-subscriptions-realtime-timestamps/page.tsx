import type { Metadata } from 'next'
import GraphqlTimestampsClient from './GraphqlTimestampsClient'

export const metadata: Metadata = {
  title: 'GraphQL subscriptions & real-time timestamps | Unix Calculator',
  description:
    'Scalars, ordering, and clock skew for GraphQL subscriptions and WebSocket payloads using epoch conventions.',
  alternates: {
    canonical: 'https://www.unixcalculator.com/blog/graphql-subscriptions-realtime-timestamps',
  },
}

export default function Page() {
  return <GraphqlTimestampsClient />
}
