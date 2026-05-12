import type { Metadata } from 'next'
import LogParserClient from './LogParserClient'

export const metadata: Metadata = {
  title: 'Log Parser — Extract & Convert Timestamps from Logs',
  description:
    'Parse timestamps from nginx, Apache, syslog, and application logs. Auto-detects format and normalizes to UTC. Free log timestamp parser.',
  alternates: { canonical: 'https://www.unixcalculator.com/tools/log-parser' },
}

export default function Page() {
  return <LogParserClient />
}
