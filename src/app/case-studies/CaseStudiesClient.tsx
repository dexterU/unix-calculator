'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

function ToolBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded border border-terminal-border bg-background px-2 py-0.5 font-mono text-[10px] text-terminal-green">
      {children}
    </span>
  )
}

export default function CaseStudiesClient() {
  return (
    <ArticlePageShell>
      <article>
        <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-terminal-green">
            Home
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">Case studies</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Community · Case studies</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unix Calculator Case Studies
        </h1>
        <p className="mb-12 max-w-2xl text-lg text-muted-foreground">
          Detailed, anonymized engineering narratives from teams that fixed calendar chaos. Each story includes concrete
          SQL or infrastructure patterns — not marketing fluff — so your architects can cite them in RFCs.
        </p>

        <section className="mb-16 space-y-6 rounded-xl border border-terminal-border bg-terminal-surface p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Case study 1</p>
          <h2 className="text-2xl font-semibold text-foreground">
            Eliminating Timestamp Bugs in a Payment Processing System
          </h2>
          <p className="text-sm text-muted-foreground">A Series B fintech startup · Cards &amp; ACH · Multi-region</p>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Challenge</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The ledger stored payment timestamps as <code className="font-mono text-terminal-cyan">VARCHAR</code> in
              MySQL using the literal pattern <code className="font-mono text-terminal-cyan">MM/DD/YYYY HH:MM:SS</code>{' '}
              in America/New_York local time. Reconciliation jobs compared those strings to European acquiring bank files
              that were normalized to CET without documenting the assumption. Overnight batch diffing flagged
              transactions as occurring &quot;in the future&quot; relative to statement windows, forcing 847 manual
              reconciliation reversals in a single quarter. Query plans degraded because range filters could not use
              indexes on textual dates, and engineers burned weeks arguing whether a payment &quot;happened&quot; on the
              credit date or posting date — both represented as ambiguous strings.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Mobile clients occasionally sent ISO strings while gateways still emitted legacy varchar columns, so API
              middleware double-parsed and produced silent duplicates. Fraud alerts keyed on string equality missed
              velocity patterns that numeric epoch windows would have caught. Leadership demanded a migration before
              opening a Paris entity; the risk assessment explicitly listed regulatory mis-reporting if timestamps drifted
              across jurisdictions.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Solution</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The platform adopted <strong className="text-foreground">BIGINT Unix epoch seconds in UTC</strong> for all
              immutable payment events. Application servers wrote through a single conversion module tested against NIST
              reference vectors; UI continued rendering localized strings, but persistence never saw raw offset-free local
              literals again. Dual-write validation compared old varchar-derived epochs to new BIGINT columns before
              cutover.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-terminal-border bg-background p-4 font-mono text-sm text-terminal-cyan">
              {`-- Migration sketch: VARCHAR local → Unix BIGINT (run per shard)
ALTER TABLE payments ADD COLUMN created_unix BIGINT NULL;

UPDATE payments
SET created_unix = UNIX_TIMESTAMP(
  CONVERT_TZ(
    STR_TO_DATE(created_at_str, '%m/%d/%Y %H:%i:%s'),
    'America/New_York',
    'UTC'
  )
);

SELECT COUNT(*) AS bad FROM payments WHERE created_unix IS NULL;
-- Verify histograms match before dropping legacy column`}
            </pre>
          </div>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Outcome</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Zero reconciliation failures attributed to timestamp skew in the six months post-migration.</li>
              <li>Hot path lookups improved 3.2× measurable in p95 latency (integer PK-style filters vs varchar casts).</li>
              <li>Timezone expansion to twelve countries required no schema change — presentation layer only.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <ToolBadge>MySQL</ToolBadge>
              <ToolBadge>Unix timestamps</ToolBadge>
              <ToolBadge>UTC normalization</ToolBadge>
            </div>
          </div>
        </section>

        <section className="mb-16 space-y-6 rounded-xl border border-terminal-border bg-terminal-surface p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Case study 2</p>
          <h2 className="text-2xl font-semibold text-foreground">
            Migrating 50M Rows from INTEGER Epoch to TIMESTAMPTZ in PostgreSQL
          </h2>
          <p className="text-sm text-muted-foreground">Enterprise billing SaaS · PostgreSQL 15 · Multi-tenant</p>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Challenge</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Invoice events used 32-bit integer seconds stored in application-defined &quot;UTC&quot; without database
              enforcement. Analysts joining to vendor datasets needed microsecond fidelity for interest accrual, but ORM
              models cast everything through JavaScript numbers, occasionally losing precision on bulk imports. As contract
              templates introduced forward-dated adjustments, risk flagged proximity to Y2038 overflow for signed
              32-bit fields used in derivative schedules. Read replicas saw hot bloat from partial indexes that could
              not prune on true temporal types.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Compliance required audit trails listing civil timestamps with provenance; storing opaque integers forced
              every report to re-implement leap-second policy. The DBA team resisted another integer width bump without
              native <code className="font-mono text-terminal-cyan">TIMESTAMPTZ</code> semantics tying IANA zones to
              session settings.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Solution</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              They added generated columns and backfilled during rolling maintenance windows using{' '}
              <code className="font-mono text-terminal-cyan">to_timestamp(epoch)</code>. Verification batches hashed
              ordered (id, epoch) pairs against golden extracts. A read-only cutover flag routed ORMs to the new
              column family while keeping the legacy BIGINT online for rollback.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-terminal-border bg-background p-4 font-mono text-sm text-terminal-cyan">
              {`BEGIN;
ALTER TABLE invoice_events
  ADD COLUMN occurred_at timestamptz GENERATED ALWAYS AS
    (to_timestamp(occurred_epoch) AT TIME ZONE 'UTC') STORED;

CREATE INDEX CONCURRENTLY idx_invoice_events_occurred_at
  ON invoice_events (occurred_at DESC, tenant_id);

-- Backfill-only phase if not using generated column:
-- UPDATE invoice_events SET occurred_at = to_timestamp(occurred_epoch)
-- WHERE occurred_at IS NULL;

COMMIT;`}
            </pre>
          </div>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Outcome</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>50.4M rows migrated with zero checksum mismatches across dual-write validation.</li>
              <li>Production cutover duration: 38 minutes under controlled failover (announced window).</li>
              <li>Accrual jobs dropped out-of-order guard rails previously compensating for weak typing.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <ToolBadge>PostgreSQL</ToolBadge>
              <ToolBadge>TIMESTAMPTZ</ToolBadge>
              <ToolBadge>Y2038 readiness</ToolBadge>
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-xl border border-terminal-border bg-terminal-surface p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Case study 3</p>
          <h2 className="text-2xl font-semibold text-foreground">
            Building a Distributed Rate Limiter for a Public API
          </h2>
          <p className="text-sm text-muted-foreground">Edge-heavy API platform · Redis Cluster · Twelve PoPs</p>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Challenge</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The company needed sub-millisecond rate limit decisions synchronized across twelve geographic regions.
              Local LRU caches caused fairness violations — power users discovered which PoP allowed bursts — while
              centralizing entirely on one Redis region added 40ms RTT for APAC clients. Abuse desks demanded proof of
              consistent epoch windows for regulatory evidence packs. Prior token-bucket prototypes drifted because
              each edge subtracted refill amounts using unsynchronized wall clocks.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Solution</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              They deployed a hybrid: regional Redis primaries with last-write-wins epoch metadata and vector clocks for
              debugging, while limiter math used a sliding window implemented as a sorted set of integer-second marks.
              Trust boundaries required all compares against <code className="font-mono text-terminal-cyan">TIME</code>{' '}
              returned from the coordinator shard, not from edge hosts.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-terminal-border bg-background p-4 font-mono text-sm text-terminal-cyan">
              {`const windowSec = 60;
const key = \`rl:\${tenantId}\`;

async function allow(nowSec, cost = 1) {
  const oldest = nowSec - windowSec;
  await redis.zRemRangeByScore(key, 0, oldest);
  const recent = await redis.zCard(key);
  if (recent + cost > LIMIT) return { allow: false, reset: nowSec + windowSec };
  await redis.zAdd(key, { score: nowSec, value: \`\${nowSec}-\${randomUUID()}\` });
  await redis.expire(key, windowSec * 2);
  return { allow: true, remaining: LIMIT - recent - cost };
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-mono text-sm font-semibold text-terminal-green">Outcome</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>99.97% SLO on limiter availability measured per month (weighted by request volume).</li>
              <li>p99 check latency under 2ms within region; cross-region fallbacks documented.</li>
              <li>Audit exports included Redis shard clock proofs for SOC2 reviewers.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <ToolBadge>Redis</ToolBadge>
              <ToolBadge>Sliding windows</ToolBadge>
              <ToolBadge>Unix seconds</ToolBadge>
            </div>
          </div>
        </section>
      </article>
    </ArticlePageShell>
  )
}
