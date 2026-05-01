'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function JavaScriptTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · JavaScript</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unix timestamps in JavaScript
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          <code className="font-mono text-terminal-cyan">Date.now()</code>, seconds vs milliseconds, ISO strings, and a
          mental model for SSR and hydration.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Epoch units</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">Date.now()</code> returns milliseconds.
          Many Unix APIs expect <strong className="text-foreground">seconds</strong>. Divide or multiply by 1000 deliberately
          — don&apos;t infer from string length alone if input may be microseconds.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`const sec = Math.floor(Date.now() / 1000)
const d = new Date(sec * 1000)
d.toISOString()`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Intl for display
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Use <code className="font-mono text-terminal-cyan">Intl.DateTimeFormat</code> with an explicit{' '}
          <code className="font-mono text-terminal-cyan">timeZone</code> when showing wall time; keep storage in UTC.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Performance.now()</h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          Monotonic for deltas within a page load — <strong className="text-foreground">not</strong> comparable across
          sessions or suitable for persistence. Never ship <code className="font-mono text-terminal-cyan">performance.now()</code>{' '}
          as a user-visible timestamp.
        </p>

        <p className="text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Epoch converter
          </Link>{' '}
          for quick checks.
        </p>
      </article>
    </ArticlePageShell>
  )
}
