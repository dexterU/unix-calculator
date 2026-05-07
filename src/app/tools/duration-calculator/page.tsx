import type { Metadata } from 'next'
import DurationCalculatorClient from './DurationCalculatorClient'

export const metadata: Metadata = {
  title: 'Duration Calculator — Time Between Two Timestamps',
  description:
    'Calculate the exact duration between two Unix timestamps. Shows days, hours, minutes, and seconds. Free time duration calculator.',
  alternates: { canonical: 'https://unixcalculator.com/tools/duration-calculator' },
}

export default function Page() {
  return <DurationCalculatorClient />
}
