import type { Metadata } from 'next'
import TermsOfServiceClient from './TermsOfServiceClient'

export const metadata: Metadata = {
  title: 'Terms of Service — Unix Calculator',
  description: 'Terms and conditions for using Unix Calculator tools and services.',
  alternates: { canonical: 'https://unixcalculator.com/terms-of-service' },
}

export default function Page() {
  return <TermsOfServiceClient />
}
