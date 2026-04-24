import type { Metadata } from 'next'
import ReferenceHubClient from './ReferenceHubClient'

export const metadata: Metadata = {
  title: 'Reference | Unix Calculator',
  description: 'Reference — Unix Calculator',
}

export default function Page() {
  return <ReferenceHubClient />
}
