'use client'

import { useEffect, useMemo, useState } from 'react'
import { Cron } from 'croner'
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Play,
  RefreshCw,
} from 'lucide-react'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every 5 minutes', expr: '*/5 * * * *' },
  { label: 'Every 15 minutes', expr: '*/15 * * * *' },
  { label: 'Every 30 minutes', expr: '*/30 * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every day at 9am', expr: '0 9 * * *' },
  { label: 'Every weekday 9am', expr: '0 9 * * 1-5' },
  { label: 'Every Monday', expr: '0 0 * * MON' },
  { label: 'Every Sunday midnight', expr: '0 0 * * SUN' },
  { label: 'First of month', expr: '0 0 1 * *' },
  { label: 'Every 6 hours', expr: '0 */6 * * *' },
  { label: 'Twice daily', expr: '0 9,18 * * *' },
  { label: 'Every weekend', expr: '0 0 * * SAT,SUN' },
  { label: 'Quarterly', expr: '0 0 1 */3 *' },
] as const

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
] as const

function explainCron(expr: string): string {
  const rawParts = expr.trim().split(/\s+/)
  if (rawParts.length < 5) return 'Invalid expression'

  const parts =
    rawParts.length >= 6
      ? rawParts.slice(1, 6)
      : rawParts.length === 5
        ? rawParts
        : rawParts.slice(-5)
  const [min, hour, dom, month, dow] = parts

  const explanations: string[] = []

  if (min === '0' && hour === '*') {
    explanations.push('every hour')
  } else {
    if (min === '*') explanations.push('every minute')
    else if (min.startsWith('*/')) explanations.push(`every ${min.slice(2)} minutes`)
    else if (min.includes(',')) explanations.push(`at minutes ${min}`)
    else explanations.push(`at minute ${min}`)

    if (hour !== '*') {
      if (hour.startsWith('*/')) explanations.push(`every ${hour.slice(2)} hours`)
      else if (hour.includes(',')) explanations.push(`at hours ${hour}`)
      else {
        const h = parseInt(hour, 10)
        if (!Number.isNaN(h)) {
          const ampm = h < 12 ? 'AM' : 'PM'
          const h12 = h % 12 || 12
          explanations.push(`at ${h12}:00 ${ampm}`)
        } else {
          explanations.push(`at hour ${hour}`)
        }
      }
    }
  }

  if (dom !== '*') {
    if (dom === '1') explanations.push('on the 1st of the month')
    else explanations.push(`on day ${dom} of the month`)
  }

  const monthNames = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  if (month !== '*') {
    if (month.startsWith('*/')) explanations.push(`every ${month.slice(2)} months`)
    else {
      const mi = parseInt(month, 10)
      explanations.push(`in ${(!Number.isNaN(mi) && monthNames[mi]) || month}`)
    }
  }

  const dowNames: Record<string, string> = {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
    SUN: 'Sunday',
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday',
  }
  if (dow !== '*') {
    if (dow.includes('-')) {
      const [start, end] = dow.split('-')
      explanations.push(
        `${dowNames[start] || start} through ${dowNames[end] || end}`,
      )
    } else if (dow.includes(',')) {
      const days = dow.split(',').map((d) => dowNames[d] || d)
      explanations.push(`on ${days.join(' and ')}`)
    } else {
      explanations.push(`on ${dowNames[dow] || dow}`)
    }
  }

  return explanations.join(', ')
}

