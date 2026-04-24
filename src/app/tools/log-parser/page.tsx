import type { Metadata } from 'next'
import LogParserClient from './LogParserClient'

export const metadata: Metadata = {
  title: 'Log Parser | Unix Calculator',
  description: 'Log Parser — Unix Calculator',
}

export default function Page() {
  return <LogParserClient />
}
