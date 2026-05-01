'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function WebhookTimestampSecurityClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · Security</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Webhook timestamp security
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          HMAC verification, replay windows, and rejecting events that are too old despite a valid signature.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Signed payload</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Include <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">t</code> (epoch seconds) and{' '}
          <code className="font-mono text-terminal-cyan">v1</code> (HMAC of <code className="font-mono text-terminal-cyan">t.payload</code>) in
          headers. Verify signature with constant-time comparison, then parse body.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Slack-style skew check</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`const skew = Math.abs(serverNowSec - headerTimestampSec)
if (skew > 300) return res.status(400).send('stale event')`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Idempotency</h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          Store processed event IDs with TTL slightly longer than your replay window so duplicates don&apos;t double-post.
        </p>

        <p className="text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Convert header stamps
          </Link>{' '}
          during integration tests.
        </p>
      </article>
    </ArticlePageShell>
  )
}
