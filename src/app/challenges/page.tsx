import type { Metadata } from 'next'
import ChallengesClient from './ChallengesClient'

export const metadata: Metadata = {
  title: 'Challenges | Unix Calculator',
  description: 'Challenges — Unix Calculator',
}

export default function Page() {
  return <ChallengesClient />
}
