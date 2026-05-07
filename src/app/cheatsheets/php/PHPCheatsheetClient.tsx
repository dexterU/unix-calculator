'use client'

import { Download, Printer } from 'lucide-react'
import { Header } from '@/components/Header'
import { CheatsheetPrintStyles, CodeBlock, Section } from '../CheatsheetUi'

export function PHPCheatsheetClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />

      <div className="sticky top-0 z-10 border-b border-terminal-border bg-terminal-surface print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">PHP Unix Timestamps Cheatsheet</p>
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
              <h1 className="font-mono text-2xl font-bold">PHP Unix Timestamps</h1>
              <p className="font-mono text-sm text-gray-600">Complete Reference Cheatsheet</p>
            </div>
            <p className="font-mono text-sm text-gray-500">unixcalculator.com/cheatsheets/php</p>
          </div>
        </div>

        <div className="mb-8 text-center print:hidden">
          <h1 className="mb-2 font-mono text-3xl font-bold text-foreground">PHP Timestamps Cheatsheet</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Every timestamp operation you need. Print or save as PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section title="Get Current Timestamp" color="cyan">
            <CodeBlock>{`<?php
// Unix seconds (integer)
time()
// → 1733529600

// Microtime (float)
microtime(true)
// → 1733529600.1234

// DateTime object
new DateTime('now', new DateTimeZone('UTC'))

// DateTimeImmutable (preferred in PHP 8+)
new DateTimeImmutable('now',
    new DateTimeZone('UTC'))

// Carbon (popular library)
// composer require nesbot/carbon
Carbon\\Carbon::now()
Carbon\\Carbon::now()->timestamp`}</CodeBlock>
          </Section>

          <Section title="Timestamp → Human Readable" color="green">
            <CodeBlock>{`<?php
$ts = 1733529600;

// Format Unix timestamp
date('Y-m-d H:i:s', $ts)
// → "2024-12-07 04:00:00"

// ISO 8601
date('c', $ts)
// → "2024-12-07T04:00:00+00:00"

date(DATE_ISO8601, $ts)
date(DATE_RFC2822, $ts)
date(DATE_ATOM, $ts)

// Via DateTime
$dt = new DateTime('@' . $ts);
$dt->format('Y-m-d H:i:s');

// UTC explicitly
$dt->setTimezone(new DateTimeZone('UTC'));
$dt->format('Y-m-d H:i:s T');`}</CodeBlock>
          </Section>

          <Section title="Date String → Timestamp" color="amber">
            <CodeBlock>{`<?php
// strtotime (simple, English strings)
strtotime('2024-12-07')
// → 1733529600

strtotime('2024-12-07 04:00:00 UTC')
strtotime('+1 hour')
strtotime('next Monday')
strtotime('last day of this month')

// DateTime → timestamp
$dt = new DateTime('2024-12-07T04:00:00Z');
$dt->getTimestamp();

// DateTimeImmutable (safer)
$dt = new DateTimeImmutable('2024-12-07',
    new DateTimeZone('UTC'));
$dt->getTimestamp();`}</CodeBlock>
          </Section>

          <Section title="Timezone Handling" color="purple">
            <CodeBlock>{`<?php
// Set default timezone
date_default_timezone_set('UTC');

// DateTime with timezone
$dt = new DateTime('now',
    new DateTimeZone('America/New_York'));

// Convert timezone
$dt->setTimezone(new DateTimeZone('Asia/Tokyo'));

// List timezones
DateTimeZone::listIdentifiers();

// Get offset
$dt->getOffset(); // seconds from UTC

// Format with timezone info
$dt->format('Y-m-d H:i:s T');
// → "2024-12-06 23:00:00 EST"

$dt->format('Y-m-d H:i:s P');
// → "2024-12-06 23:00:00 -05:00"`}</CodeBlock>
          </Section>

          <Section title="date() Format Codes" color="cyan">
            <CodeBlock>{`// Date
Y  // 4-digit year:    2024
y  // 2-digit year:    24
m  // Month (01-12):   12
n  // Month (1-12):    12 (no padding)
d  // Day (01-31):     07
j  // Day (1-31):      7 (no padding)

// Time
H  // Hour 24h (00-23): 04
G  // Hour 24h (0-23):  4 (no padding)
i  // Minutes (00-59):  00
s  // Seconds (00-59):  00
u  // Microseconds:     000000

// Other
U  // Unix timestamp:   1733529600
D  // Weekday abbrev:   Sat
l  // Weekday name:     Saturday
N  // ISO weekday:      6 (1=Mon)
W  // ISO week number:  49
t  // Days in month:    31
L  // Leap year:        0 or 1`}</CodeBlock>
          </Section>

          <Section title="Date Arithmetic" color="amber">
            <CodeBlock>{`<?php
$now = time();

// Add/subtract with timestamps
$ONE_HOUR  = 3600;
$ONE_DAY   = 86400;
$ONE_WEEK  = 604800;

$tomorrow  = $now + $ONE_DAY;
$lastWeek  = $now - $ONE_WEEK;

// With DateTime (more accurate for months/years)
$dt = new DateTimeImmutable('now',
    new DateTimeZone('UTC'));

$tomorrow  = $dt->modify('+1 day');
$nextMonth = $dt->modify('+1 month');
$lastYear  = $dt->modify('-1 year');

// Duration between two dates
$diff = $dt2->diff($dt1);
$diff->days;    // total days
$diff->h;       // hours component
$diff->i;       // minutes component`}</CodeBlock>
          </Section>

          <Section title="⚠️ Common Mistakes" color="red">
            <CodeBlock>{`<?php
// ✗ WRONG — date() uses server timezone!
date('Y-m-d H:i:s', $ts);
// ✓ RIGHT — always set UTC or specify timezone
date_default_timezone_set('UTC');
date('Y-m-d H:i:s', $ts);

// ✗ WRONG — strtotime can fail silently
$ts = strtotime('invalid');  // returns false!
// ✓ RIGHT — check return value
$ts = strtotime('2024-12-07');
if ($ts === false) { /* handle error */ }

// ✗ WRONG — DateTime mutates
$dt = new DateTime('now');
$future = $dt->modify('+1 day'); // mutates $dt!
// ✓ RIGHT — use DateTimeImmutable
$dt = new DateTimeImmutable('now');
$future = $dt->modify('+1 day'); // $dt unchanged

// ✗ WRONG — microtime() returns string
$ms = microtime();  // "0.12345600 1733529600"
// ✓ RIGHT — pass true for float
$ms = microtime(true);  // 1733529600.1234`}</CodeBlock>
          </Section>

          <Section title="Expiry & Validation" color="purple">
            <CodeBlock>{`<?php
$now = time();

// Check if timestamp is expired
function isExpired(int $ts): bool {
    return $ts < time();
}

// Check JWT expiry
$isExpired = $payload['exp'] < $now;
$timeLeft  = $payload['exp'] - $now;

// Create expiry timestamps
$ONE_HOUR   = 3600;
$SESSION_TTL = 30 * 60;  // 30 minutes
$expiry      = $now + $ONE_HOUR;

// Validate timestamp is reasonable
function isValidTimestamp(int $ts): bool {
    return $ts > 0 && $ts < PHP_INT_MAX;
}

// Relative time
function timeAgo(int $ts): string {
    $diff = time() - $ts;
    if ($diff < 60)   return 'just now';
    if ($diff < 3600) return floor($diff/60).'m ago';
    if ($diff < 86400)return floor($diff/3600).'h ago';
    return floor($diff/86400).'d ago';
}`}</CodeBlock>
          </Section>

          <Section title="Parsing Log Timestamps" color="green">
            <CodeBlock>{`<?php
// Apache/nginx log format
$log = "07/Dec/2024:04:00:00 +0000";
$dt = DateTime::createFromFormat(
    'd/M/Y:H:i:s O', $log
);
$ts = $dt->getTimestamp();

// ISO 8601
$dt = new DateTime('2024-12-07T04:00:00Z');
$ts = $dt->getTimestamp();

// Syslog format
$log = "Dec  7 04:00:00";
$dt = DateTime::createFromFormat(
    'M j H:i:s', $log
);

// MySQL datetime
$dt = new DateTime('2024-12-07 04:00:00',
    new DateTimeZone('UTC'));`}</CodeBlock>
          </Section>

          <Section title="Useful Constants & Patterns" color="cyan">
            <CodeBlock>{`<?php
// PHP date format constants
DATE_ATOM    // "2024-12-07T04:00:00+00:00"
DATE_ISO8601 // "2024-12-07T04:00:00+0000"
DATE_RFC2822 // "Sat, 07 Dec 2024 04:00:00 +0000"
DATE_RFC3339 // same as DATE_ATOM
DATE_COOKIE  // "Saturday, 07-Dec-2024 04:00:00 UTC"

// Integer limits
PHP_INT_MAX  // 9223372036854775807 (64-bit)
PHP_INT_SIZE // 8 (bytes on 64-bit)

// Time constants (not built-in — define yourself)
define('ONE_MINUTE', 60);
define('ONE_HOUR',   3600);
define('ONE_DAY',    86400);
define('ONE_WEEK',   604800);
define('Y2038',      2147483647);

// Check if year is leap
function isLeapYear(int $year): bool {
    return ($year % 4 === 0 && $year % 100 !== 0)
        || ($year % 400 === 0);
}`}</CodeBlock>
          </Section>
        </div>

        <div className="mt-8 border-t border-terminal-border pt-4 print:border-gray-300">
          <p className="text-center font-mono text-xs text-muted-foreground print:text-gray-500">
            unixcalculator.com · /cheatsheets · PHP reference
          </p>
        </div>
      </main>

      <CheatsheetPrintStyles />
    </div>
  )
}
