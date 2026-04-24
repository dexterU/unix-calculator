import type { Metadata } from 'next'
import BMICalculatorClient from './BMICalculatorClient'

export const metadata: Metadata = {
  title: 'Bmi Calculator | Unix Calculator',
  description: 'Bmi Calculator — Unix Calculator',
}

export default function Page() {
  return <BMICalculatorClient />
}
