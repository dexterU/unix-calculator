'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function RateLimitingAlgorithmsClient() {
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
          <span className="text-foreground/90">Rate limiting algorithms</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · API design</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Rate limiting with Unix timestamps
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Express every limiter decision as pure functions of
          trusted epoch seconds. Fixed windows floor the clock; sliding windows prune old entries; token buckets add
          credits proportional to elapsed time. Unit-test each algorithm by simulating monotonic time arrays — flaky waits
          with <code className="font-mono text-terminal-cyan">setTimeout</code> hide off-by-one bugs.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Fixed window</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Easiest to implement with Redis <code className="font-mono text-terminal-cyan">INCR</code>. Key ={' '}
          <code className="font-mono text-terminal-cyan">{'{tenant}:{floor(now/window)}'}</code>. Communicate reset time
          as <code className="font-mono text-terminal-cyan">(bucket+1)*window</code> so clients backoff deterministically.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Sliding window log</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`function pruneAndCount(events, nowMs, windowMs) {
  const cutoff = nowMs - windowMs;
  const fresh = events.filter((t) => t >= cutoff);
  return { count: fresh.length, kept: fresh };
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Token bucket (Redis Lua sketch)</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`-- KEYS[1] bucket HASH tokens, last
-- ARGV capacity, refill_per_sec, now, cost
-- Pseudocode: refill = min(capacity, tokens + (now-last)*rate)
local cap = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])
-- HGETALL tokens/last, compute, HSET, return allow`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Choosing an algorithm</h2>
        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[460px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Pattern</th>
                <th className="px-3 py-2">Complexity</th>
                <th className="px-3 py-2">Fairness</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['API gateway default', 'Fixed', 'Okay for coarse public limits'],
                ['Fraud-sensitive login', 'Sliding or leaky bucket', 'Tighter against bursts'],
                ['Bandwidth shaping', 'Token bucket', 'Allows controlled floods'],
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
          <li>Tests should inject explicit now — never sleep in CI.</li>
          <li>Emit Retry-After derived from the same epoch clock.</li>
          <li>Shard Redis carefully; hot keys saturate single instances.</li>
          <li>Knowledge reference:{' '}
            <Link href="/knowledge/rate-limiting-timestamps" className="text-terminal-green underline">
              rate limiting timestamps
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
      </article>
    </ArticlePageShell>
  )
}
