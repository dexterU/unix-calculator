import type { Metadata } from 'next'
import RegexTesterClient from './RegexTesterClient'

export const metadata: Metadata = {
  title: 'Regex Tester — Test Regular Expressions Online',
  description:
    'Test and debug regular expressions online. Real-time regex matching with match highlighting, groups, and flags. Free online regex tester.',
  alternates: { canonical: 'https://unixcalculator.com/regex-tester' },
}

export default function Page() {
  return <RegexTesterClient />
}
