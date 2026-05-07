import type { Metadata } from 'next'
import PercentageCalculatorClient from './PercentageCalculatorClient'

export const metadata: Metadata = {
  title: 'Percentage Calculator — Calculate Percentages Instantly',
  description:
    'Calculate percentages, percentage change, and percentage of a number. Includes BC command equivalent for terminal users.',
  alternates: { canonical: 'https://unixcalculator.com/percentage-calculator' },
}

export default function Page() {
  return <PercentageCalculatorClient />
}
