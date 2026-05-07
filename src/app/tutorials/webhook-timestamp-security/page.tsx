import type { Metadata } from 'next'
import WebhookTimestampSecurityClient from './WebhookTimestampSecurityClient'

export const metadata: Metadata = {
  title: 'Webhook Timestamp Security — HMAC, Replay & Clock Skew',
  description:
    'Verify signatures with timestamps, prevent replay attacks, and handle SDK clock drift for Stripe-style webhooks.',
  alternates: { canonical: 'https://unixcalculator.com/tutorials/webhook-timestamp-security' },
}

export default function Page() {
  return <WebhookTimestampSecurityClient />
}
