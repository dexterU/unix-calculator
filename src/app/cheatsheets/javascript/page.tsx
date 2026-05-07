import type { Metadata } from 'next'
import { JavaScriptCheatsheetClient } from './JavaScriptCheatsheetClient'

export const metadata: Metadata = {
  title: 'JavaScript Unix Timestamps Cheatsheet — Free PDF Download',
  description:
    'Complete JavaScript timestamp reference. Date.now(), new Date(), Intl.DateTimeFormat, common mistakes, and code snippets. Free printable cheatsheet.',
  alternates: { canonical: 'https://unixcalculator.com/cheatsheets/javascript' },
}

export default function Page() {
  return <JavaScriptCheatsheetClient />
}
