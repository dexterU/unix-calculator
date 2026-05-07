import type { Metadata } from 'next'
import PrivacyPolicyClient from './PrivacyPolicyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy — Unix Calculator',
  description: 'How Unix Calculator collects, uses, and protects your information.',
  alternates: { canonical: 'https://unixcalculator.com/privacy-policy' },
}

export default function Page() {
  return <PrivacyPolicyClient />
}
