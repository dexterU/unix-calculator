import type { Metadata } from 'next'
import DerivativeCalculatorClient from './DerivativeCalculatorClient'

export const metadata: Metadata = {
  title: 'Derivative Calculator | Unix Calculator',
  description: 'Derivative Calculator — Unix Calculator',
}

export default function Page() {
  return <DerivativeCalculatorClient />
}
