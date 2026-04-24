import type { Metadata } from 'next'
import LoanCalculatorClient from './LoanCalculatorClient'

export const metadata: Metadata = {
  title: 'Loan Calculator | Unix Calculator',
  description: 'Loan Calculator — Unix Calculator',
}

export default function Page() {
  return <LoanCalculatorClient />
}
