import type { Metadata } from 'next'
import IntegralCalculatorClient from './IntegralCalculatorClient'

export const metadata: Metadata = {
  title: 'Integral Calculator — Definite & Indefinite Integration',
  description:
    'Calculate definite and indefinite integrals. Supports polynomials, trigonometric, and exponential functions with step-by-step results.',
  alternates: { canonical: 'https://www.unixcalculator.com/integral-calculator' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <IntegralCalculatorClient />
}
