'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function MonitoringTimestampStrategiesClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · Observability</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Monitoring strategies with accurate timestamps
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Histograms, SLA windows, alerting delays, and why scrape-time vs metric-time matters.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Event time vs ingest time</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Prefer labeling samples with <strong className="text-foreground">when the event occurred</strong> (client or
          service clock adjusted for skew) separate from <em>received at</em>. That split makes lag/join analysis honest
          when queues back up.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Alignment windows</h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Prometheus-style range queries over <code className="font-mono text-terminal-cyan">start/end</code> instants.</li>
          <li>Use consistent step boundaries to avoid alert flapping.</li>
          <li>Document clock sync (NTP) on scrapers and agents.</li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">High-cardinality labels</h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          Raw trace or request IDs as labels explode cardinality. Keep timestamps in the sample payload, not as unbounded
          label values.
        </p>

        <p className="text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Convert window boundaries
          </Link>{' '}
          when writing alert expressions.
        </p>
      </article>
    </ArticlePageShell>
  )
}
