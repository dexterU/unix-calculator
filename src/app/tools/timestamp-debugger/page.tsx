import type { Metadata } from 'next'
import { TimestampDebuggerClient } from './TimestampDebuggerClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Debugger — Auto-Detect Any Timestamp Format',
  description:
    'Paste any number and instantly know if it is seconds, milliseconds, microseconds, or nanoseconds. Flags Y2038, 1970 errors, and timezone breakdowns.',
  alternates: { canonical: 'https://www.unixcalculator.com/tools/timestamp-debugger' },
}

export default function Page() {
  return <TimestampDebuggerClient />
}
