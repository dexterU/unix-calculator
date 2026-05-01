'use client'

import { ArticlePageShell } from '@/components/ArticlePageShell'

const STUDIES = [
  {
    title: 'How a fintech startup reduced timestamp bugs by 90%',
    summary:
      'Mixed integer epochs (seconds vs ms) caused reconciliation gaps between the mobile app and ledger service. The team enforced RFC 3339 at the edge and moved internal Kafka topics to explicit ms fields with schema registry checks.',
    tools: 'Timestamp Converter, API Formatter, Knowledge: rate limiting',
    outcome: '90% fewer P1 date incidents in 2 quarters; 4× faster support root-cause time',
  },
  {
    title: 'Migrating 50M database rows from integer to timestamptz',
    summary:
      'Legacy 32-bit epoch seconds near saturation for forward-dated settlements. Migrated to PostgreSQL timestamptz with backfill jobs validated against dual-write metrics; cut over during a read-only window with epoch snapshots for rollback.',
    tools: 'DB Migration helper, Duration Calculator, leap-seconds reference',
    outcome: 'Zero data loss; 38-minute cutover; Y2038 runway secured for bonds desk',
  },
  {
    title: 'Building a distributed rate limiter with Unix timestamps',
    summary:
      'Edge nodes agreed on fixed windows aligned to UTC minute boundaries using synchronized clock discipline and monotonic guards for tie-breaking. Documented POSIX leap-second policy for audit.',
    tools: 'Timezone Converter, tutorials on rate limiting, Unix epoch docs',
    outcome: '99.99% SLO on token refill accuracy; formal compliance pack for SOC2 reviewers',
  },
] as const

export default function CaseStudiesClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Community · Case studies</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unix Calculator Case Studies
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
          Composite stories based on common production patterns — tooling and references you can apply to your own stack.
        </p>

        <ul className="space-y-6">
          {STUDIES.map((s) => (
            <li
              key={s.title}
              className="rounded-xl border border-terminal-border bg-terminal-surface p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.summary}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-mono text-terminal-green">Tools:</span> {s.tools}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Outcome — </span>
                {s.outcome}
              </p>
            </li>
          ))}
        </ul>
      </article>
    </ArticlePageShell>
  )
}
