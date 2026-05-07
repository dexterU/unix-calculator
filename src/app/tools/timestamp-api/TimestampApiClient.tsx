'use client'

import { useState } from 'react'
import {
  CheckCircle,
  Copy,
  Globe,
  Play,
  Shield,
  Zap,
} from 'lucide-react'
import { Header } from '@/components/Header'

const BASE = 'https://unixcalculator.com/api/v1/convert'

const EXAMPLES = [
  { title: 'Current timestamp', path: '' },
  { title: 'Specific timestamp', path: '?ts=1733529600' },
  { title: 'With timezone', path: '?ts=1733529600&tz=America/New_York' },
  { title: 'Milliseconds auto-detected', path: '?ts=1733529600000' },
  { title: 'ISO only (lightweight)', path: '?ts=1733529600&format=iso' },
  { title: 'Current time in Tokyo', path: '?tz=Asia/Tokyo' },
] as const

const EXAMPLE_JSON = `{
  "input": {
    "raw": 1733529600,
    "detected_format": "seconds",
    "timezone": "America/New_York"
  },
  "unix": {
    "seconds": 1733529600,
    "milliseconds": 1733529600000,
    "microseconds": 1733529600000000
  },
  "utc": {
    "iso_8601": "2024-12-07T04:00:00.000Z",
    "rfc_2822": "Sat, 07 Dec 2024 04:00:00 GMT",
    "human": "Saturday, December 7, 2024 at 04:00:00 AM GMT",
    "date": "2024-12-07",
    "time": "04:00:00.000"
  },
  // "local" is only present when tz is not UTC — timezone-aware strings
  "local": {
    "timezone": "America/New_York",
    "formatted": "…",
    "date": "…",
    "time": "…"
  },
  "relative": {
    "human": "3 months ago",
    "is_past": true,
    "diff_seconds": 8640000
  },
  "meta": {
    "day_of_week": "Friday",
    "day_of_year": 342,
    "week_number": 49,
    "is_leap_year": true,
    "unix_y2038_safe": true
  },
  // Omitted when there are no issues
  "warnings": [
    "Timestamp exceeds Y2038 limit — check 32-bit integer fields"
  ],
  "powered_by": "unixcalculator.com",
  "docs": "https://unixcalculator.com/tools/timestamp-api"
}`

