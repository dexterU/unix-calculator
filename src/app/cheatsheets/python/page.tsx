import type { Metadata } from 'next'
import { PythonCheatsheetClient } from './PythonCheatsheetClient'

export const metadata: Metadata = {
  title: 'Python Unix Timestamps Cheatsheet — Free PDF Download',
  description:
    'Complete Python timestamp reference. time module, datetime module, timezone handling, common mistakes. Free printable cheatsheet.',
  alternates: { canonical: 'https://www.unixcalculator.com/cheatsheets/python' },
}

export default function Page() {
  return <PythonCheatsheetClient />
}
