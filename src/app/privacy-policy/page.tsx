import type { Metadata } from 'next'
import PrivacyPolicyClient from './PrivacyPolicyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy | Unix Calculator',
  description: 'Privacy Policy — Unix Calculator',
}

export default function Page() {
  return <PrivacyPolicyClient />
}
