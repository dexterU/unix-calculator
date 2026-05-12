import type { Metadata } from 'next'
import GolangUnixTimestampsClient from './GolangUnixTimestampsClient'

export const metadata: Metadata = {
  title: 'Go Unix Timestamps — time.Time, Unix(), UnixNano Reference',
  description:
    'Working with time in Go: Unix seconds, UnixMilli, UnixNano, monotonic clocks, and int64 overflow at extreme dates.',
  alternates: { canonical: 'https://www.unixcalculator.com/knowledge/golang-unix-timestamps' },
}

export default function Page() {
  return <GolangUnixTimestampsClient />
}
