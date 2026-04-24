import type { Metadata } from 'next'
import AgeCalculatorClient from './AgeCalculatorClient'

export const metadata: Metadata = {
  title: 'Age Calculator | Unix Calculator',
  description: 'Age Calculator — Unix Calculator',
}

export default function Page() {
  return <AgeCalculatorClient />
}
