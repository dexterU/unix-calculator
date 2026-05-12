import type { Metadata } from 'next'
import CaseStudiesClient from './CaseStudiesClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Case Studies — Production Incidents',
  description:
    'Real-world stories of DST bugs, leap seconds, Y2038 prep, and migration mistakes — and how teams fixed them.',
  alternates: { canonical: 'https://www.unixcalculator.com/case-studies' },
}

export default function Page() {
  return <CaseStudiesClient />
}
