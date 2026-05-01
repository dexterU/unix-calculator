'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function CachingStrategiesTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Blog · Architecture</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Caching strategies for time-sensitive data
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          TTL keys, stale-while-revalidate, and why aligning cache expiry with Unix epoch boundaries
          is often wrong — and what to do instead.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Why timestamps matter for caches
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Every cache entry is born with an implicit question: “until when is this answer valid?” Wall
          clocks drift, leap seconds exist, and DST changes wall time — but your invalidation policy
          should be anchored in a monotonic rule you can test. Unix timestamps (seconds or
          milliseconds since UTC epoch) give you a portable contract between services.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">TTL from absolute expiry</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Instead of “cache for 5 minutes from now,” store the producer&apos;s{' '}
          <strong className="text-foreground">absolute expiry instant</strong> (e.g. JWT{' '}
          <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">exp</code>, API
          cache-control, or DB row version). Compute remaining TTL at read time:
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`now = Math.floor(Date.now() / 1000)
ttl = max(0, expiresAtUnix - now)  // Redis SET key val EX ttl`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Stale-while-revalidate for read-heavy UIs
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Serve stale JSON for one SLA window while a background refresh repopulates the cache. Use
          the <em>same</em> timestamp source in browser and edge so you don&apos;t fight clock skew
          between CDN and origin.
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Stamp responses with server time in a header (e.g. epoch seconds).</li>
          <li>Log cache hits/misses with that stamp for postmortems.</li>
          <li>Avoid mixing browser <code className="font-mono text-terminal-cyan">Date</code> and DB local timezone columns in the same key.</li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Common pitfalls</h2>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Floating epoch in keys</strong> — prefer integer
            seconds/ms; floats invite serialization mismatch across languages.
          </li>
          <li>
            <strong className="text-foreground">TTL tied to “top of the hour”</strong> — simple for
            dashboards, brittle under traffic spikes; prefer explicit version or ETag.
          </li>
          <li>
            <strong className="text-foreground">Ignoring max clock skew</strong> — in distributed
            caches, document acceptable skew and use NTP-aware VMs or trusted time service.
          </li>
        </ul>

        <p className="text-sm text-muted-foreground">
          Try conversions on the{' '}
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            timestamp converter
          </Link>{' '}
          when designing TTL math in the browser.
        </p>
      </article>
    </ArticlePageShell>
  )
}
