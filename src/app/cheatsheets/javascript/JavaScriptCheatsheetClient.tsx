'use client'

import { Download, Printer } from 'lucide-react'
import { Header } from '@/components/Header'
import {
  CheatsheetPrintStyles,
  CodeBlock,
  Section,
  TableBlock,
} from '../CheatsheetUi'

export function JavaScriptCheatsheetClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />

      <div className="sticky top-0 z-10 border-b border-terminal-border bg-terminal-surface print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">JavaScript Unix Timestamps Cheatsheet</p>
            <p className="font-mono text-xs text-muted-foreground">Last updated May 2026</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              aria-label="Print cheatsheet"
              className="flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-surface px-4 py-2 font-mono text-sm transition-colors hover:border-terminal-green"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              aria-label="Download cheatsheet as PDF"
              className="flex items-center gap-2 rounded-lg bg-terminal-green px-4 py-2 font-mono text-sm font-bold text-terminal-bg transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="mb-6 hidden border-b border-gray-300 pb-4 print:block">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-mono text-2xl font-bold">JavaScript Unix Timestamps</h1>
              <p className="font-mono text-sm text-gray-600">Complete Reference Cheatsheet</p>
            </div>
            <p className="font-mono text-sm text-gray-500">unixcalculator.com/cheatsheets/javascript</p>
          </div>
        </div>

        <div className="mb-8 text-center print:hidden">
          <h1 className="mb-2 font-mono text-3xl font-bold text-foreground">JavaScript Timestamps Cheatsheet</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Every timestamp operation you need. Print or save as PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section title="Get Current Timestamp" color="cyan">
            <CodeBlock lang="js">{`// Unix seconds (integer)
Math.floor(Date.now() / 1000)
// → 1733529600

// Unix milliseconds
Date.now()
// → 1733529600000

// As Date object
new Date()
// → Sat Dec 07 2024...

// High resolution (not Unix)
performance.now()
// → 1234.567 (ms since page load)`}</CodeBlock>
          </Section>

          <Section title="Timestamp → Human Readable" color="green">
            <CodeBlock lang="js">{`// Seconds → Date object
new Date(ts * 1000)

// Milliseconds → Date object  
new Date(tsMs)

// → ISO 8601 string
new Date(ts * 1000).toISOString()
// "2024-12-07T04:00:00.000Z"

// → UTC string
new Date(ts * 1000).toUTCString()
// "Sat, 07 Dec 2024 04:00:00 GMT"

// → Local string
new Date(ts * 1000).toLocaleString()`}</CodeBlock>
          </Section>

          <Section title="Date → Timestamp" color="amber">
            <CodeBlock lang="js">{`// Date string → Unix seconds
Math.floor(new Date('2024-12-07').getTime() / 1000)
// → 1733529600

// Date object → Unix seconds
Math.floor(someDate.getTime() / 1000)

// ISO string → Unix ms
new Date('2024-12-07T04:00:00Z').getTime()
// → 1733529600000

// Specific date → Unix seconds
Math.floor(new Date(2024, 11, 7).getTime() / 1000)
// Note: month is 0-indexed! Dec = 11`}</CodeBlock>
          </Section>

          <Section title="Timezone-Aware Formatting" color="purple">
            <CodeBlock lang="js">{`const date = new Date(1733529600 * 1000);

// Intl.DateTimeFormat (recommended)
new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long',
}).format(date)

// Multiple timezones
['UTC','America/New_York','Asia/Tokyo']
  .map(tz => ({
    tz,
    time: date.toLocaleString('en-US', { timeZone: tz })
  }))`}</CodeBlock>
          </Section>

          <Section title="Date Arithmetic" color="cyan">
            <CodeBlock lang="js">{`const now = Math.floor(Date.now() / 1000);

// Add time (in seconds)
const ONE_HOUR  = 3600;
const ONE_DAY   = 86400;
const ONE_WEEK  = 604800;
const ONE_MONTH = 2592000; // ~30 days

const tomorrow = now + ONE_DAY;
const lastWeek = now - ONE_WEEK;

// Duration between two timestamps
const diff = ts2 - ts1; // seconds
const days  = Math.floor(diff / 86400);
const hours = Math.floor((diff % 86400) / 3600);
const mins  = Math.floor((diff % 3600) / 60);`}</CodeBlock>
          </Section>

          <Section title="⚠️ Common Mistakes" color="red">
            <CodeBlock lang="js">{`// ✗ WRONG — date shows 1970
new Date(1733529600)
// ✓ RIGHT — multiply seconds by 1000
new Date(1733529600 * 1000)

// ✗ WRONG — month 12 = January next year
new Date(2024, 12, 1)
// ✓ RIGHT — December = 11
new Date(2024, 11, 1)

// ✗ WRONG — float loses precision at huge scales
const ts = parseFloat("1733529600.999")
// ✓ RIGHT — use BigInt for nanoseconds-scale literals
const ns = BigInt("1733529600999000000")`}</CodeBlock>
          </Section>

          <Section title="Format Quick Reference" color="green">
            <TableBlock
              rows={[
                ['10 digits', 'Seconds', '1733529600'],
                ['13 digits', 'Milliseconds', '1733529600000'],
                ['16 digits', 'Microseconds', '1733529600000000'],
                ['19 digits', 'Nanoseconds', '1733529600000000000'],
              ]}
            />
            <CodeBlock lang="js">{`// Auto-detect format
function detectFormat(ts) {
  const d = String(Math.abs(ts)).replace('.','').length
  if (d <= 10) return 'seconds'
  if (d <= 13) return 'milliseconds'
  if (d <= 16) return 'microseconds'
  return 'nanoseconds'
}`}</CodeBlock>
          </Section>

          <Section title="JWT / Session Expiry" color="amber">
            <CodeBlock lang="js">{`const now = Math.floor(Date.now() / 1000);

// Check if token is expired
const isExpired = payload.exp < now;

// Time until expiry
const secondsLeft = payload.exp - now;
const isExpiringSoon = secondsLeft < 300; // 5 min

// Create expiry timestamp
const expiry = now + 3600; // 1 hour from now

// Session timeout
const SESSION_TTL = 30 * 60; // 30 minutes
const sessionExpiry = now + SESSION_TTL;
const isSessionValid = now < sessionExpiry;`}</CodeBlock>
          </Section>

          <Section title="Relative Time Display" color="purple">
            <CodeBlock lang="js">{`function timeAgo(ts) {
  const diff = Math.floor(Date.now()/1000) - ts;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400)return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}

// Or use Intl.RelativeTimeFormat
const rtf = new Intl.RelativeTimeFormat('en');
rtf.format(-1, 'day')   // "1 day ago"
rtf.format(2, 'hour')   // "in 2 hours"`}</CodeBlock>
          </Section>

          <Section title="Useful Constants" color="cyan">
            <CodeBlock lang="js">{`const SECOND = 1;
const MINUTE = 60;
const HOUR   = 3_600;
const DAY    = 86_400;
const WEEK   = 604_800;
const MONTH  = 2_592_000;  // 30 days
const YEAR   = 31_536_000; // 365 days

// Famous timestamps
const UNIX_EPOCH  = 0;          // 1970-01-01
const Y2K         = 946684800;  // 2000-01-01
const Y2038_LIMIT = 2147483647; // 2038-01-19
const MAX_SAFE_MS = Number.MAX_SAFE_INTEGER;
// = 9007199254740991`}</CodeBlock>
          </Section>
        </div>

        <div className="mt-8 border-t border-terminal-border pt-4 print:border-gray-300">
          <p className="text-center font-mono text-xs text-muted-foreground print:text-gray-500">
            unixcalculator.com — Free developer tools & timestamp reference · /tools/timestamp-debugger ·
            /tools/jwt-decoder
          </p>
        </div>
      </main>

      <CheatsheetPrintStyles />
    </div>
  )
}
