'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Timer, BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HOMEPAGE_FAQ, HOMEPAGE_HOWTO_STEPS } from '@/lib/homepage-seo'
import { getHomeToolCards, type HomeBrowseTab } from '@/lib/homepage-tools'
import { cn } from '@/lib/utils'

const TZ_OPTIONS = [
  { label: 'UTC', iana: 'UTC' },
  { label: 'EST', iana: 'America/New_York' },
  { label: 'PST', iana: 'America/Los_Angeles' },
  { label: 'CST', iana: 'America/Chicago' },
  { label: 'GMT', iana: 'Etc/GMT' },
  { label: 'CET', iana: 'Europe/Paris' },
  { label: 'IST', iana: 'Asia/Kolkata' },
  { label: 'JST', iana: 'Asia/Tokyo' },
  { label: 'AEST', iana: 'Australia/Sydney' },
] as const

type FormatMode = 'auto' | 'seconds' | 'ms' | 'us'

function parseToMs(raw: string, format: FormatMode): number | null {
  const t = raw.trim()
  if (!t) return null
  const n = Number(t)
  if (!Number.isFinite(n)) return null
  if (format === 'seconds') return n * 1000
  if (format === 'ms') return n
  if (format === 'us') return n / 1000
  if (n >= 1e15) return n / 1000
  if (n >= 1e12) return n
  return n * 1000
}

