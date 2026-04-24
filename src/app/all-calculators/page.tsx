import type { Metadata } from 'next'
import AllCalculatorsClient from './AllCalculatorsClient'

export const metadata: Metadata = {
  title: 'All Calculators | Unix Calculator',
  description: 'All Calculators — Unix Calculator',
}

export default function Page() {
  return <AllCalculatorsClient />
}
