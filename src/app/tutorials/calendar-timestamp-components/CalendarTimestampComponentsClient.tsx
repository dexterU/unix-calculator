'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function CalendarTimestampComponentsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · UI</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calendar UI components from Unix timestamps
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Treat UTC epoch as the source of truth; project to local or IANA zones only at the edges of
          your form pipeline.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Data model</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Store <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">startMs</code> /{' '}
          <code className="font-mono text-terminal-cyan">endMs</code> as integers. When the user picks a
          day in <code className="font-mono text-terminal-cyan">&lt;input type="date"&gt;</code>, convert
          using an explicit timezone (usually <code className="font-mono text-terminal-cyan">Intl</code> or
          your backend) instead of relying on the browser&apos;s implicit local interpretation for storage.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Building a day range
        </h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`// user picked local calendar day → UTC epoch start of day
// Prefer Temporal or backend for DST edges in production
const localMidnight = new Date(year, month - 1, day)
const epochMs = localMidnight.getTime()`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Accessibility</h2>
        <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Expose <code className="font-mono text-terminal-cyan">aria-label</code> on icon-only controls.</li>
          <li>Pair visible labels with <code className="font-mono text-terminal-cyan">htmlFor</code> on inputs.</li>
          <li>Announce validation errors with <code className="font-mono text-terminal-cyan">role=&quot;alert&quot;</code>.</li>
        </ul>

        <p className="text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Convert sample instants
          </Link>{' '}
          while you wire your picker.
        </p>
      </article>
    </ArticlePageShell>
  )
}
