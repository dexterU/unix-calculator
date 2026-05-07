'use client'

import { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Copy,
  Search,
  Zap,
} from 'lucide-react'

type TsFormat = 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds' | 'unknown'
type WarningType = 'error' | 'warning' | 'info'

export type WarningItem = { type: WarningType; message: string }

/** Integer digit count (sign excluded) for detection — strips scientific / fractional tail */
function integerDigitInfo(input: string): { digits: number; sign: '-' | '' } {
  const t = input.trim()
  const m = t.match(/^(-)?(\d+)/)
  if (!m) return { digits: 0, sign: '' }
  return { digits: m[2].length, sign: m[1] === '-' ? '-' : '' }
}

function detectFormat(input: string): TsFormat {
  const t = input.trim()
  if (!t) return 'unknown'
  const { digits } = integerDigitInfo(t)
  if (digits < 1) return 'unknown'
  if (digits >= 1 && digits <= 10) return 'seconds'
  if (digits >= 11 && digits <= 13) return 'milliseconds'
  if (digits >= 14 && digits <= 16) return 'microseconds'
  if (digits >= 17 && digits <= 19) return 'nanoseconds'
  if (digits > 19) return 'nanoseconds'
  return 'unknown'
}

function toUnixSeconds(raw: string, format: TsFormat): number | null {
  if (format === 'unknown') return null
  const n = Number.parseFloat(raw.trim())
  if (!Number.isFinite(n)) return null
  if (format === 'seconds') return n
  if (format === 'milliseconds') return n / 1000
  if (format === 'microseconds') return n / 1_000_000
  if (format === 'nanoseconds') return n / 1_000_000_000
  return null
}

const Y2038_MAX = 2147483647

function dayOfYearUTC(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0)
  return Math.floor((d.getTime() - start) / 86_400_000)
}

function isLeapUTC(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

/** ISO week number and ISO week-numbering year (UTC) */
function isoWeekYearUTC(d: Date): { week: number; isoYear: number } {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const c = new Date(date.getTime())
  c.setUTCDate(c.getUTCDate() + 3 - ((c.getUTCDay() + 6) % 7))
  const isoYear = c.getUTCFullYear()
  const week1 = new Date(Date.UTC(isoYear, 0, 4))
  const week =
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86_400_000 - 3 + ((week1.getUTCDay() + 6) % 7)) / 7
    )
  return { week, isoYear }
}

function buildWarnings(
  rawInput: string,
  format: TsFormat,
  seconds: number | null,
  originalNumber: number
): WarningItem[] {
  const out: WarningItem[] = []
  if (seconds === null || format === 'unknown') return out

  const ms = seconds * 1000
  const date = new Date(ms)
  const y = date.getUTCFullYear()

  if (format === 'seconds' && y === 1970 && originalNumber > 0 && originalNumber < 1000) {
    out.push({
      type: 'error',
      message:
        'This timestamp resolves to 1970 — you likely passed seconds to a function expecting milliseconds (off by 1000×).',
    })
  }

  if (y > 9999) {
    out.push({
      type: 'error',
      message:
        'This timestamp resolves to year 50,000+ — you likely passed milliseconds to a function expecting seconds (off by 1000×).',
    })
  }

  if (seconds > Y2038_MAX) {
    out.push({
      type: 'error',
      message:
        'This timestamp exceeds Y2038 (Jan 19 2038 03:14:07 UTC) — if stored in a 32-bit integer field it will overflow.',
    })
  }

  if (seconds < 0) {
    out.push({
      type: 'warning',
      message:
        'This is a negative timestamp — it represents a date before January 1, 1970 UTC. Valid but uncommon.',
    })
  }

  if (format === 'nanoseconds') {
    const bi = rawInput.trim().replace(/^(-?)(\d+).*/, '$1$2')
    const absDigits = bi.replace(/^-/, '')
    if (absDigits.length > 15 || Number(absDigits) > Number.MAX_SAFE_INTEGER) {
      out.push({
        type: 'warning',
        message:
          'This timestamp is in nanoseconds — JavaScript cannot represent this exactly as a Number (exceeds MAX_SAFE_INTEGER).',
      })
    }
  }

  const nowSec = Date.now() / 1000
  if (seconds > nowSec + 31_536_000) {
    out.push({
      type: 'warning',
      message:
        'This timestamp is more than 1 year in the future — double-check it was not generated incorrectly.',
    })
  }

  if (seconds < nowSec && Number.isFinite(seconds)) {
    const diff = nowSec - seconds
    let msg = ''
    if (diff < 120) msg = `Timestamp is from ${Math.round(diff)} seconds ago`
    else if (diff < 3600) msg = `Timestamp is from ${Math.round(diff / 60)} minutes ago`
    else if (diff < 86_400) msg = `Timestamp is from ${Math.round(diff / 3600)} hours ago`
    else if (diff < 31_536_000) msg = `Timestamp is from ${Math.round(diff / 86_400)} days ago`
    else if (diff < 31_536_000 * 24) msg = `Timestamp is from ${Math.round(diff / 31_536_000)} months ago`
    else msg = `Timestamp is from ${Math.round(diff / 31_536_000)} years ago`
    out.push({ type: 'info', message: msg })
  }

  return out
}

