'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function GraphqlTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · GraphQL</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          GraphQL scalar types for timestamps
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Custom scalars, <code className="font-mono text-terminal-cyan">DateTime</code> conventions, and subscription ordering notes.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Instant scalar</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Many schemas use <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">DateTime</code> serialized as ISO-8601 in UTC.
          If you expose epoch instead, name fields clearly: <code className="font-mono text-terminal-cyan">createdAtEpochMs</code>.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Sorting</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Cursor pagination by timestamp alone fails when two rows share the same millisecond — add a secondary key (ULID,
          id, tie-breaker).
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Relay & edges</h2>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Encode cursors that include sort keys, not opaque offsets.</li>
          <li>Return server time field in errors to help clients correlate retries.</li>
        </ul>

        <p className="text-sm text-muted-foreground">
          Long-form:{' '}
          <Link href="/blog/graphql-subscriptions-realtime-timestamps" className="text-terminal-green underline hover:no-underline">
            GraphQL subscriptions article
          </Link>
          .
        </p>
      </article>
    </ArticlePageShell>
  )
}
