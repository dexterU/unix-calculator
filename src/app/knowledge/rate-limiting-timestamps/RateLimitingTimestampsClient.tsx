'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function RateLimitingTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · APIs</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Rate limiting with epoch-aligned windows
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Why naive “minute bucket” keys work, when they fail, and how to combine counters with trusted server time.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key design</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Partition limits per identity and coarse time bucket:{' '}
          <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">ratelimit:{'{user}'}</code>
          :<code className="font-mono text-terminal-cyan">{'{floor(now/60)}'}</code>. Expire keys automatically with
          Redis TTL slightly above window width.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Distributed fairness</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Without a central clock, replicas disagree on window edges. Prefer one coordination service (Redis, Coordination
          service) for increments, or accept soft over-limit under partition.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Response headers</h2>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <code className="font-mono text-terminal-cyan">X-RateLimit-Remaining</code>
          </li>
          <li>
            <code className="font-mono text-terminal-cyan">X-RateLimit-Reset</code> as epoch seconds
          </li>
        </ul>

        <p className="text-sm text-muted-foreground">
          Tutorial:{' '}
          <Link href="/tutorials/rate-limiting-timestamp-algorithms" className="text-terminal-green underline hover:no-underline">
            Rate limiting algorithms
          </Link>
          .
        </p>
      </article>
    </ArticlePageShell>
  )
}