export function CronNextRunsClient() {
  const [expression, setExpression] = useState('*/5 * * * *')
  const [timezone, setTimezone] = useState('UTC')
  const [count, setCount] = useState(10)
  const [copied, setCopied] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const result = useMemo(() => {
    try {
      const job = new Cron(expression.trim(), { timezone })
      const runs = job.nextRuns(count)
      return { runs, error: null as string | null }
    } catch (err) {
      return {
        runs: [] as Date[],
        error: err instanceof Error ? err.message : 'Invalid cron expression',
      }
    }
  }, [expression, timezone, count])

  function formatRunTime(date: Date, tz: string): {
    full: string
    relative: string
    unix: number
  } {
    const full = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }).format(date)

    const diffMs = date.getTime() - now.getTime()
    const past = diffMs < 0
    const diffSec = Math.floor(Math.abs(diffMs) / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)

    let relative = ''
    if (diffDay > 0) relative = `${diffDay}d ${diffHr % 24}h`
    else if (diffHr > 0) relative = `${diffHr}h ${diffMin % 60}m`
    else if (diffMin > 0) relative = `${diffMin}m ${diffSec % 60}s`
    else relative = `${diffSec}s`

    relative = past ? `${relative} ago` : `in ${relative}`

    return { full, relative, unix: Math.floor(date.getTime() / 1000) }
  }

  function copy(text: string, key: string) {
    void navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-terminal-border bg-terminal-surface px-4 py-1.5 font-mono text-xs text-terminal-green">
            <Clock className="h-3 w-3" />
            Free · Unlimited · Timezone-aware
          </div>
          <h1 className="mb-3 font-mono text-3xl font-bold text-foreground">Cron Next 10 Runs</h1>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            Enter any cron expression and see exactly when it will next run — with timezone support and
            human-readable relative times.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-terminal-border bg-terminal-surface p-6">
          <div className="mb-4">
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Cron Expression
            </label>
            <div className="flex gap-2">
              <input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="*/5 * * * *"
                className="flex-1 rounded-xl border-2 border-terminal-border bg-background px-4 py-3 font-mono text-xl text-terminal-green transition-colors focus:border-terminal-green focus:outline-none"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => copy(expression, 'expr')}
                aria-label="Copy expression"
                className="rounded-xl border border-terminal-border bg-background px-4 transition-colors hover:border-terminal-green"
              >
                {copied === 'expr' ? (
                  <CheckCircle className="h-4 w-4 text-terminal-green" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
            <span>│ minute</span>
            <span>│ hour</span>
            <span>│ day</span>
            <span>│ month</span>
            <span>│ weekday</span>
          </div>

          {!result.error && (
            <div className="flex items-center gap-2 rounded-lg border border-terminal-green/20 bg-terminal-green/10 px-4 py-2">
              <Play className="h-3 w-3 shrink-0 text-terminal-green" />
              <p className="font-mono text-sm text-terminal-green">Runs {explainCron(expression)}</p>
            </div>
          )}

          {result.error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-2">
              <AlertTriangle className="h-3 w-3 shrink-0 text-red-400" />
              <p className="font-mono text-sm text-red-400">{result.error}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4">
            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="rounded-lg border border-terminal-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-terminal-green focus:outline-none"
                aria-label="Select timezone"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Show runs
              </label>
              <select
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10))}
                className="rounded-lg border border-terminal-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-terminal-green focus:outline-none"
                aria-label="Number of runs to show"
              >
                {[5, 10, 15, 20, 25].map((n) => (
                  <option key={n} value={n}>
                    Next {n} runs
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {result.runs.length > 0 && (
          <div className="mb-6 overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface">
            <div className="flex items-center gap-2 border-b border-terminal-border px-5 py-3">
              <Calendar className="h-4 w-4 text-terminal-green" />
              <span className="font-mono text-sm font-bold text-foreground">
                Next {result.runs.length} Scheduled Runs
              </span>
              <RefreshCw className="ml-1 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              <span className="ml-auto font-mono text-xs text-muted-foreground">{timezone}</span>
            </div>

            {result.runs.map((run, i) => {
              const formatted = formatRunTime(run, timezone)
              return (
                <div
                  key={`${formatted.unix}-${i}`}
                  className="group flex items-center gap-4 border-b border-terminal-border px-5 py-4 last:border-0 hover:bg-terminal-border/20"
                >
                  <span className="w-6 shrink-0 text-center font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm text-foreground">{formatted.full}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      Unix: {formatted.unix}
                    </p>
                  </div>

                  <span className="shrink-0 font-mono text-sm text-terminal-green">{formatted.relative}</span>

                  <button
                    type="button"
                    onClick={() => copy(formatted.unix.toString(), `run-${i}`)}
                    aria-label="Copy Unix timestamp"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {copied === `run-${i}` ? (
                      <CheckCircle className="h-3.5 w-3.5 text-terminal-green" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {result.runs.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                copy(
                  result.runs.map((r) => Math.floor(r.getTime() / 1000)).join('\n'),
                  'all-unix',
                )
              }
              className="flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-surface px-4 py-2 font-mono text-sm transition-colors hover:border-terminal-green"
            >
              {copied === 'all-unix' ? (
                <CheckCircle className="h-3.5 w-3.5 text-terminal-green" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              Copy all Unix timestamps
            </button>

            <button
              type="button"
              onClick={() =>
                copy(
                  result.runs.map((r) => r.toISOString()).join('\n'),
                  'all-iso',
                )
              }
              className="flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-surface px-4 py-2 font-mono text-sm transition-colors hover:border-terminal-green"
            >
              {copied === 'all-iso' ? (
                <CheckCircle className="h-3.5 w-3.5 text-terminal-green" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              Copy all as ISO 8601
            </button>
          </div>
        )}

        <div className="mb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Common Schedules
          </p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.expr + preset.label}
                type="button"
                onClick={() => setExpression(preset.expr)}
                className={`rounded-lg border p-3 text-left font-mono transition-colors ${
                  expression === preset.expr
                    ? 'border-terminal-green/40 bg-terminal-green/10'
                    : 'border-terminal-border bg-terminal-surface hover:border-terminal-green/40'
                }`}
              >
                <p className="mb-1 text-xs text-terminal-green">{preset.expr}</p>
                <p className="text-xs text-muted-foreground">{preset.label}</p>
              </button>
            ))}
          </div>
        </div>

        <section className="mt-16 border-t border-terminal-border pt-12">
          <div className="mb-8 rounded-r-xl border-l-4 border-terminal-green bg-terminal-surface p-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-terminal-green">
              Quick answer
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              A cron expression has 5 fields: minute (0-59), hour (0-23), day of month (1-31), month
              (1-12), day of week (0-7). Asterisk (*) means every. Slash (/) means every N. So{' '}
              <code className="text-terminal-green">*/5 * * * *</code> runs every 5 minutes.
            </p>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">
            Cron expression field reference
          </h2>
          <div className="mb-8 overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="py-2 text-left text-muted-foreground">Field</th>
                  <th className="py-2 text-left text-muted-foreground">Values</th>
                  <th className="py-2 text-left text-muted-foreground">Special</th>
                  <th className="py-2 text-left text-muted-foreground">Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Minute', '0-59', '* */n , -', '*/15'],
                  ['Hour', '0-23', '* */n , -', '9-17'],
                  ['Day/Month', '1-31', '* */n , -', '1,15'],
                  ['Month', '1-12', '* */n , -', '*/3'],
                  ['Day/Week', '0-7', '* , - names', 'MON-FRI'],
                ].map(([field, values, special, ex]) => (
                  <tr key={field} className="border-b border-terminal-border/50">
                    <td className="py-2 text-foreground">{field}</td>
                    <td className="py-2 text-terminal-cyan">{values}</td>
                    <td className="py-2 text-muted-foreground">{special}</td>
                    <td className="py-2 text-terminal-amber">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">Special characters</h2>
          <ul className="mb-8 list-inside list-disc space-y-2 font-mono text-sm text-muted-foreground">
            <li>
              <span className="text-terminal-green">*</span> — any value
            </li>
            <li>
              <span className="text-terminal-green">*/n</span> — every n units
            </li>
            <li>
              <span className="text-terminal-green">n,m</span> — list of values
            </li>
            <li>
              <span className="text-terminal-green">n-m</span> — range
            </li>
            <li>
              Some engines support <span className="text-terminal-amber">@reboot</span>,{' '}
              <span className="text-terminal-amber">@daily</span>, <span className="text-terminal-amber">@weekly</span>,{' '}
              <span className="text-terminal-amber">@monthly</span>,{' '}
              <span className="text-terminal-amber">@yearly</span> (Vixie-style macros — verify your scheduler)
            </li>
          </ul>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">
            Cron vs AWS EventBridge vs Kubernetes CronJob
          </h2>
          <div className="mb-8 overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="py-2 text-left text-muted-foreground">System</th>
                  <th className="py-2 text-left text-muted-foreground">Fields</th>
                  <th className="py-2 text-left text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'Unix crontab',
                    '5 (minute → weekday)',
                    'Day-of-month & weekday often OR; seconds not supported.',
                  ],
                  [
                    'AWS EventBridge',
                    '6 (seconds + standard 5)',
                    'Year optional; ? allowed; some differences vs Linux cron.',
                  ],
                  [
                    'Kubernetes CronJob',
                    '5 fields in spec.schedule',
                    "Uses Robfig/cron-compatible parser; check controller version for quirks.",
                  ],
                ].map(([sys, fields, notes]) => (
                  <tr key={sys} className="border-b border-terminal-border/50">
                    <td className="py-2 text-terminal-green">{sys}</td>
                    <td className="py-2 text-foreground">{fields}</td>
                    <td className="py-2 text-muted-foreground">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">Common cron patterns</h2>
          <div className="mb-12 rounded-lg border border-terminal-border bg-background p-4">
            <pre className="overflow-x-auto font-mono text-xs text-cyan-400 whitespace-pre">{`# Every day at 3am (good for backups)
0 3 * * *

# Every weekday at 9am
0 9 * * 1-5

# First Monday of each month (many engines — use Quartz 1#1 or a wrapper script)
0 9 * * 1#1

# Every 15 minutes during business hours
*/15 9-17 * * 1-5`}</pre>
          </div>
        </section>

        <RelatedGuides guides={getRelatedGuides('cron-next-runs')} />
      </main>
    </div>
  )
}
