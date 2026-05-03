'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'
import { NewsletterCapture } from '@/components/NewsletterCapture'

export default function MonitoringTimestampStrategiesClient() {
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
          <span className="text-foreground/90">Monitoring timestamps</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · Observability</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Monitoring strategies with accurate timestamps
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Separate <em>event time</em> (when something
          happened) from <em>ingest time</em> (when your collector saw it). Prometheus samples expose timestamps in
          milliseconds since epoch; alert rules evaluate over range vectors with explicit{' '}
          <code className="font-mono text-terminal-cyan">[5m:]</code> windows. For traces, propagate trace/span ids with
          nanosecond-resolution start times but never index raw span timestamps as metric labels — cardinality
          explodes.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Prometheus conventions</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Scrapers attach a scrape timestamp to each target pull. Counter resets appear as gaps — use{' '}
          <code className="font-mono text-terminal-cyan">rate()</code> or <code className="font-mono text-terminal-cyan">increase()</code> with at least
          four times the scrape interval to absorb jitter. Recording rules should align to minute boundaries only if
          product managers truly need calendar buckets; arbitrary alignment reduces flapping when scrapes slip.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`- alert: HighErrorBudgetBurn
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[5m]))
    /
    sum(rate(http_requests_total[5m]))
    > 0.05
  for: 10m`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Alerting windows</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Duration math in alert DSLs mirrors Unix subtraction: both ends are instants; the range vector slides with
          evaluation time. Document whether alerts use data lagged by remote write delays. For SLO burn alerts, translate
          error budgets into rates with explicit windows (hourly, daily) tied to business calendars — still store raw
          events as epoch milliseconds for replay.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">SLA calculation sketch</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`// Good: events carry event_time_ms from producers
const windowStart = Date.UTC(2026, 3, 22, 0, 0, 0);
const windowEnd = windowStart + 86400000;
const bad = events.filter(
  (e) => e.event_time_ms >= windowStart && e.event_time_ms < windowEnd && !e.ok
);
const slo = 1 - bad.length / totalInWindow;`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Grafana time ranges</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Dashboard variables like <code className="font-mono text-terminal-cyan">now-6h</code> translate to absolute
          bounds server-side. When comparing deploy markers, pass epoch milliseconds in annotations so teams across
          timezones agree on vertical slices.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Distributed tracing correlation</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          OpenTelemetry spans include start/end times with nanosecond fields, but backend exporters quantize for storage.
          When joining spans to logs, inject trace id into structured log fields and compare using ingest-time skew
          budgets — do not expect microsecond equality across hosts.
        </p>

        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Signal</th>
                <th className="px-3 py-2">Timestamp field</th>
                <th className="px-3 py-2">Pitfall</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Metrics', 'scrape + sample ts', 'Clock skew across HA pairs'],
                ['Logs', '@timestamp vs ingested_at', 'Parser timezone missing'],
                ['Traces', 'span start ns', 'Labeling spans as metrics'],
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

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Define event vs ingest columns before schema locking.</li>
          <li>Use histograms with sane buckets — literal timestamps make bad buckets.</li>
          <li>Alert <code className="font-mono text-terminal-cyan">for:</code> durations absorb transient spikes.</li>
          <li>Trace timestamps complement logs; they do not replace canonical event clocks.</li>
          <li>Test daylight saving week in staging with synthetic data.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Last verified May
            2026.
          </p>
        </div>

        <NewsletterCapture source="tutorial-monitoring" />
      </article>
    </ArticlePageShell>
  )
}
