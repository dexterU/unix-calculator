import type { Metadata } from 'next'
import IntegralCalculatorClient from './IntegralCalculatorClient'

export const metadata: Metadata = {
  title: 'Integral Calculator | Unix Calculator',
  description: 'Integral Calculator — Unix Calculator',
}

export default function Page() {
  return <IntegralCalculatorClient />
}
