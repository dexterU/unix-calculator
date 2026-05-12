import type { Metadata } from 'next'
import LoanCalculatorClient from './LoanCalculatorClient'

export const metadata: Metadata = {
  title: 'Loan Calculator — Monthly Payment & Interest Calculator',
  description:
    'Calculate loan payments, total interest, and payoff schedule. Works for personal loans, auto loans, and student loans.',
  alternates: { canonical: 'https://www.unixcalculator.com/loan-calculator' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <LoanCalculatorClient />
}
