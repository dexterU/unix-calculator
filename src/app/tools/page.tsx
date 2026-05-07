import type { Metadata } from 'next'
import ToolsHubClient from './ToolsHubClient'

export const metadata: Metadata = {
  title: 'Developer Tools Hub — Unix & Timestamp Tools',
  description:
    'Free developer tools: Unix timestamp converter, timezone converter, cron generator, log parser, regex tester, and more. Built for engineers.',
  alternates: { canonical: 'https://unixcalculator.com/tools' },
}

export default function Page() {
  return <ToolsHubClient />
}
