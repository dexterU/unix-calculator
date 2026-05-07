import type { Metadata } from 'next'
import CompoundInterestCalculatorClient from './CompoundInterestCalculatorClient'

export const metadata: Metadata = {
  title: 'Compound Interest Calculator — Investment Growth Calculator',
  description:
    'Calculate compound interest and investment growth over time. Shows final amount, total interest earned, and year-by-year breakdown.',
  alternates: { canonical: 'https://unixcalculator.com/compound-interest' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CompoundInterestCalculatorClient />
}
