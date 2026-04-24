import type { Metadata } from 'next'
import MatrixCalculatorClient from './MatrixCalculatorClient'

export const metadata: Metadata = {
  title: 'Matrix Calculator | Unix Calculator',
  description: 'Matrix Calculator — Unix Calculator',
}

export default function Page() {
  return <MatrixCalculatorClient />
}
