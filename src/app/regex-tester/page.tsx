import type { Metadata } from 'next'
import RegexTesterClient from './RegexTesterClient'

export const metadata: Metadata = {
  title: 'Regex Tester | Unix Calculator',
  description: 'Regex Tester — Unix Calculator',
}

export default function Page() {
  return <RegexTesterClient />
}
