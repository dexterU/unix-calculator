import type { Metadata } from 'next'
import ElasticsearchTimestampIndexingClient from './ElasticsearchTimestampIndexingClient'

export const metadata: Metadata = {
  title: 'Elasticsearch Timestamp Indexing — date Fields & Formats',
  description:
    'Map epoch millis, strict_date_optional_time, and @timestamp best practices for search and aggregations.',
  alternates: { canonical: 'https://unixcalculator.com/tutorials/elasticsearch-timestamp-indexing' },
}

export default function Page() {
  return <ElasticsearchTimestampIndexingClient />
}
