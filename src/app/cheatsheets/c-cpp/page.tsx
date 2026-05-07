import type { Metadata } from 'next'
import { CCppCheatsheetClient } from './CCppCheatsheetClient'

export const metadata: Metadata = {
  title: 'C/C++ Unix Timestamps Cheatsheet — Free PDF Download',
  description:
    'Complete C and C++ timestamp reference. time(), clock_gettime(), strftime(), struct tm, difftime(). Free printable cheatsheet.',
  alternates: { canonical: 'https://unixcalculator.com/cheatsheets/c-cpp' },
}

export default function Page() {
  return <CCppCheatsheetClient />
}
