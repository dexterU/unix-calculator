import type { Metadata } from 'next'
import { PostgreSQLCheatsheetClient } from './PostgreSQLCheatsheetClient'

export const metadata: Metadata = {
  title: 'PostgreSQL Timestamps Cheatsheet — Free PDF Download',
  description:
    'Complete PostgreSQL timestamp reference. TIMESTAMPTZ, NOW(), to_timestamp(), EXTRACT(), AT TIME ZONE, date_trunc(). Free printable cheatsheet.',
  alternates: { canonical: 'https://unixcalculator.com/cheatsheets/postgresql' },
}

export default function Page() {
  return <PostgreSQLCheatsheetClient />
}