function formatZone(date: Date, timeZone: string, tzLabel: string): string {
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  })
  return `${dtf.format(date)} (${tzLabel})`
}

function relativePhrase(seconds: number | null, nowSec: number): string {
  if (seconds === null || !Number.isFinite(seconds)) return 'Enter a timestamp to compare'
  const delta = seconds - nowSec
  const ad = Math.abs(delta)
  const parts: string[] = []
  let s = ad
  const days = Math.floor(s / 86_400)
  s -= days * 86_400
  const hours = Math.floor(s / 3600)
  s -= hours * 3600
  const minutes = Math.floor(s / 60)
  const secs = Math.floor(s - minutes * 60)
  if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`)
  if (hours) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`)
  if (minutes) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`)
  if (!parts.length || (days === 0 && hours === 0 && minutes === 0))
    parts.push(`${secs} second${secs === 1 ? '' : 's'}`)
  const core = parts.slice(0, 3).join(', ')
  return delta <= 0 ? `${core} ago` : `in ${core}`
}

const EXAMPLES = [
  { value: '1733529600', label: 'seconds' },
  { value: '1733529600000', label: 'milliseconds' },
  { value: '0', label: 'Unix epoch' },
  { value: '-86400', label: 'pre-1970' },
  { value: '2147483647', label: 'Y2038 limit' },
  { value: '99999999999999', label: 'ms confusion' },
  { value: '1733529600000000', label: 'microseconds' },
] as const

const TZ_ROWS = [
  { iana: 'UTC', label: 'UTC' },
  { iana: 'America/New_York', label: 'US Eastern' },
  { iana: 'America/Los_Angeles', label: 'US Pacific' },
  { iana: 'Europe/London', label: 'UK' },
  { iana: 'Asia/Tokyo', label: 'Japan' },
  { iana: 'Australia/Sydney', label: 'Australia' },
] as const

export function TimestampDebuggerClient() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  const format = useMemo(() => detectFormat(input), [input])
  const { digits: digitCount } = useMemo(() => integerDigitInfo(input), [input])
  const originalNumber = useMemo(() => Number.parseFloat(input.trim()), [input])
  const seconds = useMemo(() => {
    if (!input.trim() || format === 'unknown') return null
    return toUnixSeconds(input, format)
  }, [input, format])

  const resolvedDate = useMemo(() => {
    if (seconds === null) return null
    return new Date(seconds * 1000)
  }, [seconds])

  const warnings = useMemo(
    () => buildWarnings(input, format, seconds, originalNumber),
    [input, format, seconds, originalNumber]
  )

  const relativeTime = useMemo(
    () => relativePhrase(seconds, Date.now() / 1000),
    [seconds, tick]
  )

  const timezones = useMemo(() => {
    if (!resolvedDate) return []
    return TZ_ROWS.map((tz) => ({
      label: tz.label,
      formatted: formatZone(resolvedDate, tz.iana, tz.label),
    }))
  }, [resolvedDate])

  const formats = useMemo(() => {
    if (!resolvedDate || seconds === null) return []
    const d = resolvedDate
    const iso = d.toISOString()
    const rfc = d.toUTCString()
    const human = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(d)
    const sec = Math.floor(seconds)
    const ms = Math.round(seconds * 1000)
    const dow = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(d)
    const doy = dayOfYearUTC(d)
    const y = d.getUTCFullYear()
    const dim = isLeapUTC(y) ? 366 : 365
    const { week, isoYear } = isoWeekYearUTC(d)
    return [
      { label: 'ISO 8601', value: iso },
      { label: 'RFC 2822', value: rfc },
      { label: 'Human Readable', value: `${human} UTC` },
      { label: 'Unix Seconds', value: String(sec) },
      { label: 'Unix Ms', value: String(ms) },
      { label: 'Day of Week', value: dow },
      { label: 'Day of Year', value: `${doy} of ${dim}${isLeapUTC(y) ? ' (leap year)' : ''}` },
      { label: 'Week Number', value: `ISO week ${week} of ${isoYear}` },
    ]
  }, [resolvedDate, seconds])

  function copyToClipboard(value: string, label: string) {
    void navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(null), 1500)
  }

  const showEmpty =
    !input.trim() || format === 'unknown' || seconds === null || !Number.isFinite(seconds)

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-terminal-border bg-terminal-surface px-4 py-1.5 font-mono text-xs text-terminal-green">
            <Zap className="h-3 w-3" aria-hidden />
            No competitor has this tool
          </div>
          <h1 className="mb-3 font-mono text-3xl font-bold text-foreground">Unix Timestamp Debugger</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Paste any number. Instantly know what timestamp format it is, what date it represents, and if something
            looks wrong.
          </p>
        </div>

        <div className="relative mb-6">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Paste any timestamp — 1733529600, 1733529600000, etc."
            className="w-full rounded-xl border-2 border-terminal-border bg-terminal-surface py-5 pl-12 pr-4 font-mono text-xl text-terminal-green transition-colors placeholder:text-muted-foreground/50 focus:border-terminal-green focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            aria-label="Paste any Unix timestamp — seconds, milliseconds, microseconds, or nanoseconds"
          />
        </div>

        {showEmpty ? (
          <>
            <p className="mb-2 text-center font-mono text-xs text-muted-foreground">// try an example</p>
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.value}
                  type="button"
                  onClick={() => setInput(ex.value)}
                  className="rounded-full border border-terminal-border bg-terminal-surface px-3 py-1.5 font-mono text-xs transition-colors hover:border-terminal-green hover:text-terminal-green"
                  aria-label={`Try example timestamp: ${ex.label}`}
                >
                  {ex.value}
                  <span className="ml-2 text-muted-foreground">// {ex.label}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Supports: 10-digit seconds, 13-digit milliseconds, 16-digit microseconds, 19-digit nanoseconds
            </p>
          </>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">Auto-detected:</span>
              <span className="rounded-full border border-terminal-green/30 bg-terminal-green/10 px-3 py-1 font-mono text-sm text-terminal-green">
                {format} ({digitCount} digits)
              </span>
            </div>

            {warnings.map((w, i) => {
              if (w.type === 'error') {
                return (
                  <div
                    key={i}
                    className="mb-3 flex items-start gap-3 rounded-r-lg border-l-4 border-red-500 bg-red-950/30 p-4"
                  >
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden />
                    <p className="text-sm text-red-200">{w.message}</p>
                  </div>
                )
              }
              if (w.type === 'warning') {
                return (
                  <div
                    key={i}
                    className="mb-3 flex items-start gap-3 rounded-r-lg border-l-4 border-amber-500 bg-amber-950/30 p-4"
                  >
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
                    <p className="text-sm text-amber-100">{w.message}</p>
                  </div>
                )
              }
              return (
                <div
                  key={i}
                  className="mb-3 flex items-start gap-3 rounded-r-lg border-l-4 border-terminal-green bg-green-950/30 p-4"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-terminal-green" aria-hidden />
                  <p className="text-sm text-green-100">{w.message}</p>
                </div>
              )
            })}

            <div className="mb-6 rounded-xl border border-terminal-border bg-terminal-surface p-6 text-center">
              <Clock className="mx-auto mb-2 h-6 w-6 text-terminal-green" aria-hidden />
              <p className="font-mono text-2xl font-bold text-foreground">{relativeTime}</p>
              <p className="mt-1 font-mono text-sm text-muted-foreground">relative to now</p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              {timezones.map((tz) => (
                <div key={tz.label} className="rounded-lg border border-terminal-border bg-terminal-surface p-4">
                  <p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">{tz.label}</p>
                  <p className="font-mono text-sm text-foreground">{tz.formatted}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-xl border border-terminal-border bg-terminal-surface p-6">
              <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">Output Formats</h2>
              {formats.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between border-b border-terminal-border py-3 last:border-0"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="mb-1 font-mono text-xs text-muted-foreground">{f.label}</p>
                    <p className="break-all font-mono text-sm text-terminal-green">{f.value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(f.value, f.label)}
                    className="ml-4 flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-terminal-green"
                    aria-label={`Copy ${f.label}`}
                  >
                    {copied === f.label ? (
                      '✓ Copied'
                    ) : (
                      <>
                        <Copy className="h-3 w-3" aria-hidden="true" /> Copy
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <RelatedGuides guides={getRelatedGuides('timestamp-converter')} />
      </main>
    </div>
  )
}
