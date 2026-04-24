import type { Metadata } from 'next'
import CalorieCalculatorClient from './CalorieCalculatorClient'

export const metadata: Metadata = {
  title: 'Calorie Calculator | Unix Calculator',
  description: 'Calorie Calculator — Unix Calculator',
}

export default function Page() {
  return <CalorieCalculatorClient />
}
