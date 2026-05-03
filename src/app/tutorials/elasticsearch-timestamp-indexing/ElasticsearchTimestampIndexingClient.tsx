'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'
import { NewsletterCapture } from '@/components/NewsletterCapture'

export default function ElasticsearchTimestampIndexingClient() {
  return (
    <ArticlePageShell>
      <article>
        <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-terminal-green">
            Home
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <Link href="/tutorials" className="hover:text-terminal-green">
            Tutorials
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">Elasticsearch indexing</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · Search</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Elasticsearch timestamp indexing for log pipelines
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Map your canonical time field as{' '}
          <code className="font-mono text-terminal-cyan">date</code> (milliseconds) unless you ingest tracing spans needing
          <code className="font-mono text-terminal-cyan">date_nanos</code>. Normalize to UTC during ingest; keep{' '}
          <code className="font-mono text-terminal-cyan">event.original</code> timezone offsets for forensics. Range queries
          should hit a single field — scattering timestamps across unparsed strings defeats index pruning.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Mappings</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`PUT logs-000001
{
  "mappings": {
    "properties": {
      "@timestamp": { "type": "date" },
      "ingested_at": { "type": "date" },
      "service": { "type": "keyword" }
    }
  }
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Ingest pipelines</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Chain <code className="font-mono text-terminal-cyan">date</code> processor first to parse strings, then{' '}
          <code className="font-mono text-terminal-cyan">script</code> to clamp impossible years. Avoid applying two processors
          that rewrite the same field differently — order matters and failures roll documents into dead-letter indices
          quietly if you do not monitor pipeline error metrics.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Range query performance</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`GET logs-*/_search
{
  "size": 0,
  "query": {
    "range": {
      "@timestamp": { "gte": "now-1h", "lte": "now" }
    }
  },
  "aggs": {
    "per_service": { "terms": { "field": "service", "size": 20 } }
  }
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">ILM and retention</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Index lifecycle policies delete or shrink based on rollover age, not wall-clock maintenance windows. Tie delete
          phase to compliance retention derived from ingest timestamp — not file arrival order — when reconstructing
          regulatory timelines.
        </p>

        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Field type</th>
                <th className="px-3 py-2">Resolution</th>
                <th className="px-3 py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['date', 'Milliseconds', 'Default logs/metrics'],
                ['date_nanos', 'Nanoseconds', 'Tracing merge'],
                ['keyword (ISO string)', 'None (sort lexicographic)', 'Avoid for hot ranges'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-mono text-terminal-cyan">{a}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>One canonical <code className="font-mono text-terminal-cyan">@timestamp</code> per document.</li>
          <li>Watch pipelines with _ingest metrics — silent failures are common.</li>
          <li>Prefer epoch millis strings in bulk if generators already produce them.</li>
          <li>Cross-check with{' '}
            <Link href="/knowledge/log-timestamp-analysis" className="text-terminal-green underline">
              log analysis guide
            </Link>
            .
          </li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Last verified May
            2026.
          </p>
        </div>

        <NewsletterCapture source="tutorial-elasticsearch" />
      </article>
    </ArticlePageShell>
  )
}
