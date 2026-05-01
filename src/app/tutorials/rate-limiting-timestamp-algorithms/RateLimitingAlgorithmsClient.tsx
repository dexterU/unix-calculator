'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function RateLimitingAlgorithmsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · API design</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Rate limiting with Unix timestamps
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Fixed window, sliding window, and token bucket — each expressed with epoch math you can test in unit tests.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Fixed window</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Cheap in Redis: key per <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">userId:floor(now/window)</code>. Burst
          at window rollover can be unfair; document the trade-off.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Sliding log</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Store timestamps of recent requests in a sorted set; prune entries older than{' '}
          <code className="font-mono text-terminal-cyan">now - window</code>. Memory scales with allowed frequency.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Token bucket</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`// Pseudocode: refill tokens by elapsed epoch time
elapsed = now_sec - last_refill_sec
tokens = min(capacity, tokens + elapsed * refill_rate)
if tokens >= 1 { tokens -= 1; allow } else { deny }`}
        </pre>

        <p className="text-sm text-muted-foreground">
          See also{' '}
          <Link href="/knowledge/rate-limiting-timestamps" className="text-terminal-green underline hover:no-underline">
            rate limiting &amp; timestamps (knowledge)
          </Link>
          .
        </p>
      </article>
    </ArticlePageShell>
  )
}
