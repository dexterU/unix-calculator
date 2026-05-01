'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function GraphqlTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Blog · GraphQL</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          GraphQL subscriptions and real-time timestamps
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Ordering events, designing scalar types, and keeping WebSocket payloads compatible with Unix
          epoch conventions your clients already use.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Scalar choices: Instant vs Int
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Many APIs expose timestamps as either ISO-8601 strings or numeric epoch. Subscriptions
          firing dozens of times per second benefit from a compact, unambiguous scalar — typically{' '}
          <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">Instant</code> (RFC
          3339 string) for human debugging or <code className="font-mono text-terminal-cyan">Int</code>{' '}
          / <code className="font-mono text-terminal-cyan">Float</code> for seconds or milliseconds.
          Document which unit you mean in the schema description.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Stable ordering under load
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Subscription order is not guaranteed to match commit order at the database unless you
          attach a monotonic sequence (LSN, version counter, or hybrid logical clock). Pair each
          payload with both <strong className="text-foreground">server-generated time</strong> and a{' '}
          <strong className="text-foreground">sequence</strong> so subscribers can merge streams.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`type PriceTick {
  symbol: String!
  price: Float!
  asOfMs: Float!   # epoch milliseconds from server clock
  seq: Int!        # monotonic per symbol stream
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Clock skew at the edge</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Browsers executing <code className="font-mono text-terminal-cyan">Date.now()</code> may
          disagree with your gateway. Prefer stamping authoritative time on the server before
          fan-out; never trust client clocks for “created at” in subscription payloads that drive
          trading or billing.
        </p>

        <p className="text-sm text-muted-foreground">
          Related:{' '}
          <Link href="/knowledge/graphql-timestamps" className="text-terminal-green underline hover:no-underline">
            GraphQL &amp; timestamps (knowledge base)
          </Link>
          .
        </p>
      </article>
    </ArticlePageShell>
  )
}
