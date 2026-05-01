'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function LogTimestampAnalysisClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · Logs</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Log timestamp analysis
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Parsing nginx, syslog, and JSON lines; normalizing to UTC before you correlate across regions.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Formats in the wild</h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>ISO-8601 with <code className="font-mono text-terminal-cyan">T</code> and <code className="font-mono text-terminal-cyan">Z</code></li>
          <li>Apache/NCSA with bracketed local time</li>
          <li>Epoch floats in structured JSON from Node or Go</li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Pipeline</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Grok/regex extract → parse with explicit locale/timezone → store epoch ms in a search index. Fail closed on
          ambiguous local strings during DST fall-back.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Regex sketch</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`^(?<ts>\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?Z)`}
        </pre>

        <p className="text-sm text-muted-foreground">
          <Link href="/tools/log-parser" className="text-terminal-green underline hover:no-underline">
            Log parser tool
          </Link>
          {' · '}
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Converter
          </Link>
        </p>
      </article>
    </ArticlePageShell>
  )
}
