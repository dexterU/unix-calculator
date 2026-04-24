import type { Metadata } from 'next'
import GradeCalculatorClient from './GradeCalculatorClient'

export const metadata: Metadata = {
  title: 'Grade Calculator | Unix Calculator',
  description: 'Grade Calculator — Unix Calculator',
}

export default function Page() {
  return <GradeCalculatorClient />
}
