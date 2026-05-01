'use client'

import { ArticlePageShell } from '@/components/ArticlePageShell'

const FORMATS = [
  {
    name: 'ISO 8601 / RFC 3339',
    example: '2026-04-22T14:30:00.000Z',
    usage: 'REST JSON, PostgreSQL timestamptz, OpenAPI datetime strings.',
  },
  {
    name: 'Unix seconds',
    example: '1713796200',
    usage: 'Redis TTL, JWT exp when integer seconds, many mobile clients.',
  },
  {
    name: 'Unix milliseconds',
    example: '1713796200123',
    usage: 'JavaScript Date, Elasticsearch @timestamp in ms mode.',
  },
  {
    name: 'HTTP-date (RFC 9110)',
    example: 'Wed, 22 Apr 2026 14:30:00 GMT',
    usage: 'Cache-Control / Last-Modified / Cookie expiry attributes.',
  },
  {
    name: 'Custom compact',
    example: '20260422143000',
    usage: 'Legacy batch files — avoid unless you control readers end-to-end.',
  },
] as const

export default function TimestampFormatsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Reference · Formats</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Timestamp string formats
        </h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Pick one canonical wire format per API surface, document timezone rules, and never mix seconds and
          milliseconds in the same field name without a suffix.
        </p>

        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Format</th>
                <th className="px-3 py-2">Example</th>
                <th className="px-3 py-2">Typical use</th>
              </tr>
            </thead>
            <tbody>
              {FORMATS.map((row) => (
                <tr key={row.name} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{row.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-terminal-cyan">{row.example}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">RFC 3339 profile tips</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Always include timezone offset or <code className="font-mono text-terminal-cyan">Z</code> for UTC. Prefer
          sub-second precision only when your clock source justifies it; truncate consistently on write.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`// Good: explicit Z
"2026-04-22T14:30:00.000Z"

// Risky: no offset (ambiguous for local wall times)
"2026-04-22T14:30:00"`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Naming fields</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Pair names with units: <code className="font-mono text-terminal-cyan">createdAtMs</code>,{' '}
          <code className="font-mono text-terminal-cyan">expiresAtS</code>, or use structured objects{' '}
          <code className="font-mono text-terminal-cyan">{"{ seconds, nanos }"}</code> to avoid silent scale bugs in
          client parsers.
        </p>
      </article>
    </ArticlePageShell>
  )
}
