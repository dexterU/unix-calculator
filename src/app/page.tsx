import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'Unix Calculator - Advanced BC Command Calculator & Math Toolkit',
  description:
    'Professional Unix calculator with BC command syntax, AWK math operations, bash arithmetic. Interactive tutorials, examples, and comprehensive reference guide for developers.',
}

export default function Page() {
  return <HomePageClient />
}
