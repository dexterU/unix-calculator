'use client'

import { ArticlePageShell } from '@/components/ArticlePageShell'

const LANG_LIMITS = [
  { language: 'JavaScript (ECMAScript)', type: 'Number (IEEE 64-bit)', precision: 'ms typical; > 2^53 unsafe for integers' },
  { language: 'Python 3', type: 'float / int / datetime', precision: 'μs in datetime; time.time() platform-dependent' },
  { language: 'Go', type: 'time.Time', precision: 'ns monotonic + wall' },
  { language: 'Java', type: 'java.time.Instant', precision: 'ns since epoch' },
  { language: 'Rust', type: 'SystemTime / chrono', precision: 'sub-ms OS-dependent' },
  { language: 'C / POSIX', type: 'time_t / timespec', precision: 'often s + ns field on modern libc' },
] as const

export default function TimestampPrecisionClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Reference · Precision</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Timestamp precision</h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Epoch counters look simple until you wire seconds, milliseconds, and sub-second fields across services. This
          page summarizes units, portability, and the 32-bit cliff.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Seconds vs milliseconds vs microseconds vs nanoseconds
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Seconds</strong> — POSIX <code className="font-mono text-terminal-cyan">time_t</code>, many JWT{' '}
            <code className="font-mono text-terminal-cyan">exp</code> fields, cron.
          </li>
          <li>
            <strong className="text-foreground">Milliseconds</strong> — JavaScript <code className="font-mono text-terminal-cyan">Date</code>, Kafka
            logical timestamps, browser <code className="font-mono text-terminal-cyan">performance.now()</code> anchors.
          </li>
          <li>
            <strong className="text-foreground">Microseconds</strong> — MySQL <code className="font-mono text-terminal-cyan">DATETIME(6)</code>,
            some RPC frameworks (<code className="font-mono text-terminal-cyan">google.protobuf.Timestamp</code> uses seconds + nanos).
          </li>
          <li>
            <strong className="text-foreground">Nanoseconds</strong> — Go, OpenTelemetry spans, kernel trace clocks; serialize as string or
            structured pair to avoid float rounding in JSON.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Language-specific precision (typical)
        </h2>
        <div className="mb-6 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Language</th>
                <th className="px-3 py-2">Primary type</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {LANG_LIMITS.map((row) => (
                <tr key={row.language} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{row.language}</td>
                  <td className="px-3 py-2 font-mono text-xs text-terminal-cyan">{row.type}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.precision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">The Year 2038 problem</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Signed 32-bit seconds overflow after <code className="font-mono text-terminal-cyan">2147483647</code> (
          <strong className="text-foreground">2038-01-19T03:14:07Z</strong> in many interpretations). Embedded systems,
          legacy file formats, and binary protocols still use 32-bit fields — migrate to 64-bit epoch seconds or
          fixed-point pairs with an explicit schema version.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">64-bit timestamp range</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          64-bit signed seconds covers roughly ±292 billion years from the epoch; practically unlimited for civil time.
          Nanosecond fields in 64 bits require pairing with a seconds field (as in protobuf) rather than a single
          combined integer in JSON Number space — use strings or two columns.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`# Largest signed 32-bit Unix second (illustration)
echo $((2147483647))

# Prefer storing migration boundary as explicit type width in schema
# created_at_s64 BIGINT  -- not INT`}
        </pre>
      </article>
    </ArticlePageShell>
  )
}
