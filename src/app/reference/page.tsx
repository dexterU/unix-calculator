import type { Metadata } from 'next'
import ReferenceHubClient from './ReferenceHubClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Reference Hub — Formats, Precision, Leap Seconds',
  description:
    'Complete reference for Unix timestamp formats, precision levels, leap seconds, and the Y2038 problem. Developer reference documentation.',
  alternates: { canonical: 'https://unixcalculator.com/reference' },
}

export default function Page() {
  return <ReferenceHubClient />
}
