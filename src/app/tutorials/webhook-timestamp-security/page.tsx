import type { Metadata } from 'next'
import WebhookTimestampSecurityClient from './WebhookTimestampSecurityClient'

export const metadata: Metadata = {
  title: 'Webhook Timestamp Security | Unix Calculator',
  description: 'Webhook Timestamp Security — Unix Calculator',
}

export default function Page() {
  return <WebhookTimestampSecurityClient />
}
