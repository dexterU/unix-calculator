'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function TimestampPrecision2025Client() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Blog · Deep dive</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Complete guide to Unix timestamp precision
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Seconds, milliseconds, microseconds, floating point, and how each layer of your stack
          rounds or truncates — distilled for production APIs.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          What “Unix time” is
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          POSIX defines time as seconds since the epoch <strong className="text-foreground">1970-01-01 00:00:00 UTC</strong>,
          excluding leap seconds in the usual <code className="font-mono text-terminal-cyan">time_t</code> — meaning some
          UTC instants have no distinct POSIX second. Libraries map those instants in
          implementation-defined ways; document what your language does.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Precision ladder
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Seconds</strong> — JWT, many cron systems, Redis TTL in seconds.
          </li>
          <li>
            <strong className="text-foreground">Milliseconds</strong> — JavaScript <code className="font-mono text-terminal-cyan">Date</code>, Kafka
            default logical type, browser performance timelines.
          </li>
          <li>
            <strong className="text-foreground">Micro/nanoseconds</strong> — tracing, financial feeds; serialize as
            strings or fixed-point to avoid float hazards in JSON.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">JavaScript pitfalls</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">Date</code> stores ms; numbers above{' '}
          <code className="font-mono text-terminal-cyan">2^53</code> lose integer safety. For arbitrary precision, prefer
          strings or BigInt with an explicit unit in field names (<code className="font-mono text-terminal-cyan">createdAtMs</code>).
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`const ms = 1700000000123
const seconds = Math.floor(ms / 1000)
new Date(ms).toISOString()`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Y2038 and 64-bit</h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          Signed 32-bit <code className="font-mono text-terminal-cyan">time_t</code> overflows in 2038. Modern Linux, macOS, and Java use
          64-bit; legacy file formats and embedded systems may not. Audit serialization boundaries.
        </p>

        <p className="text-sm text-muted-foreground">
          Use the{' '}
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            timestamp converter
          </Link>{' '}
          to cross-check seconds vs milliseconds before you deploy schema changes.
        </p>
      </article>
    </ArticlePageShell>
  )
}
