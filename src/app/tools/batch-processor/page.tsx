import type { Metadata } from 'next'
import BatchProcessorClient from './BatchProcessorClient'

export const metadata: Metadata = {
  title: 'Batch Timestamp Processor — Convert Multiple Timestamps',
  description:
    'Convert hundreds of Unix timestamps at once. Paste one per line, get UTC ISO strings back instantly. Free batch timestamp converter.',
  alternates: { canonical: 'https://unixcalculator.com/tools/batch-processor' },
}

export default function Page() {
  return <BatchProcessorClient />
}
