import type { Metadata } from 'next'
import PercentageCalculatorClient from './PercentageCalculatorClient'

export const metadata: Metadata = {
  title: 'Percentage Calculator | Unix Calculator',
  description: 'Percentage Calculator — Unix Calculator',
}

export default function Page() {
  return <PercentageCalculatorClient />
}
