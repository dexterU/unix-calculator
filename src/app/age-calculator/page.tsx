import type { Metadata } from 'next'
import AgeCalculatorClient from './AgeCalculatorClient'

export const metadata: Metadata = {
  title: 'Age Calculator — Calculate Exact Age in Years, Months, Days',
  description:
    'Calculate your exact age from your date of birth. Shows years, months, days, hours, and minutes. Free online age calculator.',
  alternates: { canonical: 'https://unixcalculator.com/age-calculator' },
}

export default function Page() {
  return <AgeCalculatorClient />
}
