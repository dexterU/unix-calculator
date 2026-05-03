'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'
import { NewsletterCapture } from '@/components/NewsletterCapture'

export default function CCppUnixTimestampsClient() {
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
          <span className="text-foreground/90">C/C++ Unix timestamps</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · Systems</p>
        <span className="rounded border border-terminal-border px-2 py-0.5 font-mono text-[10px] text-terminal-green">
          Reference
        </span>
        <h1 className="mb-6 mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          C and C++ Unix timestamps
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> On POSIX, read calendar time with{' '}
          <code className="font-mono text-terminal-cyan">time()</code> or high-resolution{' '}
          <code className="font-mono text-terminal-cyan">clock_gettime(CLOCK_REALTIME, &amp;ts)</code>. Break epochs into
          fields with <code className="font-mono text-terminal-cyan">gmtime_r</code>/<code className="font-mono text-terminal-cyan">localtime_r</code>, then format with{' '}
          <code className="font-mono text-terminal-cyan">strftime</code>. Never mix wall-clock and monotonic clocks when
          persisting user-visible timestamps. Audit <code className="font-mono text-terminal-cyan">time_t</code> width on
          embedded toolchains — 32-bit survives only until Y2038.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          time() vs clock_gettime() vs gettimeofday()
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <code className="font-mono text-terminal-cyan">time(3)</code> returns seconds since the epoch as{' '}
          <code className="font-mono text-terminal-cyan">time_t</code>. It is simple but offers no sub-second data.
          <code className="font-mono text-terminal-cyan">clock_gettime</code> provides seconds plus nanoseconds for{' '}
          <code className="font-mono text-terminal-cyan">CLOCK_REALTIME</code> (subject to NTP adjustments) or monotonic
          clocks for measuring intervals. <code className="font-mono text-terminal-cyan">gettimeofday</code> is legacy;
          POSIX labels it legacy — prefer <code className="font-mono text-terminal-cyan">clock_gettime</code> on new code.
          On Windows UCRT, use <code className="font-mono text-terminal-cyan">_time64</code> and friends when targeting
          64-bit epochs consistently.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">struct tm breakdown</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <code className="font-mono text-terminal-cyan">struct tm</code> holds calendar fields. Beware:{' '}
          <code className="font-mono text-terminal-cyan">tm_mon</code> is 0-based while <code className="font-mono text-terminal-cyan">tm_year</code> is years since 1900.
          Always zero the struct before use or call the *_r variants with an explicit result buffer for thread safety.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          strftime format codes (selected)
        </h2>
        <div className="mb-6 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['%Y', 'Four-digit year'],
                ['%m', 'Month 01–12'],
                ['%d', 'Day of month'],
                ['%H', 'Hour 00–23 (UTC with gmtime)'],
                ['%M', 'Minute'],
                ['%S', 'Second'],
                ['%z', 'Numeric timezone offset'],
                ['%Z', 'Timezone name (non-portable)'],
              ].map(([a, b]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-mono text-terminal-cyan">{a}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">POSIX vs Windows highlights</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          MSVC and MinGW differ on which POSIX functions are available without feature macros. When cross-compiling,
          centralize time access behind a small abstraction and unit-test DST transitions using recorded vectors.
          Filesystems may store NTFS times in 100-ns intervals — do not confuse those counters with Unix epoch without
          documented conversion.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Example: epoch to formatted UTC</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`#include <stdio.h>
#include <time.h>

int main(void) {
  time_t now = time(NULL);
  struct tm utc;
  gmtime_r(&now, &utc);
  char buf[64];
  strftime(buf, sizeof buf, "%Y-%m-%dT%H:%M:%SZ", &utc);
  puts(buf);
  return 0;
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Use *_r functions on POSIX for thread-safe field breakdown.</li>
          <li>Monotonic clocks measure duration; wall clocks answer &quot;what time is it?&quot;</li>
          <li>Verify time_t size in firmware builds; assume nothing.</li>
          <li>Prefer clock_gettime over gettimeofday for new code.</li>
          <li>Centralize Windows vs POSIX differences behind one module.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Last verified May
            2026.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Timestamp converter
          </Link>
        </p>

        <NewsletterCapture source="knowledge-cpp" />
      </article>
    </ArticlePageShell>
  )
}
