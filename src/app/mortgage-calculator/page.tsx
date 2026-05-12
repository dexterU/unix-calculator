import type { Metadata } from 'next'
import MortgageCalculatorClient from './MortgageCalculatorClient'

export const metadata: Metadata = {
  title: 'Mortgage Calculator — Monthly Payment Calculator',
  description:
    'Calculate monthly mortgage payments, total interest, and amortization schedule. Includes principal, interest, taxes, and insurance (PITI).',
  alternates: { canonical: 'https://www.unixcalculator.com/mortgage-calculator' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MortgageCalculatorClient />
}
