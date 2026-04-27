import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'Unix Calculator — Timestamp Converter & BC Calculator',
  description: 'Free Unix timestamp converter and BC calculator.',
  alternates: { canonical: 'https://unixcalculator.com' },
}

export default function HomePage() {
  return <HomePageClient />
}
