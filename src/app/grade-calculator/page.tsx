import type { Metadata } from 'next'
import GradeCalculatorClient from './GradeCalculatorClient'

export const metadata: Metadata = {
  title: 'Grade Calculator — Weighted GPA & Grade Average Calculator',
  description:
    'Calculate weighted grade averages and GPA instantly. Enter scores and weights to get your final grade. Free online grade calculator.',
  alternates: { canonical: 'https://unixcalculator.com/grade-calculator' },
}

export default function Page() {
  return <GradeCalculatorClient />
}
