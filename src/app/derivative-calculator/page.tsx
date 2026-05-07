import type { Metadata } from 'next'
import DerivativeCalculatorClient from './DerivativeCalculatorClient'

export const metadata: Metadata = {
  title: 'Derivative Calculator — Calculus Differentiation Tool',
  description:
    'Calculate derivatives of mathematical functions. Supports polynomials, trigonometric, exponential, and logarithmic functions.',
  alternates: { canonical: 'https://unixcalculator.com/derivative-calculator' },
}

export default function Page() {
  return <DerivativeCalculatorClient />
}
