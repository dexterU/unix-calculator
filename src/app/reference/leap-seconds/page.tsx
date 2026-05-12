import type { Metadata } from 'next'
import LeapSecondsClient from './LeapSecondsClient'

export const metadata: Metadata = {
  title: 'Leap Seconds & Unix Time — Reference',
  description:
    'How leap seconds interact with Unix time, UTC, and POSIX. Practical notes for logs, APIs, and distributed systems.',
  alternates: { canonical: 'https://www.unixcalculator.com/reference/leap-seconds' },
}

export default function Page() {
  return <LeapSecondsClient />
}
