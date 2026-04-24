import type { Metadata } from 'next'
import ElasticsearchTimestampIndexingClient from './ElasticsearchTimestampIndexingClient'

export const metadata: Metadata = {
  title: 'Elasticsearch Timestamp Indexing | Unix Calculator',
  description: 'Elasticsearch Timestamp Indexing — Unix Calculator',
}

export default function Page() {
  return <ElasticsearchTimestampIndexingClient />
}
