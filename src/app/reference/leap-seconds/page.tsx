import type { Metadata } from 'next'
import LeapSecondsClient from './LeapSecondsClient'

export const metadata: Metadata = {
  title: 'Leap Seconds | Unix Calculator',
  description: 'Leap Seconds — Unix Calculator',
}

export default function Page() {
  return <LeapSecondsClient />
}
