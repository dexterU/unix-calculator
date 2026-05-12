import type { Metadata } from 'next'
import { PHPCheatsheetClient } from './PHPCheatsheetClient'

export const metadata: Metadata = {
  title: 'PHP Unix Timestamps Cheatsheet — Free PDF Download',
  description:
    'Complete PHP timestamp reference. time(), date(), strtotime(), DateTime, DateTimeImmutable, timezone handling. Free printable cheatsheet.',
  alternates: { canonical: 'https://www.unixcalculator.com/cheatsheets/php' },
}

export default function Page() {
  return <PHPCheatsheetClient />
}
