import type { Metadata } from 'next'
import MortgageCalculatorClient from './MortgageCalculatorClient'

export const metadata: Metadata = {
  title: 'Mortgage Calculator | Unix Calculator',
  description: 'Mortgage Calculator — Unix Calculator',
}

export default function Page() {
  return <MortgageCalculatorClient />
}
