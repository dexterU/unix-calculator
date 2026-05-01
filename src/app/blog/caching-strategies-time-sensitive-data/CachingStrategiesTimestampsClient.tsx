'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function CachingStrategiesTimestampsClient() {
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
          <span className="text-foreground/90">Caching time-sensitive data</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Blog · Architecture</p>
        <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="rounded border border-terminal-border px-2 py-0.5 text-terminal-green">Guide</span>
          <span>7 min read</span>
          <span>·</span>
          <span>Unix Calculator Editorial Team</span>
          <span>·</span>
          <span>Apr 5, 2026</span>
        </div>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Caching Strategies for Time-Sensitive Data
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Set cache TTL by calculating seconds until the
          content is invalid: <code className="font-mono text-terminal-cyan">ttl = max(0, next_change_unix - now)</code>.
          For event-driven correctness, store a <code className="font-mono text-terminal-cyan">last_modified</code>{' '}
          epoch in metadata and derive ETags or surrogate keys from it. Never deploy unbounded caches with no expiry or
          version — stale financial and auth-adjacent data is how incidents start.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          TTL-Based Cache Invalidation
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Absolute instants beat relative English phrases in configuration. When a feed publisher tells you the next
          quote refresh is at epoch <code className="font-mono text-terminal-cyan">T</code>, your edge should not
          guess &quot;five minutes&quot; — compute the remaining seconds at write time. Store{' '}
          <code className="font-mono text-terminal-cyan">cached_at</code> alongside payload bodies for observability so
          support can answer &quot;how old was this JSON?&quot; from logs without replaying user traffic.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`async function getCachedData(key, fetchFn, ttlSeconds = 300) {
  const raw = await redis.get(key);
  if (raw) {
    const { data, cached_at } = JSON.parse(raw);
    const age = Math.floor(Date.now() / 1000) - cached_at;
    console.log(\`Cache hit — age: \${age}s\`);
    return data;
  }
  const data = await fetchFn();
  await redis.setEx(
    key,
    ttlSeconds,
    JSON.stringify({ data, cached_at: Math.floor(Date.now() / 1000) })
  );
  return data;
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Timestamp-Based ETags</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          A strong ETag derived from a monotonic <code className="font-mono text-terminal-cyan">updated_at</code> lets
          browsers and intermediaries skip body download entirely. Use quoting rules from RFC 9110; compare with
          byte-for-byte equality on <code className="font-mono text-terminal-cyan">If-None-Match</code>.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`app.get('/api/rates', async (req, res) => {
  const rates = await getRates();
  const etag = \`"\${rates.last_updated}"\`;
  if (req.headers['if-none-match'] === etag) {
    res.status(304).end();
    return;
  }
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json(rates);
});`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">CDN Cache with Surrogate Keys</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Fastly, Cloudflare Workers, and Varnish support surrogate key headers listing logical entities (
          <code className="font-mono text-terminal-cyan">article-42</code>, <code className="font-mono text-terminal-cyan">user-7</code>).
          When an upstream mutation completes, purge every key containing that entity without flushing the whole domain.
          The purge API itself should be idempotent and authenticated — attackers love wide bans triggered through stolen
          dashboard cookies.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Cache Stampede Prevention with Timestamps
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          When a hot key expires, thundering herds recompute the same expensive query. Mitigations include single-flight
          locks, stale-while-revalidate with a probabilistic early refresh, and jitter added to TTL so synchronized
          clients do not line up on the same second. Encode lock owner + lease deadline as integers for easy sorting in
          Redis streams or DynamoDB conditional writes.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Best Practices Summary</h2>
        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Practice</th>
                <th className="px-3 py-2">Why</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Integer epochs in keys', 'Avoid float serialization mismatch across stacks'],
                ['Server Date headers', 'Clients correlate skew without trusting device clock'],
                ['Derived ETags', '304 responses save bandwidth on immutable histories'],
                ['Purge tests in CI', 'Surrogate maps rot without automation'],
              ].map(([a, b]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Compute TTL from authoritative next-change time, not vibes.</li>
          <li>ETags from <code className="font-mono text-terminal-cyan">updated_at</code> enable cheap revalidation.</li>
          <li>Surrogate keys connect business events to CDN invalidation.</li>
          <li>Add jitter and single-flight to prevent stampedes.</li>
          <li>Log <code className="font-mono text-terminal-cyan">cached_at</code> for debugging stale UI screenshots.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Senior Unix/Linux
            Engineers. Last verified May 2026.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Timestamp converter
          </Link>
        </p>
      </article>
    </ArticlePageShell>
  )
}
