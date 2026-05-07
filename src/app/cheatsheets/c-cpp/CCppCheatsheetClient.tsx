'use client'

import { Download, Printer } from 'lucide-react'
import { Header } from '@/components/Header'
import { CheatsheetPrintStyles, CodeBlock, Section, TableBlock } from '../CheatsheetUi'

export function CCppCheatsheetClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />

      <div className="sticky top-0 z-10 border-b border-terminal-border bg-terminal-surface print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">C/C++ Unix Timestamps Cheatsheet</p>
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
              <h1 className="font-mono text-2xl font-bold">C/C++ Unix Timestamps</h1>
              <p className="font-mono text-sm text-gray-600">Complete Reference Cheatsheet</p>
            </div>
            <p className="font-mono text-sm text-gray-500">unixcalculator.com/cheatsheets/c-cpp</p>
          </div>
        </div>

        <div className="mb-8 text-center print:hidden">
          <h1 className="mb-2 font-mono text-3xl font-bold text-foreground">C/C++ Timestamps Cheatsheet</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Every timestamp operation you need. Print or save as PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section title="Get Current Timestamp" color="cyan">
            <CodeBlock>{`#include <time.h>

// Unix seconds (time_t)
time_t now = time(NULL);
// → 1733529600

// High-resolution (POSIX, preferred)
struct timespec ts;
clock_gettime(CLOCK_REALTIME, &ts);
ts.tv_sec;   // seconds
ts.tv_nsec;  // nanoseconds

// Monotonic (for timing, not wall clock)
clock_gettime(CLOCK_MONOTONIC, &ts);

// Legacy (deprecated in POSIX.1-2008)
struct timeval tv;
gettimeofday(&tv, NULL);
tv.tv_sec;   // seconds
tv.tv_usec;  // microseconds`}</CodeBlock>
          </Section>

          <Section title="Timestamp → struct tm" color="green">
            <CodeBlock>{`#include <time.h>

time_t ts = 1733529600;

// → UTC struct tm
struct tm *utc = gmtime(&ts);

// → Local time struct tm
struct tm *local = localtime(&ts);

// Thread-safe versions (preferred)
struct tm utc_r, local_r;
gmtime_r(&ts, &utc_r);
localtime_r(&ts, &local_r);

// struct tm fields:
// tm_year  years since 1900
// tm_mon   months since Jan (0-11)
// tm_mday  day of month (1-31)
// tm_hour  hours (0-23)
// tm_min   minutes (0-59)
// tm_sec   seconds (0-60, leap second)`}</CodeBlock>
          </Section>

          <Section title="struct tm → Timestamp" color="amber">
            <CodeBlock>{`#include <time.h>

struct tm t = {0};
t.tm_year = 124;  // 2024 - 1900
t.tm_mon  = 11;   // December (0-indexed)
t.tm_mday = 7;
t.tm_hour = 4;
t.tm_min  = 0;
t.tm_sec  = 0;

// UTC struct tm → time_t (POSIX)
time_t ts_utc = timegm(&t);

// Local struct tm → time_t
time_t ts_local = mktime(&t);
// Note: mktime uses LOCAL timezone!
// For UTC input use timegm() or set TZ=UTC`}</CodeBlock>
          </Section>

          <Section title="Formatting Timestamps" color="purple">
            <CodeBlock>{`#include <time.h>
#include <stdio.h>

time_t ts = 1733529600;
struct tm *t = gmtime(&ts);
char buf[64];

// strftime format codes
strftime(buf, sizeof(buf),
    "%Y-%m-%d", t);
// → "2024-12-07"

strftime(buf, sizeof(buf),
    "%Y-%m-%dT%H:%M:%SZ", t);
// → "2024-12-07T04:00:00Z"

strftime(buf, sizeof(buf),
    "%a, %d %b %Y %H:%M:%S GMT", t);
// → "Sat, 07 Dec 2024 04:00:00 GMT"

// Print directly
printf("%ld\\n", (long)ts);
printf("%.0f\\n", difftime(ts, 0));`}</CodeBlock>
          </Section>

          <Section title="strftime Format Codes" color="cyan">
            <TableBlock
              rows={[
                ['%Y', '4-digit year', '2024'],
                ['%y', '2-digit year', '24'],
                ['%m', 'Month (01-12)', '12'],
                ['%d', 'Day (01-31)', '07'],
                ['%H', 'Hour 24h (00-23)', '04'],
                ['%I', 'Hour 12h (01-12)', '04'],
                ['%M', 'Minutes (00-59)', '00'],
                ['%S', 'Seconds (00-60)', '00'],
                ['%Z', 'Timezone name', 'UTC'],
                ['%z', 'UTC offset', '+0000'],
                ['%A', 'Weekday name', 'Saturday'],
                ['%a', 'Weekday abbrev', 'Sat'],
                ['%B', 'Month name', 'December'],
                ['%b', 'Month abbrev', 'Dec'],
                ['%j', 'Day of year', '342'],
                ['%s', 'Unix ts (GNU ext.)', '1733529600'],
              ]}
            />
          </Section>

          <Section title="Date Arithmetic" color="amber">
            <CodeBlock>{`#include <time.h>

time_t now = time(NULL);

// Add time (seconds arithmetic)
time_t ONE_HOUR  = 3600;
time_t ONE_DAY   = 86400;
time_t ONE_WEEK  = 604800;

time_t tomorrow  = now + ONE_DAY;
time_t last_week = now - ONE_WEEK;

// Difference between timestamps
double diff = difftime(ts2, ts1);
// difftime returns double (seconds)

long days  = (long)diff / 86400;
long hours = ((long)diff % 86400) / 3600;

// Compare timestamps
if (ts1 < ts2) { /* ts1 is earlier */ }`}</CodeBlock>
          </Section>

          <Section title="⚠️ Common Mistakes" color="red">
            <CodeBlock>{`// ✗ WRONG — time_t is 32-bit on old systems
// Overflows on Jan 19, 2038
int32_t ts = time(NULL);  // DON'T DO THIS

// ✓ RIGHT — use time_t (64-bit on modern systems)
time_t ts = time(NULL);

// ✗ WRONG — localtime is not thread-safe
struct tm *t = localtime(&ts);  // shared buffer

// ✓ RIGHT — use thread-safe versions
struct tm t;
localtime_r(&ts, &t);

// ✗ WRONG — mktime assumes LOCAL timezone
// If struct tm is UTC, use timegm() not mktime()
time_t ts = mktime(&utc_tm);   // WRONG for UTC

// ✓ RIGHT
time_t ts = timegm(&utc_tm);   // POSIX only
// Or: setenv("TZ", "UTC", 1); tzset();`}</CodeBlock>
          </Section>

          <Section title="C++ chrono (Modern C++11+)" color="purple">
            <CodeBlock>{`#include <chrono>
using namespace std::chrono;

// Current time
auto now = system_clock::now();

// → Unix seconds
auto ts = duration_cast<seconds>(
    now.time_since_epoch()).count();

// → Unix milliseconds
auto ms = duration_cast<milliseconds>(
    now.time_since_epoch()).count();

// → Unix nanoseconds
auto ns = duration_cast<nanoseconds>(
    now.time_since_epoch()).count();

// Duration arithmetic
auto future = now + hours(1);
auto past   = now - days(7);    // C++20

// Duration between two times
auto diff = t2 - t1;
diff.count(); // in duration units`}</CodeBlock>
          </Section>

          <Section title="Parsing Timestamps" color="green">
            <CodeBlock>{`#include <time.h>
#include <stdio.h>

char buf[64];
struct tm t = {0};

// Parse ISO 8601
strptime("2024-12-07T04:00:00Z",
    "%Y-%m-%dT%H:%M:%SZ", &t);
time_t ts_iso = timegm(&t);

// Parse Unix timestamp string
long ts_long;
sscanf("1733529600", "%ld", &ts_long);
time_t ts_from_str = (time_t)ts_long;

// Parse custom format
strptime("07/Dec/2024:04:00:00 +0000",
    "%d/%b/%Y:%H:%M:%S %z", &t);`}</CodeBlock>
          </Section>

          <Section title="Useful Macros & Constants" color="cyan">
            <CodeBlock>{`#include <time.h>
#include <limits.h>

// Time constants (not in standard — define yourself)
#define ONE_MINUTE  60L
#define ONE_HOUR    3600L
#define ONE_DAY     86400L
#define ONE_WEEK    604800L
#define ONE_MONTH   2592000L    // 30 days
#define ONE_YEAR    31536000L   // 365 days

// Y2038 boundary
#define Y2038_LIMIT 2147483647L

// Check if 64-bit time_t (safe from Y2038)
#if LONG_MAX > 2147483647L
    // 64-bit time_t — Y2038 safe
#endif

// Epoch reference
time_t epoch = 0;  // 1970-01-01 00:00:00 UTC`}</CodeBlock>
          </Section>
        </div>

        <div className="mt-8 border-t border-terminal-border pt-4 print:border-gray-300">
          <p className="text-center font-mono text-xs text-muted-foreground print:text-gray-500">
            unixcalculator.com · /knowledge/c-cpp-unix-timestamps · /cheatsheets
          </p>
        </div>
      </main>

      <CheatsheetPrintStyles />
    </div>
  )
}
