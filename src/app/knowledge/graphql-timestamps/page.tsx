import type { Metadata } from 'next'
import GraphqlTimestampsClient from './GraphqlTimestampsClient'

export const metadata: Metadata = {
  title: 'Graphql Timestamps | Unix Calculator',
  description: 'Graphql Timestamps — Unix Calculator',
}

export default function Page() {
  return <GraphqlTimestampsClient />
}
