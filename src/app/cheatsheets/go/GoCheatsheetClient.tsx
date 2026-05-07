'use client'

import { Download, Printer } from 'lucide-react'
import { Header } from '@/components/Header'
import { CheatsheetPrintStyles, CodeBlock, Section } from '../CheatsheetUi'

export function GoCheatsheetClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />

      <div className="sticky top-0 z-10 border-b border-terminal-border bg-terminal-surface print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">Go Unix Timestamps Cheatsheet</p>
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
              <h1 className="font-mono text-2xl font-bold">Go Unix Timestamps</h1>
              <p className="font-mono text-sm text-gray-600">Complete Reference Cheatsheet</p>
            </div>
            <p className="font-mono text-sm text-gray-500">unixcalculator.com/cheatsheets/go</p>
          </div>
        </div>

        <div className="mb-8 text-center print:hidden">
          <h1 className="mb-2 font-mono text-3xl font-bold text-foreground">Go Timestamps Cheatsheet</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Every timestamp operation you need. Print or save as PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section title="Get Current Timestamp" color="cyan">
            <CodeBlock>{`import "time"

// Unix seconds (int64)
time.Now().Unix()
// → 1733529600

// Unix milliseconds (int64)
time.Now().UnixMilli()
// → 1733529600000

// Unix microseconds (int64)
time.Now().UnixMicro()

// Unix nanoseconds (int64)
time.Now().UnixNano()
// → 1733529600000000000

// time.Time object
t := time.Now()
t.UTC() // convert to UTC`}</CodeBlock>
          </Section>

          <Section title="Timestamp → time.Time" color="green">
            <CodeBlock>{`// Unix seconds → time.Time
t := time.Unix(1733529600, 0)

// Unix milliseconds → time.Time
ms := int64(1733529600000)
t := time.UnixMilli(ms)

// Unix nanoseconds → time.Time
ns := int64(1733529600000000000)
t := time.Unix(0, ns)

// Always convert to UTC for storage
t.UTC()

// Format as ISO 8601
t.UTC().Format(time.RFC3339)
// → "2024-12-07T04:00:00Z"`}</CodeBlock>
          </Section>

          <Section title="time.Time → Timestamp" color="amber">
            <CodeBlock>{`t := time.Now()

// → Unix seconds
t.Unix()

// → Unix milliseconds  
t.UnixMilli()

// → Unix nanoseconds
t.UnixNano()

// String → time.Time → Unix
layout := "2006-01-02T15:04:05Z"
t, err := time.Parse(layout, "2024-12-07T04:00:00Z")
if err != nil { /* handle */ }
t.Unix() // → 1733529600`}</CodeBlock>
          </Section>

          <Section title="The Reference Time (CRITICAL)" color="red">
            <CodeBlock>{`// Go uses this EXACT reference time for formatting
// Mon Jan 2 15:04:05 MST 2006
// = 01/02 03:04:05PM '06 -0700

// Common format layouts
time.RFC3339      // "2006-01-02T15:04:05Z07:00"
time.RFC3339Nano  // with nanoseconds
time.RFC822       // "02 Jan 06 15:04 MST"
time.Kitchen      // "3:04PM"

// Custom formats use the reference time
t.Format("2006-01-02")         // → "2024-12-07"
t.Format("02/01/2006 15:04")   // → "07/12/2024 04:00"
t.Format("Jan 2, 2006")        // → "Dec 7, 2024"

// ✗ WRONG — these are NOT format strings
t.Format("YYYY-MM-DD")  // broken output
t.Format("yyyy/mm/dd")  // broken output`}</CodeBlock>
          </Section>

          <Section title="Timezone Handling" color="purple">
            <CodeBlock>{`// Load timezone
loc, err := time.LoadLocation("America/New_York")
if err != nil { /* handle */ }

// Convert UTC to timezone
utc := time.Unix(1733529600, 0).UTC()
eastern := utc.In(loc)

// Format with timezone
eastern.Format("2006-01-02 15:04:05 MST")
// → "2024-12-06 23:00:00 EST"

// Common locations
time.UTC
time.Local
// Load others with time.LoadLocation()

// Get offset
_, offset := eastern.Zone()
// offset in seconds from UTC`}</CodeBlock>
          </Section>

          <Section title="Date Arithmetic" color="cyan">
            <CodeBlock>{`t := time.Now()

// Add duration
tomorrow  := t.Add(24 * time.Hour)
nextWeek  := t.Add(7 * 24 * time.Hour)
in1Hour   := t.Add(time.Hour)
in30Mins  := t.Add(30 * time.Minute)

// Subtract
yesterday := t.Add(-24 * time.Hour)

// Duration between two times
diff := t2.Sub(t1)
diff.Hours()   // float64
diff.Minutes() // float64
diff.Seconds() // float64

// Between Unix timestamps
diffSec := ts2 - ts1
days  := diffSec / 86400
hours := (diffSec % 86400) / 3600`}</CodeBlock>
          </Section>

          <Section title="Expiry & Comparison" color="amber">
            <CodeBlock>{`now := time.Now()

// Compare times
t1.Before(t2)
t1.After(t2)
t1.Equal(t2)

// Check JWT expiry (exp is Unix seconds)
expTime := time.Unix(payload.Exp, 0)
isExpired := time.Now().After(expTime)

// Time until expiry
timeLeft := expTime.Sub(time.Now())
isExpiringSoon := timeLeft < 5*time.Minute

// Create expiry
expiry := time.Now().Add(time.Hour).Unix()`}</CodeBlock>
          </Section>

          <Section title="Parsing Common Formats" color="purple">
            <CodeBlock>{`import "strconv"

// RFC3339 (ISO 8601)
t, _ := time.Parse(time.RFC3339,
    "2024-12-07T04:00:00Z")

// Custom format
t, _ := time.Parse("2006-01-02 15:04:05",
    "2024-12-07 04:00:00")

// With timezone
t, _ := time.Parse("2006-01-02T15:04:05-07:00",
    "2024-12-06T23:00:00-05:00")

// Apache log format
t, _ := time.Parse("02/Jan/2006:15:04:05 -0700",
    "07/Dec/2024:04:00:00 +0000")

// Unix timestamp string
tsStr := "1733529600"
ts, _ := strconv.ParseInt(tsStr, 10, 64)
t := time.Unix(ts, 0)`}</CodeBlock>
          </Section>

          <Section title="⚠️ Common Mistakes" color="red">
            <CodeBlock>{`// ✗ WRONG — UnixNano overflows ~year 2262
t.UnixNano() // int64 max = ~year 2262
// ✓ RIGHT for far-future dates
t.Unix()     // seconds — safe for billions of years

// ✗ WRONG — time.Now() is local time
t := time.Now()
// ✓ RIGHT — always store UTC
t := time.Now().UTC()

// ✗ WRONG — format string uses wrong reference
t.Format("YYYY-MM-DD")
// ✓ RIGHT — Go uses 2006-01-02
t.Format("2006-01-02")

// ✗ WRONG — comparing wall clock to monotonic
// Use t.Round(0) to strip monotonic reading
t1.Round(0).Equal(t2.Round(0))`}</CodeBlock>
          </Section>

          <Section title="Useful Constants" color="cyan">
            <CodeBlock>{`// time.Duration constants
time.Nanosecond
time.Microsecond
time.Millisecond
time.Second      // = 1,000,000,000 nanoseconds
time.Minute      // = 60 * time.Second
time.Hour        // = 60 * time.Minute

// Compute longer durations
oneDay  := 24 * time.Hour
oneWeek := 7 * 24 * time.Hour

// Famous Unix timestamps
var (
    Y2K        = time.Unix(946684800, 0)
    Y2038Limit = time.Unix(2147483647, 0)
    UnixEpoch  = time.Unix(0, 0)
)

// Current in multiple formats
t := time.Now().UTC()
t.Unix()      // seconds
t.UnixMilli() // ms
t.UnixMicro() // µs
t.UnixNano()  // ns`}</CodeBlock>
          </Section>
        </div>

        <div className="mt-8 border-t border-terminal-border pt-4 print:border-gray-300">
          <p className="text-center font-mono text-xs text-muted-foreground print:text-gray-500">
            unixcalculator.com · /knowledge/golang-unix-timestamps · /tutorials/javascript-timestamps
          </p>
        </div>
      </main>

      <CheatsheetPrintStyles />
    </div>
  )
}
