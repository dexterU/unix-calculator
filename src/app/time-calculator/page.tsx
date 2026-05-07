import type { Metadata } from 'next'
import TimeCalculatorClient from './TimeCalculatorClient'

export const metadata: Metadata = {
  title: 'Time Calculator — Add, Subtract, Convert Time',
  description:
    'Calculate time differences, add or subtract hours, minutes, and seconds. Convert between time formats. Free online time calculator.',
  alternates: { canonical: 'https://unixcalculator.com/time-calculator' },
}

export default function Page() {
  return <TimeCalculatorClient />
}
