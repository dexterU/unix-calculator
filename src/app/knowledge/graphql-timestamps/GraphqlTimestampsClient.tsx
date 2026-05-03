'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'
import { NewsletterCapture } from '@/components/NewsletterCapture'

export default function GraphqlTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-terminal-green">
            Home
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <Link href="/knowledge" className="hover:text-terminal-green">
            Knowledge
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">GraphQL timestamps</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · GraphQL</p>
        <span className="rounded border border-terminal-border px-2 py-0.5 font-mono text-[10px] text-terminal-green">
          Reference
        </span>
        <h1 className="mb-6 mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          GraphQL scalar types for timestamps
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Treat this page as a schema cookbook — not a
          step-by-step tutorial. Choose <code className="font-mono text-terminal-cyan">Int</code> for Unix seconds,{' '}
          <code className="font-mono text-terminal-cyan">String</code> for RFC 3339, or a custom{' '}
          <code className="font-mono text-terminal-cyan">DateTime</code> scalar that validates once. Pair every cursor
          sorted by time with a stable secondary key. See the{' '}
          <Link href="/blog/graphql-subscriptions-realtime-timestamps" className="text-terminal-green underline">
            subscriptions article
          </Link>{' '}
          for narrative examples.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Schema type comparison</h2>
        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">GraphQL type</th>
                <th className="px-3 py-2">Wire example</th>
                <th className="px-3 py-2">Pros</th>
                <th className="px-3 py-2">Cons</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Int (seconds)', '1713794701', 'Compact, easy math', 'Ambiguous without docs'],
                ['String (RFC3339)', '"2026-04-22T14:05:01Z"', 'Self-describing', 'More bytes'],
                ['Custom DateTime scalar', 'Either of the above', 'Central validation', 'Requires codegen rules'],
                ['Float (epoch ms)', '1713794701123.0', 'JS-friendly', 'IEEE floats — avoid for audit'],
              ].map(([a, b, c, d]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-terminal-cyan">{b}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Resolver patterns</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Database drivers often return <code className="font-mono text-terminal-cyan">Date</code> objects or driver-specific
          temporal types. Normalize in a data loader layer: convert to UTC instant before GraphQL serialization. For
          read models storing Unix integers, expose a field resolver that formats human strings only when clients request
          the expensive view — do not stringify in the hot path for mobile list screens.
        </p>

        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`const resolvers = {
  Event: {
    createdAtSec(parent) {
      return Math.floor(parent.createdAt.getTime() / 1000);
    },
  },
};`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Subscription timestamp ordering
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Subscribers merging partial buffers need a total order. Pure timestamps fail when events share the same
          millisecond — attach database sequence numbers, KSUIDs, or hybrid logical clocks. Document whether ordering is
          per-entity or global; global ordering is expensive at scale and often unnecessary if UI scopes by channel id.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Common mistakes reference</h2>
        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[440px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Mistake</th>
                <th className="px-3 py-2">Symptom</th>
                <th className="px-3 py-2">Fix</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Millis in Int field named *Sec', '1000× errors', 'Rename or convert'],
                ['Server uses local TZ', 'DST bugs', 'Force UTC in DB + resolvers'],
                ['Relay cursor = only id', 'Skipping rows', 'Encode (ts,id) pair'],
                ['Float DateTime scalar', 'Rounding drift', 'Use Int/BigInt/String'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Scalars encode policy — write the unit in field descriptions and lint schemas in CI.</li>
          <li>Never expose driver-specific Date objects without a defined serialize path.</li>
          <li>Cursors need tie-breakers, especially for millisecond-precision ingress.</li>
          <li>Knowledge base = contracts; tutorials = step-by-step — link both in onboarding.</li>
          <li>Load test with skewed clocks to ensure timeout handling stays deterministic.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Last verified May
            2026.
          </p>
        </div>

        <NewsletterCapture source="knowledge-graphql" />
      </article>
    </ArticlePageShell>
  )
}
