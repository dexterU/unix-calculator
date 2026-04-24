import type { Metadata } from 'next'
import DurationCalculatorClient from './DurationCalculatorClient'

export const metadata: Metadata = {
  title: 'Duration Calculator | Unix Calculator',
  description: 'Duration Calculator — Unix Calculator',
}

export default function Page() {
  return <DurationCalculatorClient />
}
