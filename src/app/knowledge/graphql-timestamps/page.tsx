import type { Metadata } from 'next'
import GraphqlTimestampsClient from './GraphqlTimestampsClient'

export const metadata: Metadata = {
  title: 'GraphQL Timestamps — Scalars, Ordering & Best Practices',
  description:
    'DateTime scalars, Unix ints vs ISO strings, subscriptions ordering, and avoiding timezone ambiguity in GraphQL APIs.',
  alternates: { canonical: 'https://www.unixcalculator.com/knowledge/graphql-timestamps' },
}

export default function Page() {
  return <GraphqlTimestampsClient />
}