function formatSearchVolume(volume: number) {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`
  return volume.toString()
}

function AdSenseUnit({
  slot,
  format,
}: {
  slot: string
  format: 'rectangle' | 'horizontal'
}) {
  useEffect(() => {
    try {
      const w = window as Window & { adsbygoogle?: unknown[] }
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({})
    } catch {
      /* AdSense optional */
    }
  }, [])

  return (
    <div
      className="relative rounded-xl border border-dashed border-terminal-border/60 bg-[#040a06] px-3 pb-4 pt-8"
      style={{ minHeight: '100px' }}
    >
      <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5643430532021522"
        data-ad-slot={slot}
        data-ad-format={format}
      />
    </div>
  )
}

const BLOG_PREVIEW = [
  {
    href: '/blog/complete-guide-unix-timestamp-precision-2025',
    category: 'Precision',
    title: 'Complete guide to Unix timestamp precision in 2025',
    readTime: '12 min',
    views: '18.2K',
  },
  {
    href: '/blog/caching-strategies-time-sensitive-data',
    category: 'Architecture',
    title: 'Caching strategies for time-sensitive data',
    readTime: '9 min',
    views: '11.4K',
  },
  {
    href: '/blog/session-management-timestamp-expiration',
    category: 'Security',
    title: 'Session management and timestamp expiration',
    readTime: '8 min',
    views: '9.8K',
  },
] as const

const OUTPUT_TABLE_ROWS = [
  {
    format: 'ISO 8601',
    example: '2023-11-14T22:13:20.000Z',
    standard: 'ISO 8601 / RFC 3339',
    usedBy: 'REST APIs, JSON, PostgreSQL',
  },
  {
    format: 'RFC 822',
    example: 'Tue, 14 Nov 2023 22:13:20 GMT',
    standard: 'RFC 822 / RFC 2822',
    usedBy: 'HTTP Date, email headers',
  },
  {
    format: 'Human readable',
    example: 'Tuesday, November 14, 2023…',
    standard: 'Locale + IANA TZ',
    usedBy: 'UI, logging, support tools',
  },
  {
    format: 'Unix seconds',
    example: '1700000000',
    standard: 'POSIX time',
    usedBy: 'Linux, Redis, JWT exp',
  },
  {
    format: 'Milliseconds',
    example: '1700000000000',
    standard: 'JavaScript Date',
    usedBy: 'Browsers, Node.js, Kafka',
  },
]

export default function HomePageClient() {
  const [liveUnix, setLiveUnix] = useState(0)
  const [tsInput, setTsInput] = useState('')
  const [formatMode, setFormatMode] = useState<FormatMode>('auto')
  const [tzKey, setTzKey] = useState<(typeof TZ_OPTIONS)[number]['iana']>('UTC')
  const [converted, setConverted] = useState(false)
  const [resultMs, setResultMs] = useState<number | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [browseTab, setBrowseTab] = useState<HomeBrowseTab>('all')

  const allTools = useMemo(() => getHomeToolCards(), [])
  const filteredTools = useMemo(() => {
    if (browseTab === 'all') return allTools
    return allTools.filter((t) => t.tab === browseTab)
  }, [allTools, browseTab])

  useEffect(() => {
    setLiveUnix(Math.floor(Date.now() / 1000))
    const id = window.setInterval(() => {
      setLiveUnix(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const ianaTz = useMemo(() => {
    const found = TZ_OPTIONS.find((z) => z.iana === tzKey)
    return found?.iana ?? 'UTC'
  }, [tzKey])

  const resultDate = resultMs !== null ? new Date(resultMs) : null

  const resultRows = useMemo(() => {
    if (!resultDate || resultMs === null) return []
    const d = resultDate
    return [
      { key: 'iso', label: 'ISO 8601', value: d.toISOString() },
      { key: 'rfc822', label: 'RFC 822', value: d.toUTCString() },
      {
        key: 'human',
        label: 'Human readable',
        value: new Intl.DateTimeFormat('en-US', {
          timeZone: ianaTz,
          dateStyle: 'full',
          timeStyle: 'long',
        }).format(d),
      },
      { key: 'ms', label: 'Milliseconds', value: String(resultMs) },
      { key: 'sec', label: 'Unix seconds', value: String(Math.floor(resultMs / 1000)) },
    ]
  }, [resultDate, resultMs, ianaTz])

  const copyValue = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1500)
    } catch {
      setCopiedKey(null)
    }
  }, [])

  const handleConvert = () => {
    const ms = parseToMs(tsInput, formatMode)
    if (ms === null) {
      setConverted(false)
      setResultMs(null)
      return
    }
    setResultMs(ms)
    setConverted(true)
  }

  const scrollToConverter = () => {
    document.getElementById('timestamp-converter-card')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <header className="sticky top-0 z-50 border-b border-terminal-border bg-terminal-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-terminal-green to-terminal-cyan font-mono text-sm font-bold text-[hsl(var(--terminal-bg))]">
              &gt;_
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground sm:text-base">
              Unix Calculator
            </span>
          </Link>
          <nav className="hidden flex-wrap items-center gap-4 text-sm md:flex">
            <Link
              href="/tools"
              className="text-muted-foreground transition-colors hover:text-terminal-green"
            >
              Tools
            </Link>
            <Link
              href="/all-calculators"
              className="text-muted-foreground transition-colors hover:text-terminal-green"
            >
              Calculators
            </Link>
            <Link
              href="/tutorials"
              className="text-muted-foreground transition-colors hover:text-terminal-green"
            >
              Tutorials
            </Link>
            <Link
              href="/knowledge"
              className="text-muted-foreground transition-colors hover:text-terminal-green"
            >
              Knowledge Base
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground transition-colors hover:text-terminal-green"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-terminal-green"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-terminal-green sm:inline sm:text-sm">
              {liveUnix}
            </span>
            <Button
              type="button"
              onClick={scrollToConverter}
              className="rounded-full bg-terminal-green px-4 font-mono text-xs font-semibold text-[hsl(var(--terminal-bg))] hover:bg-terminal-green/90 sm:text-sm"
            >
              $ Get Started
            </Button>
          </div>
        </div>
      </header>

      <nav aria-label="Breadcrumb" className="border-b border-terminal-border/80 bg-terminal-surface/40 px-4 py-2">
        <div className="mx-auto max-w-6xl font-mono text-xs text-muted-foreground">
          <span>Home</span>
          <span className="mx-2 text-terminal-border">›</span>
          <Link href="/tools" className="hover:text-terminal-green">
            Tools
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">Unix Timestamp Converter</span>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-terminal-green" />
                </span>
                <span>
                  Real-time converter · No login · 100% browser-based
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Unix Timestamp Converter —
                <br />
                <span className="bg-gradient-to-r from-terminal-green to-terminal-cyan bg-clip-text text-transparent">
                  Epoch to Date &amp; Time
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Convert Unix timestamps to human-readable dates instantly. Supports seconds,
                milliseconds, and microseconds with 25+ timezone conversions. Free, private, and
                used by 50,000+ developers worldwide.
              </p>
              <div
                className="rounded-xl border-l-[3px] border-terminal-green/90 pl-4"
                style={{ background: 'hsl(var(--terminal-green) / 0.06)' }}
              >
                <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-terminal-green">
                  ⚡ Quick Answer
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  A Unix timestamp is the number of seconds elapsed since January 1, 1970 00:00:00 UTC
                  (the Unix epoch). To convert: divide by 1,000 if in milliseconds, then use{' '}
                  <code className="rounded bg-background/80 px-1 font-mono text-terminal-cyan">
                    new Date(seconds * 1000)
                  </code>{' '}
                  in JavaScript or{' '}
                  <code className="rounded bg-background/80 px-1 font-mono text-terminal-cyan">
                    date -d @TIMESTAMP
                  </code>{' '}
                  in Unix/Linux.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  '✓ Used by 50,000+ developers',
                  '🔒 No data sent to servers',
                  '⚡ Instant <3ms results',
                  '🌐 25+ timezones',
                  '📅 Updated April 2026',
                ].map((label) => (
                  <span
                    key={label}
                    className="rounded-lg border border-terminal-border bg-terminal-surface px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-[70px] lg:self-start">
              <section
                id="timestamp-converter-card"
                aria-labelledby="timestamp-converter-heading"
                className="rounded-xl border border-terminal-border bg-terminal-surface p-5 shadow-card"
              >
                <div className="mb-4 flex items-center justify-between gap-2 border-b border-terminal-border pb-3">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-terminal-green" aria-hidden />
                    <h2
                      id="timestamp-converter-heading"
                      className="font-mono text-lg font-semibold text-foreground"
                    >
                      Timestamp Converter
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-terminal-green sm:text-sm">
                    {liveUnix}
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="unix-ts" className="text-muted-foreground">
                      Unix Timestamp
                    </Label>
                    <Input
                      id="unix-ts"
                      value={tsInput}
                      onChange={(e) => setTsInput(e.target.value)}
                      placeholder="e.g. 1700000000"
                      className="mt-1 border-terminal-border bg-background font-mono text-terminal-green"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="homepage-ts-format" className="text-muted-foreground">
                        Format
                      </Label>
                      <select
                        id="homepage-ts-format"
                        value={formatMode}
                        onChange={(e) => setFormatMode(e.target.value as FormatMode)}
                        className="mt-1 flex h-10 w-full rounded-md border border-terminal-border bg-background px-3 font-mono text-sm text-foreground"
                      >
                        <option value="auto">Auto-detect</option>
                        <option value="seconds">Seconds</option>
                        <option value="ms">Milliseconds</option>
                        <option value="us">Microseconds</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="homepage-ts-timezone" className="text-muted-foreground">
                        Timezone
                      </Label>
                      <select
                        id="homepage-ts-timezone"
                        value={tzKey}
                        onChange={(e) =>
                          setTzKey(e.target.value as (typeof TZ_OPTIONS)[number]['iana'])
                        }
                        className="mt-1 flex h-10 w-full rounded-md border border-terminal-border bg-background px-3 font-mono text-sm text-foreground"
                      >
                        {TZ_OPTIONS.map((z) => (
                          <option key={z.iana} value={z.iana}>
                            {z.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleConvert}
                    className="w-full bg-terminal-green font-mono font-semibold text-[hsl(var(--terminal-bg))] hover:bg-terminal-green/90"
                  >
                    Convert Timestamp →
                  </Button>
                </div>

                <div className="mt-6">
                  <AdSenseUnit slot="2151149097" format="rectangle" />
                </div>

                {converted && resultRows.length > 0 && (
                  <div className="mt-6 space-y-0 rounded-lg border border-terminal-border bg-background/40">
                    <p className="border-b border-terminal-border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Results
                    </p>
                    {resultRows.map((row) => (
                      <div
                        key={row.key}
                        className="flex items-start gap-2 border-b border-terminal-border/60 px-3 py-2.5 last:border-b-0"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-medium text-muted-foreground">
                            {row.label}
                          </div>
                          <div className="break-all font-mono text-xs text-foreground sm:text-sm">
                            {row.value}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyValue(row.key, row.value)}
                          className="shrink-0 rounded border border-terminal-border bg-terminal-surface p-2 text-muted-foreground hover:text-terminal-green"
                          aria-label={
                            copiedKey === row.key
                              ? `Copied ${row.label} to clipboard`
                              : `Copy ${row.label} to clipboard`
                          }
                        >
                          {copiedKey === row.key ? (
                            <span className="text-terminal-green" aria-hidden>
                              ✓
                            </span>
                          ) : (
                            <Copy className="h-4 w-4" aria-hidden />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>

        <section className="border-y border-terminal-border bg-terminal-surface/80">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['50K+', 'Monthly developers'],
              ['25+', 'Developer tools'],
              ['<3ms', 'Avg response'],
              ['100%', 'Private (browser-only)'],
            ].map(([a, b]) => (
              <div key={b} className="text-center">
                <div className="font-mono text-2xl font-bold text-terminal-green">{a}</div>
                <div className="text-sm text-muted-foreground">{b}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              How to Convert a Unix Timestamp
            </h2>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              // 4 steps · 30 seconds
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOMEPAGE_HOWTO_STEPS.map((step, i) => (
              <div
                key={step.name}
                className="rounded-xl border border-terminal-border bg-terminal-surface p-5"
              >
                <div className="mb-3 font-mono text-2xl font-bold text-terminal-green/80">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{step.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Unix Timestamp Output Formats
          </h2>
          <div className="overflow-x-auto rounded-xl border border-terminal-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Example output</th>
                  <th className="px-4 py-3">Standard</th>
                  <th className="px-4 py-3">Used by</th>
                </tr>
              </thead>
              <tbody>
                {OUTPUT_TABLE_ROWS.map((row) => (
                  <tr key={row.format} className="border-b border-terminal-border/60 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.format}</td>
                    <td className="px-4 py-3 font-mono text-xs text-terminal-cyan">{row.example}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.standard}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.usedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <AdSenseUnit slot="3915656904" format="horizontal" />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-xl border border-terminal-border bg-terminal-surface p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-terminal-border bg-background text-3xl">
                👨‍💻
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <h2 className="text-xl font-bold text-foreground">
                  Written &amp; Reviewed by Unix Calculator Editorial Team
                </h2>
                <p className="text-sm font-medium text-terminal-green">
                  Senior Unix/Linux Engineers &amp; Developer Tooling Specialists
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We verify behavior against POSIX time semantics, document leap-second caveats where
                  libraries diverge, and test DST boundaries across IANA zones. Pre-epoch and
                  sub-second inputs are validated against reference `date` implementations and
                  RFC 3339 profiles used in production APIs.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'POSIX Verified',
                    'Leap Second Tested',
                    'DST Aware',
                    'Pre-epoch Support',
                    'RFC 3339 Compliant',
                  ].map((b) => (
                    <span
                      key={b}
                      className="rounded-md border border-terminal-border bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last updated: April 2026 ·{' '}
                  <Link href="/about" className="text-terminal-green underline hover:no-underline">
                    Editorial methodology
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible defaultValue="faq-0" className="rounded-xl border border-terminal-border bg-terminal-surface px-4">
            {HOMEPAGE_FAQ.map((item, i) => (
              <AccordionItem key={item.question} value={`faq-${i}`} className="border-terminal-border">
                <AccordionTrigger
                  className="text-left font-mono text-sm hover:no-underline sm:text-base"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.currentTarget.click()
                    }
                  }}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  {item.blocks.map((block, j) =>
                    block.type === 'p' ? (
                      <p key={j} className="text-sm leading-relaxed">
                        {block.text}
                      </p>
                    ) : (
                      <pre
                        key={j}
                        className="overflow-x-auto rounded-lg border border-terminal-border bg-background p-3 font-mono text-xs text-terminal-cyan"
                      >
                        {block.text}
                      </pre>
                    )
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              All 25+ Developer Tools
            </h2>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              // filter without navigating
            </p>
          </div>
          <div
            className="mb-6 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Filter tools by category"
          >
            {(
              [
                ['all', 'All Tools'],
                ['time', 'Time & Date'],
                ['math', 'Math & Science'],
                ['dev', 'Dev Utilities'],
                ['finance', 'Finance'],
              ] as const
            ).map(([id, label]) => {
              const isActive = browseTab === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setBrowseTab(id)}
                  className={cn(
                    'rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
                    isActive
                      ? 'border-terminal-green bg-terminal-green/15 text-terminal-green'
                      : 'border-terminal-border bg-terminal-surface text-muted-foreground hover:text-foreground'
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}
          >
            {filteredTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group rounded-xl border border-terminal-border bg-terminal-surface p-4 transition-colors hover:border-terminal-green/50"
                >
                  <Icon className="mb-2 h-6 w-6 text-terminal-green" />
                  <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-terminal-green">
                    {tool.name}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{tool.description}</p>
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground/80">
                    ~{formatSearchVolume(tool.searchVolume)} / mo
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Latest Guides &amp; Tutorials
            </h2>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              // written by senior engineers
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {BLOG_PREVIEW.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="flex flex-col rounded-xl border border-terminal-border bg-terminal-surface p-5 transition-colors hover:border-terminal-green/40"
              >
                <span className="mb-2 font-mono text-[10px] uppercase tracking-wider text-terminal-green">
                  {post.category}
                </span>
                <h3 className="flex-1 font-semibold text-foreground">{post.title}</h3>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                  <span>{post.views} views</span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-terminal-green">
                  Read <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <AdSenseUnit slot="1750948984" format="horizontal" />
        </section>

        <footer className="border-t border-terminal-border bg-terminal-surface/90">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-terminal-green to-terminal-cyan font-mono text-xs font-bold text-[hsl(var(--terminal-bg))]">
                    &gt;_
                  </span>
                  <span className="font-mono font-semibold text-foreground">Unix Calculator</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Free Unix timestamp converter and developer calculators. Browser-based, privacy
                  friendly.
                </p>
              </div>
              <div>
                <h3 className="mb-3 font-mono text-sm font-semibold text-foreground">Tools</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/tools/timestamp-converter" className="hover:text-terminal-green">
                      Timestamp Converter
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools/cron-generator" className="hover:text-terminal-green">
                      Cron Generator
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-calculators" className="hover:text-terminal-green">
                      All calculators
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-mono text-sm font-semibold text-foreground">Learn</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/tutorials" className="hover:text-terminal-green">
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link href="/knowledge" className="hover:text-terminal-green">
                      Knowledge Base
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-terminal-green">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-mono text-sm font-semibold text-foreground">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/about" className="hover:text-terminal-green">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="hover:text-terminal-green">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="hover:text-terminal-green">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 border-t border-terminal-border pt-6 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Unix Calculator. All rights reserved.
              <span className="mx-2 text-terminal-border">·</span>
              Built with Next.js · Deployed on Vercel
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
