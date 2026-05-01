'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function ElasticsearchTimestampIndexingClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · Search</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Elasticsearch timestamp indexing for log pipelines
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Mappings, <code className="font-mono text-terminal-cyan">date</code> vs{' '}
          <code className="font-mono text-terminal-cyan">date_nanos</code>, and range queries that stay fast at scale.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Mapping</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Use <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">&quot;type&quot;: &quot;date&quot;</code> for
          millisecond resolution unless you ingest high-frequency tracing; then consider{' '}
          <code className="font-mono text-terminal-cyan">date_nanos</code>. Accept epoch millis strings in bulk — ES
          parses strict_date_optional_time and epoch formats when you declare them.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Ingest pipelines</h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Normalize to UTC in a single <code className="font-mono text-terminal-cyan">@timestamp</code> field.</li>
          <li>Store original timezone offset as metadata if you need forensic replay.</li>
          <li>Avoid mutating the same field twice with conflicting date processors.</li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Query pattern</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`GET logs-*/_search
{
  "query": {
    "range": {
      "@timestamp": {
        "gte": "now-1h",
        "lte": "now"
      }
    }
  }
}`}
        </pre>

        <p className="text-sm text-muted-foreground">
          Cross-check raw epoch fields with our{' '}
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            converter
          </Link>{' '}
          before bulk indexing.
        </p>
      </article>
    </ArticlePageShell>
  )
}
