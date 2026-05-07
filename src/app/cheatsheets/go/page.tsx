import type { Metadata } from 'next'
import { GoCheatsheetClient } from './GoCheatsheetClient'

export const metadata: Metadata = {
  title: 'Go Unix Timestamps Cheatsheet — Free PDF Download',
  description:
    'Complete Go timestamp reference. time.Now(), Unix(), UnixNano(), time.Parse(), LoadLocation(), and common patterns. Free printable cheatsheet.',
  alternates: { canonical: 'https://unixcalculator.com/cheatsheets/go' },
}

export default function Page() {
  return <GoCheatsheetClient />
}
