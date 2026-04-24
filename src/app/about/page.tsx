import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About | Unix Calculator',
  description: 'About — Unix Calculator',
}

export default function Page() {
  return <AboutClient />
}
