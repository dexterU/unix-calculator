'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { AdUnit } from '@/components/AdUnit'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'
import { ArrowLeft, Copy, Globe, AlertTriangle } from 'lucide-react'

interface Props {
  timestamp: string
}

function detectFormat(ts: number) {
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

function toSeconds(ts: number, fmt: string) {
  if (fmt === 'seconds') return ts
  if (fmt === 'milliseconds') return ts / 1000
  if (fmt === 'microseconds') return ts / 1_000_000
  if (fmt === 'nanoseconds') return ts / 1_000_000_000
  return ts
}

const TIMEZONES = [
  { label: 'UTC', tz: 'UTC' },
  { label: 'US Eastern', tz: 'America/New_York' },
  { label: 'US Pacific', tz: 'America/Los_Angeles' },
  { label: 'UK London', tz: 'Europe/London' },
  { label: 'Japan Tokyo', tz: 'Asia/Tokyo' },
  { label: 'Australia Sydney', tz: 'Australia/Sydney' },
]

function digitCountParam(ts: string) {
  return ts.replace(/-/g, '').replace(/\./g, '').length
}

export function TimestampConvertPageClient({ timestamp }: Props) {
  const raw = parseFloat(timestamp)
  const fmt = detectFormat(raw)
  const seconds = toSeconds(raw, fmt)
  const date = new Date(seconds * 1000)

  const iso = date.toISOString()
  const rfc = date.toUTCString()

  const humanUTC = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(date)

  const shortUTC = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(Math.abs(diffMs) / 1000)
  const isPast = diffMs > 0
  let relative = ''
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffYear = Math.floor(diffDay / 365)
  if (diffYear > 0) relative = `${diffYear} year${diffYear > 1 ? 's' : ''}`
  else if (diffDay > 0) relative = `${diffDay} day${diffDay > 1 ? 's' : ''}`
  else if (diffHr > 0) relative = `${diffHr} hour${diffHr > 1 ? 's' : ''}`
  else if (diffMin > 0) relative = `${diffMin} minute${diffMin > 1 ? 's' : ''}`
  else relative = `${diffSec} second${diffSec > 1 ? 's' : ''}`
  const relativeStr = isPast ? `${relative} ago` : `in ${relative}`

  const warnings: { type: string; msg: string }[] = []
  if (date.getUTCFullYear() === 1970 && Math.abs(raw) > 1000 && fmt === 'seconds') {
    warnings.push({
      type: 'error',
      msg: 'This timestamp resolves near 1970 — you may have passed seconds to a milliseconds function.',
    })
  }
  if (seconds > 2147483647) {
    warnings.push({
      type: 'warning',
      msg: 'Exceeds Y2038 limit (2,147,483,647). Will overflow 32-bit integer fields.',
    })
  }
  if (raw < 0) {
    warnings.push({
      type: 'info',
      msg: 'Negative timestamp — represents a date before January 1, 1970 UTC.',
    })
  }

  const outputs = [
    { label: 'ISO 8601', value: iso },
    { label: 'RFC 2822', value: rfc },
    { label: 'Human Readable', value: humanUTC },
    { label: 'Unix Seconds', value: Math.floor(seconds).toString() },
    { label: 'Unix Milliseconds', value: Math.floor(seconds * 1000).toString() },
    {
      label: 'Day of Week',
      value: new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(date),
    },
  ]

  const base = Math.floor(seconds)
  const related = [
    { label: '1 hour earlier', ts: base - 3600 },
    { label: '1 day earlier', ts: base - 86400 },
    { label: '1 week earlier', ts: base - 604800 },
    { label: '1 hour later', ts: base + 3600 },
    { label: '1 day later', ts: base + 86400 },
    { label: '1 week later', ts: base + 604800 },
  ]

  const tsDigits = digitCountParam(timestamp)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What date is Unix timestamp ${timestamp}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Unix timestamp ${timestamp} represents ${humanUTC}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${timestamp} in seconds or milliseconds?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${timestamp} has ${tsDigits} digits, which means it is in ${fmt}.`,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/tools/timestamp-converter"
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-terminal-green transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Timestamp Converter
          </Link>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold font-mono text-foreground mb-2">
          Unix Timestamp {timestamp}
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          {fmt} · {relativeStr}
        </p>

        <div className="border-l-4 border-terminal-green bg-terminal-green/5 rounded-r-xl p-5 mb-8">
          <p className="text-xs font-mono text-terminal-green uppercase tracking-widest mb-2">
            ⚡ Quick Answer
          </p>
          <p className="text-foreground text-lg font-mono font-bold">
            {timestamp} = {shortUTC} UTC
          </p>
          <p className="text-muted-foreground text-sm font-mono mt-1">ISO 8601: {iso}</p>
        </div>

        {warnings.map((w, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-r-lg p-4 mb-4 border-l-4 ${
              w.type === 'error'
                ? 'bg-red-950/30 border-red-500'
                : w.type === 'warning'
                  ? 'bg-amber-950/30 border-amber-500'
                  : 'bg-green-950/30 border-terminal-green'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" aria-hidden="true" />
            <p className="text-sm font-mono text-foreground">{w.msg}</p>
          </div>
        ))}

        <div className="bg-terminal-surface border border-terminal-border rounded-xl p-6 mb-6">
          <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Output Formats
          </h2>
          <div className="space-y-0">
            {outputs.map((o) => (
              <div
                key={o.label}
                className="flex items-center justify-between py-3 border-b border-terminal-border last:border-0"
              >
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-0.5">{o.label}</p>
                  <p className="font-mono text-sm text-terminal-green break-all">{o.value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(o.value)}
                  className="ml-4 shrink-0 text-xs font-mono text-muted-foreground hover:text-terminal-green transition-colors"
                  aria-label={`Copy ${o.label}`}
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <AdUnit slot="2151149097" format="rectangle" className="my-6" />

        <div className="bg-terminal-surface border border-terminal-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-terminal-green" aria-hidden="true" />
            <h2 className="text-sm font-mono font-bold text-foreground">Timezone Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TIMEZONES.map((tz) => (
              <div key={tz.tz} className="bg-background border border-terminal-border rounded-lg p-3">
                <p className="text-xs font-mono text-muted-foreground mb-1">{tz.label}</p>
                <p className="font-mono text-sm text-foreground">
                  {new Intl.DateTimeFormat('en-US', {
                    timeZone: tz.tz,
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short',
                  }).format(date)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-terminal-surface border border-terminal-border rounded-xl p-6 mb-6">
          <h2 className="text-sm font-mono font-bold text-foreground mb-4">Related Timestamps</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {related.map((r) => (
              <Link
                key={r.label}
                href={`/convert/${r.ts}`}
                className="bg-background border border-terminal-border rounded-lg p-3 hover:border-terminal-green transition-colors group"
              >
                <p className="text-xs font-mono text-muted-foreground mb-1">{r.label}</p>
                <p className="font-mono text-sm text-terminal-green group-hover:underline">{r.ts}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-terminal-surface border border-terminal-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold font-mono text-foreground mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-mono font-bold text-sm text-foreground mb-2">
                What date is Unix timestamp {timestamp}?
              </h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                Unix timestamp {timestamp} represents {humanUTC}. This is {relativeStr} from the current time.
              </p>
            </div>

            <div>
              <h3 className="font-mono font-bold text-sm text-foreground mb-2">
                Is {timestamp} in seconds or milliseconds?
              </h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                {timestamp} has {tsDigits} digits, which means it is in{' '}
                <strong className="text-foreground">{fmt}</strong>.
                {fmt === 'milliseconds' &&
                  ` Divide by 1,000 to get Unix seconds: ${Math.floor(seconds)}.`}
                {fmt === 'seconds' &&
                  ` Multiply by 1,000 to get milliseconds: ${Math.floor(seconds * 1000)}.`}
              </p>
            </div>

            <div>
              <h3 className="font-mono font-bold text-sm text-foreground mb-2">
                How do I convert {timestamp} in JavaScript?
              </h3>
              <pre className="bg-background border border-terminal-border rounded-lg p-4 font-mono text-xs text-cyan-400 overflow-x-auto">
                {`// Normalized to Unix seconds: ${Math.floor(seconds)}
const tsSec = ${Math.floor(seconds)};
new Date(tsSec * 1000).toISOString();
// "${iso}"`}
              </pre>
            </div>

            <div>
              <h3 className="font-mono font-bold text-sm text-foreground mb-2">
                How do I convert {timestamp} in Python?
              </h3>
              <pre className="bg-background border border-terminal-border rounded-lg p-4 font-mono text-xs text-cyan-400 overflow-x-auto">
                {`import datetime
ts = ${Math.floor(seconds)}
dt = datetime.datetime.fromtimestamp(
    ts, tz=datetime.timezone.utc)
print(dt.isoformat())
# "${iso}"`}
              </pre>
            </div>

            <div>
              <h3 className="font-mono font-bold text-sm text-foreground mb-2">
                What is the Unix timestamp for right now?
              </h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                Use our{' '}
                <Link href="/tools/timestamp-converter" className="text-terminal-green hover:underline">
                  live timestamp converter
                </Link>{' '}
                to get the current Unix timestamp. In JavaScript: Math.floor(Date.now() / 1000). In Python:
                int(time.time()). In bash: date +%s.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-terminal-surface border border-terminal-green/30 rounded-xl p-6 text-center mb-8">
          <p className="font-mono text-foreground font-bold mb-2">Need to convert a different timestamp?</p>
          <p className="text-sm text-muted-foreground font-mono mb-4">
            Our full converter supports seconds, milliseconds, microseconds, 25+ timezones, and auto-detection.
          </p>
          <Link
            href="/tools/timestamp-converter"
            className="inline-flex items-center gap-2 bg-terminal-green text-terminal-bg font-mono font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Open Full Converter →
          </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <AdUnit slot="1750948984" format="horizontal" className="my-6" />

        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
