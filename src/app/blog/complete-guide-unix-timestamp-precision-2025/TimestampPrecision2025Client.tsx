'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function TimestampPrecision2025Client() {
  return (
    <ArticlePageShell>
      <article>
        <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-terminal-green">
            Home
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <Link href="/blog" className="hover:text-terminal-green">
            Blog
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">Unix timestamp precision</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Blog · Deep dive</p>
        <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="rounded border border-terminal-border px-2 py-0.5 text-terminal-green">Deep Dive</span>
          <span>12 min read</span>
          <span>·</span>
          <span>Unix Calculator Editorial Team</span>
          <span>·</span>
          <span>May 1, 2026</span>
        </div>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Complete Guide to Unix Timestamp Precision in 2026
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Unix timestamps are stored as integers counting
          seconds since January 1, 1970 UTC. Most modern systems use 64-bit integers (often with separate nanosecond
          fields), but JavaScript&apos;s <code className="font-mono text-terminal-cyan">Date</code> object is limited
          to millisecond precision. To avoid precision loss: store instants as 64-bit integers or fixed-width decimals,
          never as binary floats; name fields with explicit units (<code className="font-mono text-terminal-cyan">*_ms</code>,{' '}
          <code className="font-mono text-terminal-cyan">*_s</code>); and document whether leap seconds are modeled.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          What Is Unix Timestamp Precision?
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          &quot;Precision&quot; here means how finely an instant can be represented without rounding. At the storage
          layer you will see epoch <em>seconds</em> (roughly ten digits right now), <em>milliseconds</em> (thirteen
          digits), <em>microseconds</em> (sixteen digits), or <em>nanoseconds</em> (nineteen digits) past the same
          origin. The trap is not the digit count — it is <strong className="text-foreground">silent conversion</strong>{' '}
          between those layers: JSON numbers are IEEE doubles, which cannot represent every 64-bit integer; ORMs may
          coerce database <code className="font-mono text-terminal-cyan">TIMESTAMP</code> to floats; and mobile SDKs
          sometimes truncate to seconds for battery. Your API contract should specify both the type and the unit.
        </p>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          POSIX time itself counts seconds while excluding leap seconds from the usual integer timeline, so two different
          UTC human strings can map to the same <code className="font-mono text-terminal-cyan">time_t</code> on some
          systems. For observability data and finance you often need TAI-traceable policies — but for most REST and
          mobile apps, documenting &quot;UTC epoch milliseconds&quot; and sticking to it beats theoretical purity that
          your clients cannot implement consistently.
        </p>

        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Format</th>
                <th className="px-3 py-2">Digits</th>
                <th className="px-3 py-2">Example</th>
                <th className="px-3 py-2">Typical default</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Seconds', '10', '1733569200', 'Python time.time(), C time(), Redis INCR TTL'],
                ['Milliseconds', '13', '1733569200000', 'JavaScript Date.now(), Kafka logAppendTimeMs'],
                ['Microseconds', '16', '1733569200000000', 'PostgreSQL TIMESTAMPTZ, Python fromtimestamp'],
                ['Nanoseconds', '19', '1733569200000000000', 'Go time.Now().UnixNano(), Java Instant'],
              ].map(([a, b, c, d]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                  <td className="px-3 py-2 font-mono text-terminal-cyan">{b}</td>
                  <td className="px-3 py-2 font-mono text-xs text-terminal-cyan">{c}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          The JavaScript Precision Problem
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <code className="font-mono text-terminal-cyan">Date.now()</code> returns milliseconds as a double. For current
          epochs that fits integer semantics, but the real limit is <code className="font-mono text-terminal-cyan">Number.MAX_SAFE_INTEGER</code>{' '}
          (2<sup>53</sup>−1). Anything that multiplies microseconds into a single JS number will silently lose bits. If
          you ingest high-resolution metrics from the browser, ship them as strings or BigInt with explicit units, not as
          naked <code className="font-mono text-terminal-cyan">number</code>.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`// JavaScript is limited to millisecond Date resolution
const ts = Date.now(); // e.g. 1733569200123 (ms)
const tsSeconds = Math.floor(ts / 1000); // 1733569200

// WRONG — IEEE float cannot hold every µs exactly at scale
const bad = parseFloat('1733569200.123456');

// RIGHT — keep wide integers as BigInt (microseconds example)
const good = BigInt('1733569200123456');`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Precision Loss in Database Storage
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Databases lie in the marketing brochure. MySQL <code className="font-mono text-terminal-cyan">TIMESTAMP</code>{' '}
          has different range and behavior than <code className="font-mono text-terminal-cyan">DATETIME(6)</code>.
          PostgreSQL <code className="font-mono text-terminal-cyan">TIMESTAMPTZ</code> stores microseconds; forcing that
          through a 32-bit Unix column in an ORM mapper drops resolution. Always align ORM field types with migration
          files — a classic bug is dev environment using 64-bit epoch BIGINT while staging still has INTEGER.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`-- PostgreSQL: TIMESTAMPTZ stores microsecond resolution
SELECT EXTRACT(EPOCH FROM NOW()); -- 1733569200.123456

-- MySQL: TIMESTAMP has timezone quirks; DATETIME(6) keeps fractional seconds
SELECT UNIX_TIMESTAMP(NOW(6)); -- 1733569200.123456

-- Anti-pattern: INTEGER epoch seconds for trading audit where you need µs
-- Prefer BIGINT for milliseconds, or NUMERIC(20,6) when SQL math must be exact`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">The Y2038 Problem</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Signed 32-bit <code className="font-mono text-terminal-cyan">time_t</code> maxes at 2,147,483,647 —{' '}
          <strong className="text-foreground">2038-01-19 03:14:07 UTC</strong> in the usual encoding. Legacy embedded
          devices, old file formats, and forgotten PHP extensions still compile with 32-bit fields. After overflow, times
          wrap to 1901-style representations or error codes depending on libc. The fix is boring and expensive:
          widen to 64-bit seconds (good for billions of years) or use native temporal types that already migrated.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`import struct
# 32-bit signed max
max_32bit = 2**31 - 1  # 2147483647
print(max_32bit)

import sys
print(sys.maxsize)  # 9223372036854775807 on 64-bit CPython — not the same as time_t, but illustrates headroom`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Best Practices for Timestamp Precision
        </h2>
        <ol className="mb-6 list-decimal space-y-2 pl-6 text-muted-foreground">
          <li>Prefer integers or DECIMAL over float for stored instants.</li>
          <li>Agree on precision at ingress (API gateway) and reject ambiguous payloads.</li>
          <li>Store UTC; render with IANA zones using well-tested libraries.</li>
          <li>Use database-native temporal types when you need DST-safe civil times.</li>
          <li>Publish OpenAPI/Proto field comments that state units explicitly.</li>
        </ol>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>JavaScript caps practical Date resolution at milliseconds; large integers need BigInt or strings.</li>
          <li>JSON numbers are floats — never rely on them for nanosecond audit trails.</li>
          <li>MySQL vs Postgres fractional-second behavior differs; verify with EXTRACT(EPOCH).</li>
          <li>Y2038 is still shipping in firmware; audit any 32-bit epoch column.</li>
          <li>Name fields with units and version your schema when changing precision.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Senior Unix/Linux
            Engineers. Last verified May 2026.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Cross-check values with the{' '}
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            timestamp converter
          </Link>{' '}
          before migrating columns.
        </p>
      </article>
    </ArticlePageShell>
  )
}
