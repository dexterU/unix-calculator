'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function GolangUnixTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · Go</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Go Unix timestamps (<code className="font-mono text-terminal-cyan">time.Time</code>)
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Monotonic readings, JSON <code className="font-mono text-terminal-cyan">encoding/json</code> tags, and RFC3339 in APIs.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Instant vs wall</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">time.Now()</code> includes monotonic reading for subtractions.
          Serializing with <code className="font-mono text-terminal-cyan">Unix()</code> drops monotonic; use <code className="font-mono text-terminal-cyan">UTC()</code>{' '}
          for stable wire format.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Parsing</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`t := time.Unix(1735689600, 0).UTC()
b, _ := t.MarshalJSON()  // quoted RFC3339 by default`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Zones</h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          Load locations explicitly — <code className="font-mono text-terminal-cyan">time.LoadLocation(&quot;America/New_York&quot;)</code> — never assume
          the server&apos;s local zone for customer-visible timestamps.
        </p>

        <p className="text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Epoch helper
          </Link>
        </p>
      </article>
    </ArticlePageShell>
  )
}