export function TimestampApiClient() {
  const [liveResult, setLiveResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [customTs, setCustomTs] = useState('1733529600')
  const [customTz, setCustomTz] = useState('UTC')

  function copy(text: string, key: string) {
    void navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  async function runLiveTest(pathWithQuery: string) {
    setIsLoading(true)
    try {
      const url = `/api/v1/convert${pathWithQuery}`
      const res = await fetch(url)
      const data = await res.json()
      setLiveResult(JSON.stringify(data, null, 2))
    } catch {
      setLiveResult('{"error": "Request failed"}')
    }
    setIsLoading(false)
  }

  const livePath = `?ts=${encodeURIComponent(customTs)}&tz=${encodeURIComponent(customTz)}`
  const liveAbsolute = `${BASE}${livePath}`

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-terminal-border bg-terminal-surface px-4 py-1.5 font-mono text-xs text-terminal-green">
            <Zap className="h-3 w-3" />
            Free · No API Key · 100 req/hour
          </div>
          <h1 className="mb-3 font-mono text-3xl font-bold text-foreground">Unix Timestamp API</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A free REST API for timestamp conversion. Returns JSON with ISO 8601, timezone-aware output,
            relative time, and production warnings. No authentication required.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2 rounded-xl border border-terminal-border bg-terminal-surface p-4">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-terminal-cyan" />
            <p className="font-mono text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">CORS enabled</span> — use from any domain
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-terminal-border bg-terminal-surface p-4">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-terminal-green" />
            <p className="font-mono text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">No API key</span> required
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-terminal-border bg-terminal-surface p-4">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-terminal-amber" />
            <p className="font-mono text-xs text-muted-foreground">
              Auto-detects <span className="text-foreground">seconds, ms, µs, ns</span>
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Base URL
          </p>
          <div className="flex items-center justify-between gap-3">
            <code className="font-mono text-lg text-terminal-green break-all">{BASE}</code>
            <button
              type="button"
              onClick={() => copy(BASE, 'baseurl')}
              aria-label="Copy base URL"
              className="shrink-0"
            >
              {copied === 'baseurl' ? (
                <CheckCircle className="h-4 w-4 text-terminal-green" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground transition-colors hover:text-terminal-green" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface">
          <div className="border-b border-terminal-border px-5 py-3">
            <h2 className="font-mono font-bold text-foreground">Query Parameters</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="px-5 py-3 text-left font-normal text-muted-foreground">Parameter</th>
                  <th className="px-5 py-3 text-left font-normal text-muted-foreground">Required</th>
                  <th className="px-5 py-3 text-left font-normal text-muted-foreground">Default</th>
                  <th className="px-5 py-3 text-left font-normal text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['ts', 'No', 'now', 'Unix timestamp (seconds, ms, µs, or ns). Alias: timestamp'],
                  ['tz', 'No', 'UTC', 'IANA timezone (e.g. America/New_York). Alias: timezone'],
                  ['format', 'No', 'full', '"iso", "unix", or "full" (default)'],
                ].map(([param, req, def, desc]) => (
                  <tr key={param} className="border-b border-terminal-border/50">
                    <td className="px-5 py-3 text-terminal-cyan">{param}</td>
                    <td className="px-5 py-3 text-muted-foreground">{req}</td>
                    <td className="px-5 py-3 text-terminal-amber">{def}</td>
                    <td className="px-5 py-3 text-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-4 font-mono font-bold text-foreground">Live API Tester</h2>

          <div className="mb-4 flex flex-wrap gap-3">
            <input
              value={customTs}
              onChange={(e) => setCustomTs(e.target.value)}
              placeholder="Unix timestamp"
              className="min-w-[160px] flex-1 rounded-lg border border-terminal-border bg-background px-3 py-2 font-mono text-sm text-terminal-green focus:border-terminal-green focus:outline-none"
              aria-label="Timestamp to test"
            />
            <input
              value={customTz}
              onChange={(e) => setCustomTz(e.target.value)}
              placeholder="Timezone (UTC)"
              className="w-48 rounded-lg border border-terminal-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-terminal-green focus:outline-none"
              aria-label="Timezone"
            />
            <button
              type="button"
              onClick={() => runLiveTest(livePath)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-terminal-green px-5 py-2 font-mono font-bold text-terminal-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Play className="h-4 w-4" />
              {isLoading ? 'Loading...' : 'Run'}
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-lg border border-terminal-border bg-background px-3 py-2">
            <code className="flex-1 break-all font-mono text-xs text-muted-foreground">
              GET /api/v1/convert{livePath}
            </code>
            <button
              type="button"
              onClick={() => copy(liveAbsolute, 'liveurl')}
              aria-label="Copy URL"
              className="shrink-0"
            >
              {copied === 'liveurl' ? (
                <CheckCircle className="h-3.5 w-3.5 text-terminal-green" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          </div>

          {liveResult ? (
            <div className="relative">
              <pre className="max-h-96 overflow-y-auto overflow-x-auto rounded-lg border border-terminal-border bg-background p-4 font-mono text-xs text-terminal-green">
                {liveResult}
              </pre>
              <button
                type="button"
                onClick={() => copy(liveResult, 'result')}
                className="absolute right-3 top-3 rounded border border-terminal-border bg-terminal-surface px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-terminal-green"
                aria-label="Copy result"
              >
                {copied === 'result' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          ) : null}
        </div>

        <div className="mb-8 space-y-6">
          <h2 className="font-mono text-lg font-bold text-foreground">Example requests</h2>
          {EXAMPLES.map((ex) => {
            const rel = `/api/v1/convert${ex.path}`
            const abs = `${BASE}${ex.path}`
            const curl = `curl "${abs}"`
            const exKey = `ex-${ex.title}`
            const curlKey = `curl-${ex.title}`
            return (
              <div
                key={ex.title}
                className="rounded-xl border border-terminal-border bg-terminal-surface p-4"
              >
                <p className="mb-2 font-mono text-sm font-semibold text-foreground">{ex.title}</p>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <code className="flex-1 break-all font-mono text-xs text-terminal-green">
                    GET {rel}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(abs, exKey)}
                    className="rounded border border-terminal-border px-2 py-1 font-mono text-xs text-muted-foreground hover:text-terminal-green"
                  >
                    {copied === exKey ? 'Copied' : 'Copy URL'}
                  </button>
                </div>
                <div className="flex flex-wrap items-start gap-2 rounded-lg bg-background p-3">
                  <code className="flex-1 break-all font-mono text-xs text-muted-foreground">{curl}</code>
                  <button
                    type="button"
                    onClick={() => copy(curl, curlKey)}
                    className="shrink-0 rounded border border-terminal-border px-2 py-1 font-mono text-xs text-muted-foreground hover:text-terminal-green"
                  >
                    {copied === curlKey ? 'Copied' : 'Copy curl'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mb-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 font-mono font-bold text-foreground">JavaScript (fetch)</h2>
          <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs text-cyan-400 whitespace-pre">{`const res = await fetch(
  'https://unixcalculator.com/api/v1/convert?ts=1733529600'
);
const data = await res.json();
console.log(data.utc.iso_8601);
// "2024-12-07T04:00:00.000Z"`}</pre>
        </div>

        <div className="mb-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 font-mono font-bold text-foreground">Python (requests)</h2>
          <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs text-cyan-400 whitespace-pre">{`import requests
r = requests.get(
    'https://unixcalculator.com/api/v1/convert',
    params={'ts': 1733529600, 'tz': 'America/New_York'}
)
data = r.json()
print(data['utc']['iso_8601'])`}</pre>
        </div>

        <div className="mb-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 font-mono font-bold text-foreground">Shell (curl)</h2>
          <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs text-cyan-400 whitespace-pre">{`curl "https://unixcalculator.com/api/v1/convert?ts=$(date +%s)"
# Current time as JSON`}</pre>
        </div>

        <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-950/20 p-5">
          <h2 className="mb-3 font-mono font-bold text-foreground">Rate limits</h2>
          <div className="mb-3 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-terminal-green">100</p>
              <p className="font-mono text-xs text-muted-foreground">requests/hour</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-terminal-amber">429</p>
              <p className="font-mono text-xs text-muted-foreground">status when exceeded</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-terminal-cyan">Free</p>
              <p className="font-mono text-xs text-muted-foreground">no API key needed</p>
            </div>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Rate limit headers on every response: X-RateLimit-Limit, X-RateLimit-Remaining,
            X-RateLimit-Reset
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <h2 className="mb-3 font-mono font-bold text-foreground">Example full JSON response</h2>
          <p className="mb-3 font-mono text-xs text-muted-foreground">
            Shape for <code className="text-terminal-green">format</code> omitted or{' '}
            <code className="text-terminal-green">full</code>. Optional fields documented inline.
          </p>
          <pre className="max-h-[28rem] overflow-auto rounded-lg bg-background p-4 font-mono text-xs text-terminal-green whitespace-pre">
            {EXAMPLE_JSON}
          </pre>
        </div>
      </main>
    </div>
  )
}
