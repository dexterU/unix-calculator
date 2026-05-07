import type { Metadata } from 'next'
import KnowledgeBaseClient from './KnowledgeBaseClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Knowledge Base — Developer Reference',
  description:
    'Deep reference articles on Unix timestamps in C/C++, Go, GraphQL, log analysis, and rate limiting. Technical knowledge base for engineers.',
  alternates: { canonical: 'https://unixcalculator.com/knowledge' },
}

export default function Page() {
  return <KnowledgeBaseClient />
}
