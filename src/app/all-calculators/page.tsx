import type { Metadata } from 'next'
import AllCalculatorsClient from './AllCalculatorsClient'

export const metadata: Metadata = {
  title: 'All Calculators & Developer Tools — Unix Calculator',
  description:
    'Browse all 25+ free calculators and developer tools. Timestamp converter, cron generator, BMI, mortgage, binary converter, and more.',
  alternates: { canonical: 'https://unixcalculator.com/all-calculators' },
}

export default function Page() {
  return <AllCalculatorsClient />
}
