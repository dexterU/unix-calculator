'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function CalendarTimestampComponentsClient() {
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
          <span className="text-foreground/90">Calendar UI components</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · UI</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calendar UI components from Unix timestamps
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Persist selected ranges as UTC milliseconds or
          seconds, never as ambiguous <code className="font-mono text-terminal-cyan">MM/DD</code> strings. UI pickers
          should convert using an explicit IANA zone from user settings. Validate min/max using integer compares on epoch,
          not lexicographic string compares.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Data model pattern</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          React state often stores <code className="font-mono text-terminal-cyan">startMs</code> and{' '}
          <code className="font-mono text-terminal-cyan">endMs</code> exclusive for half-open intervals — document which
          convention you use to match backend SQL. For all-day events, some products store civil dates without times;
          represent them as starting at midnight in a chosen zone and convert carefully near DST.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Building a local day range</h2>
        <pre className="mb-4 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`function startOfLocalDayMs(year, monthIndex, day) {
  // monthIndex: JS convention 0-11
  return new Date(year, monthIndex, day, 0, 0, 0, 0).getTime();
}

function endOfLocalDayMs(year, monthIndex, day) {
  return new Date(year, monthIndex, day, 23, 59, 59, 999).getTime();
}`}
        </pre>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          For production, swap to Temporal or server-side normalization to avoid off-by-one when DST skips hours — QA
          should include the spring-forward weekend for affected zones.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Accessibility and validation</h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Associate labels with inputs; expose keyboard navigation on custom grids.</li>
          <li>
            Announce range updates via live regions only when necessary — too much chatter frustrates screen reader
            users.
          </li>
          <li>Block submission until start &lt; end in epoch space.</li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Wire format table</h2>
        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Layer</th>
                <th className="px-3 py-2">Recommended</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['React state', 'number ms UTC'],
                ['REST JSON', 'string RFC3339 or int seconds — pick one'],
                ['DB', 'timestamptz or bigint ms'],
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
          <li>Half-open intervals reduce double-booking bugs.</li>
          <li>Never trust the browser&apos;s default zone for persisted data.</li>
          <li>Use integration tests with frozen clocks for flaky date logic.</li>
          <li>Pair with{' '}
            <Link href="/tools/timestamp-converter" className="text-terminal-green underline">
              timestamp converter
            </Link>{' '}
            during design reviews.
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
