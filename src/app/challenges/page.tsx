import type { Metadata } from 'next'
import ChallengesClient from './ChallengesClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Challenges — Test Your Knowledge (25 Questions)',
  description:
    '25 interactive Unix timestamp challenges across Easy, Medium, and Hard difficulty. Test your knowledge of epoch time, DST, Y2038, and precision.',
  alternates: { canonical: 'https://unixcalculator.com/challenges' },
}

export default function Page() {
  return <ChallengesClient />
}
