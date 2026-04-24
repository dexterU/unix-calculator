import type { Metadata } from 'next'
import TutorialSeriesClient from './TutorialSeriesClient'

export const metadata: Metadata = {
  title: 'Tutorials | Unix Calculator',
  description: 'Tutorials — Unix Calculator',
}

export default function Page() {
  return <TutorialSeriesClient />
}
