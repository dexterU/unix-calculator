'use client'

import { ArticlePageShell } from '@/components/ArticlePageShell'

/** Positive UTC leap seconds (TAI − UTC increased by 1s at end of listed UTC day), through 2017-01-01. */
const HISTORICAL_LEAP_SECONDS = [
  '1972-06-30',
  '1972-12-31',
  '1973-12-31',
  '1974-12-31',
  '1975-12-31',
  '1976-12-31',
  '1977-12-31',
  '1978-12-31',
  '1979-12-31',
  '1981-06-30',
  '1982-06-30',
  '1983-06-30',
  '1985-06-30',
  '1988-01-01',
  '1990-01-01',
  '1991-01-01',
  '1992-07-01',
  '1993-07-01',
  '1994-07-01',
  '1996-01-01',
  '1997-07-01',
  '1998-01-01',
  '2005-12-31',
  '2008-12-31',
  '2012-07-01',
  '2015-07-01',
  '2017-01-01',
] as const

export default function LeapSecondsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Reference · Time</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Leap seconds</h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Earth&apos;s rotation isn&apos;t constant. Leap seconds keep civil UTC roughly aligned with mean solar time
          by occasionally inserting an extra second at the end of a UTC day.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Why they exist</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Atomic time (TAI) ticks uniformly. UTC adds leap seconds so the sun stays near expected clock positions for
          human calendars. Each leap makes <strong className="text-foreground">UTC − TAI</strong> one second larger
          until the next adjustment.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          POSIX vs civil UTC
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <strong className="text-foreground">POSIX time</strong> (what most Unix APIs call &quot;Unix time&quot;) counts
          SI seconds since the epoch but <em>does not</em> encode leap seconds as distinct integer values. During a
          positive leap second, civil clocks show <code className="font-mono text-terminal-cyan">23:59:60</code>; POSIX
          timestamps typically repeat or smear that instant depending on OS and ntpd settings. Libraries differ — always
          document your behavior for audit logs and finance.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Historical leap seconds (positive)
        </h2>
        <div className="mb-6 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">UTC date (end of day insertion)</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICAL_LEAP_SECONDS.map((d, i) => (
                <tr key={d} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-mono text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 font-mono text-terminal-cyan">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Handling leap seconds in code</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Prefer UTC with explicit string formats for human displays; store either POSIX seconds with documented policy,
          or RFC 3339 strings with offset from an authoritative clock. For log correlation during a leap event, compare
          monotonic counters plus wall-clock metadata.
        </p>
        <pre className="mb-4 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`# GNU date: show whether a leap second is scheduled (depends on tzdata)
TZ=right/UTC date -r @1483228799 +%Y-%m-%dT%H:%M:%S`}
        </pre>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`# Python 3.9+: aware UTC instant (library may fold leap — check docs)
from datetime import datetime, timezone
datetime.fromtimestamp(1483228800, tz=timezone.utc).isoformat()`}
        </pre>
      </article>
    </ArticlePageShell>
  )
}
