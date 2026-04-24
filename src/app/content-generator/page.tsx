import type { Metadata } from 'next'
import ContentGeneratorClient from './ContentGeneratorClient'

export const metadata: Metadata = {
  title: 'Content Generator | Unix Calculator',
  description: 'Content generator — Unix Calculator',
}

export default function Page() {
  return <ContentGeneratorClient />
}
