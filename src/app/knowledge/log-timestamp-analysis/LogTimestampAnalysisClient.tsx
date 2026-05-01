'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function LogTimestampAnalysisClient() {
  return (
    <ArticlePageShell>
      <article>
        <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-terminal-green">
            Home
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <Link href="/knowledge" className="hover:text-terminal-green">
            Knowledge
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">Log timestamp analysis</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · Logs</p>
        <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="rounded border border-terminal-border px-2 py-0.5 text-terminal-green">Reference</span>
          <span>~14 min read</span>
        </div>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Log timestamp analysis</h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Parse every log timestamp into an explicit instant
          (UTC epoch seconds or milliseconds) before correlation. Extract with regex or structured parsers, normalize
          timezone offsets, and reject ambiguous local times during DST fall-back. Store both{' '}
          <code className="font-mono text-terminal-cyan">@timestamp</code> and the original raw string for audit replay.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Common log timestamp formats
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Nginx access logs default to <code className="font-mono text-terminal-cyan">time_local</code> — enclosed in
          brackets without timezone — which is dangerous for global fleets because it is ambiguous during repeated local
          times. Prefer <code className="font-mono text-terminal-cyan">time_iso8601</code> in new configurations.
          Apache combined logs similarly emit <code className="font-mono text-terminal-cyan">[10/Oct/2000:13:55:36 -0700]</code>{' '}
          where the offset is explicit — much safer. Syslog (RFC 5424) includes precision timestamps with explicit offset
          or <code className="font-mono text-terminal-cyan">Z</code>. JSON logs from Node often emit{' '}
          <code className="font-mono text-terminal-cyan">Date.toISOString()</code> or numeric epoch — always check which.
        </p>

        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Example</th>
                <th className="px-3 py-2">Regex / notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['nginx time_iso8601', '2026-04-22T14:05:01+00:00', '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\+\\d{2}:\\d{2}'],
                ['Apache combined', '[22/Apr/2026:14:05:01 +0000]', '\\[([^\\]]+)\\]'],
                ['JSON ISO', '"ts":"2026-04-22T14:05:01.123Z"', '"ts":"([^"]+)"'],
                ['JSON epoch ms', '"ts":1713794701123', '"ts":(\\d{13})'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-terminal-cyan">{b}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Normalizing to UTC and detecting timezones
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          If the log line includes a numeric offset, parse it and convert to UTC before indexing. If only local wall time
          exists, you must inject the <em>known</em> IANA zone of the emitting host — never guess from the reader&apos;s
          laptop clock. For multi-line stack traces, propagate the header timestamp downward or reject lines without
          context rather than inventing synthetic times.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Awk and grep pipelines</h2>
        <pre className="mb-4 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`# Apache-style bracketed time — split on brackets (GNU/BSD awk)
awk -F'[][]' 'NF>1 { print $2 }' access.log | head

# Lines starting with ISO-8601 date
grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}T' structured.log`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Python parsing sketch</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`from datetime import datetime, timezone

def parse_apache_ts(chunk: str) -> int:
    # 22/Apr/2026:14:05:01 +0000
    dt = datetime.strptime(chunk, "%d/%b/%Y:%H:%M:%S %z")
    return int(dt.astimezone(timezone.utc).timestamp())`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Bracketed local times without offsets are a tech-debt magnet — reconfigure emitters when possible.</li>
          <li>Always keep raw substrings until parsers are fuzz-tested against daylight saving edges.</li>
          <li>JSON logs mix string ISO and numeric epoch — enforce schema in CI.</li>
          <li>Use UTC in search indices; keep source offset metadata for legal holds.</li>
          <li>For high volume, compile regex once and stream-parse rather than loading whole files.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Senior Unix/Linux
            Engineers. Last verified May 2026.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/tools/log-parser" className="text-terminal-green underline hover:no-underline">
            Log parser tool
          </Link>
        </p>
      </article>
    </ArticlePageShell>
  )
}
