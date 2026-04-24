import type { Metadata } from 'next'
import KnowledgeBaseClient from './KnowledgeBaseClient'

export const metadata: Metadata = {
  title: 'Knowledge | Unix Calculator',
  description: 'Knowledge — Unix Calculator',
}

export default function Page() {
  return <KnowledgeBaseClient />
}
