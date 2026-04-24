import type { Metadata } from 'next'
import TimeCalculatorClient from './TimeCalculatorClient'

export const metadata: Metadata = {
  title: 'Time Calculator | Unix Calculator',
  description: 'Time Calculator — Unix Calculator',
}

export default function Page() {
  return <TimeCalculatorClient />
}
