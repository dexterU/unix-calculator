import type { Metadata } from 'next'
import ContentGeneratorClient from './ContentGeneratorClient'

export const metadata: Metadata = {
  title: 'Content Generator — Unix Calculator',
  description: 'Internal content tools for Unix Calculator editors.',
  alternates: { canonical: 'https://unixcalculator.com/content-generator' },
}

export default function Page() {
  return <ContentGeneratorClient />
}
