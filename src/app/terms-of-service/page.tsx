import type { Metadata } from 'next'
import TermsOfServiceClient from './TermsOfServiceClient'

export const metadata: Metadata = {
  title: 'Terms Of Service | Unix Calculator',
  description: 'Terms Of Service — Unix Calculator',
}

export default function Page() {
  return <TermsOfServiceClient />
}
