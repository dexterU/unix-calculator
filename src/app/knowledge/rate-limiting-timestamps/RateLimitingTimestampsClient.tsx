'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function RateLimitingTimestampsClient() {
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
          <span className="text-foreground/90">Rate limiting &amp; timestamps</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · APIs</p>
        <span className="rounded border border-terminal-border px-2 py-0.5 font-mono text-[10px] text-terminal-green">
          Reference
        </span>
        <h1 className="mb-6 mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Rate limiting with Unix timestamps
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Most HTTP rate limiters bucket traffic using integer
          Unix seconds (or milliseconds) from a trusted clock. Fixed windows use{' '}
          <code className="font-mono text-terminal-cyan">floor(now / window)</code> as a key suffix; sliding windows keep
          a sorted set of recent request marks; token buckets refill using elapsed seconds since the last update. Always
          align replicas with NTP and emit <code className="font-mono text-terminal-cyan">X-RateLimit-Reset</code> as
          epoch seconds your clients can compare without timezone math.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Fixed window algorithm</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Increment a counter for <code className="font-mono text-terminal-cyan">identity:epochBucket</code>. Expire keys
          automatically with Redis TTL = window length + small slack. Simplicity comes at a cost: a burst of traffic at the
          boundary can consume twice the nominal allowance. Document that behavior in developer portals so mobile teams do
          not assume strict fluid limits.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`const window = 60;
const bucket = Math.floor(Date.now() / 1000 / window);
const key = \`rl:\${userId}:\${bucket}\`;
// INCR + EXPIRE at window boundary (pseudocode)`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Sliding window in Redis</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Maintain a sorted set where scores are Unix seconds (or ms) of each accepted request. Before accepting a new
          request, delete members older than <code className="font-mono text-terminal-cyan">now - width</code>. Cardinality
          approximates recent volume; for exact counts you pay memory proportional to allowed RPS × window.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`async function slidingAllow(redis, id, limit, widthSec) {
  const key = \`sw:\${id}\`;
  const now = Math.floor(Date.now() / 1000);
  await redis.zRemRangeByScore(key, 0, now - widthSec);
  const count = await redis.zCard(key);
  if (count >= limit) return false;
  await redis.zAdd(key, { score: now, value: crypto.randomUUID() });
  await redis.expire(key, widthSec * 2);
  return true;
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Token bucket refill</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Store tokens and <code className="font-mono text-terminal-cyan">last_refill_epoch</code>. On each check, compute{' '}
          <code className="font-mono text-terminal-cyan">delta = now - last</code>, add{' '}
          <code className="font-mono text-terminal-cyan">delta * refill_per_sec</code> capped by capacity, then consume one
          token if available. Floating math in Lua scripts inside Redis avoids race conditions between read and write.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Algorithm comparison</h2>
        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Algorithm</th>
                <th className="px-3 py-2">Fairness</th>
                <th className="px-3 py-2">State cost</th>
                <th className="px-3 py-2">Best for</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Fixed window', 'Bursty at edges', 'O(1) per identity', 'Cheap global throttles'],
                ['Sliding window', 'Smooth', 'O(requests in window)', 'Strict SaaS APIs'],
                ['Token bucket', 'Allows controlled bursts', 'O(1) with scripts', 'Bandwidth shaping'],
              ].map(([a, b, c, d]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Never derive limiter time solely from client devices.</li>
          <li>Publish reset headers as integer epochs, not human strings.</li>
          <li>Use atomic Redis primitives under concurrency — no read-modify-write in app code alone.</li>
          <li>Load test boundary seconds; off-by-one in floor division causes duplicate keys.</li>
          <li>Pair limiters with backoff hints (Retry-After) derived from same clock.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Last verified May
            2026.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Tutorial:{' '}
          <Link href="/tutorials/rate-limiting-timestamp-algorithms" className="text-terminal-green underline">
            Rate limiting algorithms
          </Link>
        </p>
      </article>
    </ArticlePageShell>
  )
}
