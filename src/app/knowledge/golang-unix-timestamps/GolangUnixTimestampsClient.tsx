'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'
import { NewsletterCapture } from '@/components/NewsletterCapture'

export default function GolangUnixTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-terminal-green">
            Home
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <Link href="/knowledge" className="hover:text-terminal-green">
            Knowledge
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">Go Unix timestamps</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · Go</p>
        <span className="rounded border border-terminal-border px-2 py-0.5 font-mono text-[10px] text-terminal-green">
          Reference
        </span>
        <h1 className="mb-6 mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Go Unix timestamps (<code className="font-mono text-xl text-terminal-cyan">time.Time</code>)
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong>{' '}
          <code className="font-mono text-terminal-cyan">time.Now()</code> returns a <code className="font-mono text-terminal-cyan">time.Time</code> with
          both wall and monotonic readings. Convert to Unix seconds with <code className="font-mono text-terminal-cyan">Unix()</code>, to nanoseconds
          with <code className="font-mono text-terminal-cyan">UnixNano()</code> (watch overflow outside roughly ±292 years). Parse layouts using the
          reference time <code className="font-mono text-terminal-cyan">Mon Jan 2 15:04:05 MST 2006</code>. For zones, use{' '}
          <code className="font-mono text-terminal-cyan">time.LoadLocation</code> and convert to UTC before storage.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          time.Now, time.Unix, UnixNano
        </h2>
        <pre className="mb-4 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`now := time.Now().UTC()
fmt.Println(now.Unix())
fmt.Println(now.UnixMilli())
fmt.Println(now.UnixMicro())
fmt.Println(now.UnixNano())

t := time.Unix(1713794701, 500_000_000) // 500ms fractional
fmt.Println(t.UTC().Format(time.RFC3339Nano))`}
        </pre>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          <code className="font-mono text-terminal-cyan">UnixNano</code> cannot represent every instant near far-future
          dates because the result does not fit int64 — for extreme simulations, stay in <code className="font-mono text-terminal-cyan">time.Time</code>{' '}
          or use big integers with explicit units.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">time.Time vs int64</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Passing bare <code className="font-mono text-terminal-cyan">int64</code> epochs across packages loses type
          safety. Wrapper types (<code className="font-mono text-terminal-cyan">type EpochSec int64</code>) or protobuf{' '}
          <code className="font-mono text-terminal-cyan">google.protobuf.Timestamp</code> communicate intent. Remember JSON
          marshaling: <code className="font-mono text-terminal-cyan">encoding/json</code> on <code className="font-mono text-terminal-cyan">time.Time</code>{' '}
          emits RFC3339 strings by default — customize if you need numeric epochs.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Parsing with time.Parse</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`const layout = "2006-01-02 15:04:05"
s := "2026-04-22 14:05:01"
t, err := time.ParseInLocation(layout, s, time.UTC)
if err != nil { log.Fatal(err) }

// Reference minute for fractional layouts
ref := "Jan 2 15:04:05.000000000 2006 MST"
t2, _ := time.Parse(ref, "Apr 22 14:05:01.123456789 2026 UTC")`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">time.Duration arithmetic</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Durations are nanosecond-resolution signed values but should be created with helpers{' '}
          <code className="font-mono text-terminal-cyan">time.Hour * 3</code> to avoid magic numbers. Subtracting{' '}
          <code className="font-mono text-terminal-cyan">time.Time</code> values uses monotonic data when available — do
          not persist durations derived from skewed wall adjustments as authoritative TTLs without context.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`start := time.Now()
// work ...
elapsed := time.Since(start)
if elapsed > 1500*time.Millisecond {
    log.Println("slow path")
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">IANA zones with LoadLocation</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`loc, err := time.LoadLocation("America/New_York")
if err != nil { log.Fatal(err) }
local := time.Date(2026, time.April, 22, 9, 5, 0, 0, loc)
utc := local.UTC()
fmt.Println(utc.Unix())`}
        </pre>

        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">API</th>
                <th className="px-3 py-2">Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Now + UTC()', 'Authoritative server stamps for logs'],
                ['ParseInLocation', 'User-entered local civil times'],
                ['UnixMilli in JSON', 'Interops with JavaScript Date'],
                ['Since/Until', 'SLA timers and rate buckets'],
              ].map(([a, b]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-mono text-terminal-cyan">{a}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Serialize with explicit intent: string RFC3339 vs int epoch.</li>
          <li>Watch JSON defaults — consumers may assume milliseconds.</li>
          <li>Monotonic subtraction differs from wall-only math after NTP steps.</li>
          <li>Load IANA zones from OS database; embed tzdata in static binaries when needed.</li>
          <li>Test DST boundaries with table-driven cases from zoneinfo.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Last verified May
            2026.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Converter
          </Link>
        </p>

        <NewsletterCapture source="knowledge-golang" />
      </article>
    </ArticlePageShell>
  )
}
