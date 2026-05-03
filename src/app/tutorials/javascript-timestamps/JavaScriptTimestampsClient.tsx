'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'
import { NewsletterCapture } from '@/components/NewsletterCapture'

export default function JavaScriptTimestampsClient() {
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
          <span className="text-foreground/90">JavaScript timestamps</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · JavaScript</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Unix timestamps in JavaScript</h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Use <code className="font-mono text-terminal-cyan">Date.now()</code> for
          UTC milliseconds since epoch, <code className="font-mono text-terminal-cyan">new Date()</code> for parsing, and{' '}
          <code className="font-mono text-terminal-cyan">performance.now()</code> only for monotonic deltas inside one page load. For new code,
          evaluate the Temporal proposal via polyfill for safer calendars; until then pair UTC milliseconds with explicit field names (
          <code className="font-mono text-terminal-cyan">createdAtMs</code>).
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Date.now() vs new Date() vs performance.now()
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <code className="font-mono text-terminal-cyan">Date.now()</code> mirrors the number inside a Date object for &quot;now&quot; and is
          stable for persistence as long as you stay below <code className="font-mono text-terminal-cyan">Number.MAX_SAFE_INTEGER</code>.{' '}
          <code className="font-mono text-terminal-cyan">new Date(isoString)</code> invokes the spec parsing algorithm — some ISO variants are
          implementation-dependent; always supply full offsets. <code className="font-mono text-terminal-cyan">performance.now()</code> starts at
          navigation and is not coupled to wall time; ideal for animation frames, wrong for databases.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`const ms = Date.now();
const d = new Date(ms);
console.log(d.toISOString());

const t0 = performance.now();
await fetch('/api/profile');
console.log(\`fetch ms (monotonic): \${(performance.now() - t0).toFixed(1)}\`);`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Temporal API direction</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Temporal separates absolute instants, time zones, and calendars. Polyfills such as{' '}
          <code className="font-mono text-terminal-cyan">@js-temporal/polyfill</code> let you experiment before full engine support. Adoption
          checklist: bundle size, SSR parity, and serialization format to your backend (often still RFC 3339 strings).
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`// npm i @js-temporal/polyfill
import { Temporal } from '@js-temporal/polyfill';

const inst = Temporal.Now.instant();
console.log(inst.epochMilliseconds);`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Intl.DateTimeFormat</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Tokyo',
  dateStyle: 'full',
  timeStyle: 'long',
});
console.log(fmt.format(new Date(1713794701123)));`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Common mistakes</h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            Month index starts at 0 in <code className="font-mono text-terminal-cyan">Date.UTC</code> and Date constructor.
          </li>
          <li>Parsing date-only strings may default to UTC vs local — specify behavior in lint rules.</li>
          <li>Mixing seconds and ms silently — enforce length or string prefixes in APIs.</li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Library comparison</h2>
        <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Library</th>
                <th className="px-3 py-2">Size / focus</th>
                <th className="px-3 py-2">Timezone</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['date-fns', 'Modular tree-shake', 'Use date-fns-tz companion'],
                ['Luxon', 'Rich API', 'First-class zones'],
                ['dayjs', 'Tiny core', 'plugin for timezone'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Always label persisted numbers with units; JS cannot do that for you.</li>
          <li>Prefer ISO strings on the wire when debugging; compact to ints only after validation.</li>
          <li>Temporal + polyfill is the long-term escape hatch from Date quirks.</li>
          <li>Server render: never assume client clock matches build server.</li>
          <li>Compare our{' '}
            <Link href="/blog/complete-guide-unix-timestamp-precision-2025" className="text-terminal-green underline">
              precision guide
            </Link>{' '}
            before expanding schema.
          </li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Last verified May
            2026.
          </p>
        </div>

        <NewsletterCapture source="tutorial-javascript" />
      </article>
    </ArticlePageShell>
  )
}
