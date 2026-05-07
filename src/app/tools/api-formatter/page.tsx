import type { Metadata } from 'next'
import ApiFormatterClient from './ApiFormatterClient'

export const metadata: Metadata = {
  title: 'API Timestamp Formatter — ISO 8601, RFC 3339, Unix',
  description:
    'Format timestamps for REST APIs, GraphQL, and webhooks. Convert between ISO 8601, RFC 3339, RFC 2822, and Unix timestamp formats.',
  alternates: { canonical: 'https://unixcalculator.com/tools/api-formatter' },
}

export default function Page() {
  return <ApiFormatterClient />
}
