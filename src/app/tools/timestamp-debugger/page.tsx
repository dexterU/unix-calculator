import type { Metadata } from 'next'
import { TimestampDebuggerClient } from './TimestampDebuggerClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Debugger — Auto-Detect Seconds, MS, µs, NS',
  description:
    'Paste any timestamp and instantly know what it means. Auto-detects seconds, milliseconds, microseconds, and nanoseconds. Shows UTC, local time, 5 timezones, and flags Y2038, 1970, and pre-epoch issues.',
  alternates: { canonical: 'https://unixcalculator.com/tools/timestamp-debugger' },
}

export default function Page() {
  return <TimestampDebuggerClient />
}
