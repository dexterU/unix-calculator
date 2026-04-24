import type { Metadata } from 'next'
import CompoundInterestCalculatorClient from './CompoundInterestCalculatorClient'

export const metadata: Metadata = {
  title: 'Compound Interest | Unix Calculator',
  description: 'Compound Interest — Unix Calculator',
}

export default function Page() {
  return <CompoundInterestCalculatorClient />
}
