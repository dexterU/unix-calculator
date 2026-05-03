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
          <Link href="/blog" className="hover:text-terminal-green">
            Blog
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">GraphQL subscriptions</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Blog · GraphQL</p>
        <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="rounded border border-terminal-border px-2 py-0.5 text-terminal-green">Tutorial</span>
          <span>9 min read</span>
          <span>·</span>
          <span>Unix Calculator Editorial Team</span>
          <span>·</span>
          <span>Mar 22, 2026</span>
        </div>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          GraphQL Subscriptions with Real-Time Timestamps
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> In GraphQL, represent timestamps as{' '}
          <code className="font-mono text-terminal-cyan">Int</code> (Unix seconds) for compact payloads or{' '}
          <code className="font-mono text-terminal-cyan">String</code> (RFC 3339) for human debugging. A custom{' '}
          <code className="font-mono text-terminal-cyan">DateTime</code> scalar gives validation without leaking
          language-specific Date objects across the wire. Never promise subscription ordering by timestamp alone — add a
          monotonic sequence or cursor compound key.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Choosing Your Timestamp Type in GraphQL Schema
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          The schema is a contract. If mobile clients already store epoch milliseconds, exposing seconds without renaming
          fields will cause silent 1000× bugs. Pick one transport unit for all new fields and deprecate the legacy ones
          with explicit descriptions. For public APIs, ISO strings reduce onboarding friction; for high-rate ticks, ints win
          bandwidth and parsing cost.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`# Unix seconds — compact
type Event {
  id: ID!
  createdAt: Int!
  updatedAt: Int!
}

# Custom scalar — enforce parsing in one place
scalar DateTime

type AuditRow {
  id: ID!
  recordedAt: DateTime!
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Custom DateTime Scalar Implementation
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Apollo Server and GraphQL Yoga both let you coerce values at the boundary. The serialize step must be
          deterministic for the same instant — do not mix local tz formatting in serialize with UTC in parseValue unless
          you love bug reports from Australia.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value) {
    if (value instanceof Date) return Math.floor(value.getTime() / 1000);
    if (typeof value === 'number') return value;
    throw new TypeError('DateTime cannot represent value');
  },
  parseValue(value) {
    if (typeof value === 'number') return new Date(value * 1000);
    if (typeof value === 'string') return new Date(value);
    throw new TypeError('DateTime parse error');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) return new Date(parseInt(ast.value, 10) * 1000);
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    return null;
  },
});`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Real-Time Subscriptions with Timestamps
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Subscriptions multiplex many producers into one consumer socket. Stamp authoritative server time when the event
          enters the gateway, not when the database driver returns — those two instants diverge under CPU pressure. Emit
          both <code className="font-mono text-terminal-cyan">publishedAt</code> and <code className="font-mono text-terminal-cyan">seq</code>{' '}
          so UI code can merge partial reconnect buffers deterministically.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`type Subscription {
  priceQuotes(symbol: String!): PriceTick!
}

type PriceTick {
  symbol: String!
  price: Float!
  asOfSec: Int!
  seq: Int!
}

// Resolver sketch — async iterator fan-in
async function* subscribeQuotes(symbol) {
  for await (const row of broker.watch(symbol)) {
    yield {
      priceQuotes: {
        ...row,
        asOfSec: Math.floor(Date.now() / 1000),
        seq: nextSeq(symbol),
      },
    };
  }
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Cursor-Based Pagination Using Timestamps
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Relay cursors should encode <code className="font-mono text-terminal-cyan">(sort_value, id)</code> tuples, not
          opaque offsets. When sorting by descending <code className="font-mono text-terminal-cyan">created_at</code>, two
          rows can share the same millisecond — the tie-breaker prevents pages from dropping rows under load. Base64-JSON
          cursors are fine; just version them so you can migrate without breaking mobile caches.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Avoiding Common GraphQL Timestamp Mistakes
        </h2>
        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[460px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Mistake</th>
                <th className="px-3 py-2">Problem</th>
                <th className="px-3 py-2">Fix</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Float epoch', 'Client parsers round unpredictably', 'Use Int seconds or String ISO'],
                ['Trusting client clock', 'Forged "created" times', 'Stamp on server only'],
                ['Millis vs seconds drift', 'Off-by-1000 bugs', 'Prefix field names with unit'],
                ['Order by time alone', 'Collisions under burst inserts', 'Add ULID or bigint id tie-break'],
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
          <li>Custom scalars centralize coercion — stop repeating parse logic per resolver.</li>
          <li>High-frequency feeds need compact numeric timestamps plus sequence numbers.</li>
          <li>Cursors must be stable under duplicate sort keys.</li>
          <li>Never use native JS Date directly in schema serialization layers.</li>
          <li>Link to knowledge docs when onboarding partners on your time model.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Senior Unix/Linux
            Engineers. Last verified May 2026.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Reference:{' '}
          <Link href="/knowledge/graphql-timestamps" className="text-terminal-green underline hover:no-underline">
            GraphQL timestamps (knowledge base)
          </Link>
        </p>

        <NewsletterCapture source="blog-graphql" />
      </article>
    </ArticlePageShell>
  )
}
