'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function SessionManagementTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Blog · Security</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Session management and timestamp expiration
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          JWT <code className="font-mono text-terminal-cyan">exp</code>, refresh rotations, sliding
          sessions, and why “extend on activity” needs a server-side source of truth.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Unix time in tokens
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          JSON Web Tokens encode <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">iat</code>,{' '}
          <code className="font-mono text-terminal-cyan">nbf</code>, and{' '}
          <code className="font-mono text-terminal-cyan">exp</code> as NumericDate: seconds since
          1970-01-01T00:00:00Z. Always validate with a library that checks signature{' '}
          <em>before</em> interpreting claims, then compare against trusted server time — not the
          client wall clock.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Refresh token rotation
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Store refresh identifier hashed server-side with issued-at and family ID.</li>
          <li>On reuse of an old refresh, revoke the family — possible theft.</li>
          <li>Short access TTL (minutes); longer refresh TTL (days) with rotation on each use.</li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Sliding vs absolute sessions
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Sliding sessions update <code className="font-mono text-terminal-cyan">exp</code> on
          activity. Implement by reissuing a cookie with a new absolute expiry computed from{' '}
          <strong className="text-foreground">server now + idle budget</strong>, not by trusting
          “last click” timestamps from the browser alone.
        </p>

        <p className="text-sm text-muted-foreground">
          Validate epoch values quickly with the{' '}
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Unix timestamp converter
          </Link>
          .
        </p>
      </article>
    </ArticlePageShell>
  )
}
