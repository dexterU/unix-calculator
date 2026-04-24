import type { Metadata } from 'next'
import GraphqlTimestampsClient from './GraphqlTimestampsClient'

export const metadata: Metadata = {
  title: 'Graphql Subscriptions Realtime Timestamps | Unix Calculator',
  description: 'Graphql Subscriptions Realtime Timestamps — Unix Calculator',
}

export default function Page() {
  return <GraphqlTimestampsClient />
}
