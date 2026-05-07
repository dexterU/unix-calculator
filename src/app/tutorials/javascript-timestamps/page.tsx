import type { Metadata } from 'next'
import JavaScriptTimestampsClient from './JavaScriptTimestampsClient'

export const metadata: Metadata = {
  title: 'JavaScript Unix Timestamps — Date, UTC & Common Bugs',
  description:
    'Date.now vs Date.parse, 0-indexed months, ms vs seconds, Temporal, and safe patterns for APIs and browsers.',
  alternates: { canonical: 'https://unixcalculator.com/tutorials/javascript-timestamps' },
}

export default function Page() {
  return <JavaScriptTimestampsClient />
}
