import type { Metadata } from 'next'
import BatchProcessorClient from './BatchProcessorClient'

export const metadata: Metadata = {
  title: 'Batch Processor | Unix Calculator',
  description: 'Batch Processor — Unix Calculator',
}

export default function Page() {
  return <BatchProcessorClient />
}
