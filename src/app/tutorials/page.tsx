import type { Metadata } from 'next'
import TutorialSeriesClient from './TutorialSeriesClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Tutorials — Step-by-Step Developer Guides',
  description:
    'Step-by-step tutorials for JavaScript, Python, Go, and more. Learn timestamp handling, webhook security, caching, and monitoring patterns.',
  alternates: { canonical: 'https://unixcalculator.com/tutorials' },
}

export default function Page() {
  return <TutorialSeriesClient />
}
