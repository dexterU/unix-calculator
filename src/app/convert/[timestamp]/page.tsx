import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TimestampConvertPageClient } from './TimestampConvertPageClient'

interface Props {
  params: { timestamp: string }
}

function detectFormat(ts: number): 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds' | 'unknown' {
  const digits = Math.abs(ts)
    .toString()
    .replace('.', '')
    .length
  if (digits <= 10) return 'seconds'
  if (digits <= 13) return 'milliseconds'
  if (digits <= 16) return 'microseconds'
  if (digits <= 19) return 'nanoseconds'
  return 'unknown'
}

function toSeconds(ts: number, fmt: string): number {
  if (fmt === 'seconds') return ts
  if (fmt === 'milliseconds') return ts / 1000
  if (fmt === 'microseconds') return ts / 1_000_000
  if (fmt === 'nanoseconds') return ts / 1_000_000_000
  return ts
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = parseFloat(params.timestamp)
  if (Number.isNaN(raw)) {
    return { title: 'Invalid Timestamp' }
  }

  const fmt = detectFormat(raw)
  if (fmt === 'unknown') {
    return { title: 'Invalid Timestamp' }
  }

  const seconds = toSeconds(raw, fmt)
  const date = new Date(seconds * 1000)

  const shortDate = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)

  const iso = date.toISOString()
  const tsDisplay = params.timestamp

  return {
    title: `${tsDisplay} = ${shortDate} UTC | Unix Timestamp`,
    description: `Unix timestamp ${tsDisplay} converts to ${shortDate} UTC. ISO 8601: ${iso}. Instant free conversion with timezone breakdown.`,
    alternates: {
      canonical: `https://www.unixcalculator.com/convert/${tsDisplay}`,
    },
    openGraph: {
      title: `${tsDisplay} → ${shortDate} UTC`,
      description: `Convert Unix timestamp ${tsDisplay} to date and time.`,
    },
  }
}

export async function generateStaticParams() {
  const popular = [
    '0',
    '946684800',
    '2147483647',
    '1000000000',
    '1500000000',
    '1700000000',
    '1750000000',
    '1764581115',
    '1733529600',
    '1704067200',
    '1735689600',
    '1767225600',
    '1764581115000',
    '1733529600000',
    '1704067200000',
  ]
  return popular.map((ts) => ({ timestamp: ts }))
}

export default function ConvertPage({ params }: Props) {
  const raw = parseFloat(params.timestamp)

  if (Number.isNaN(raw)) notFound()

  const fmt = detectFormat(raw)
  if (fmt === 'unknown') notFound()

  return <TimestampConvertPageClient timestamp={params.timestamp} />
}
