'use client'

import { Download, Printer } from 'lucide-react'
import { Header } from '@/components/Header'
import { CheatsheetPrintStyles, CodeBlock, Section } from '../CheatsheetUi'

export function PythonCheatsheetClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />

      <div className="sticky top-0 z-10 border-b border-terminal-border bg-terminal-surface print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">Python Unix Timestamps Cheatsheet</p>
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
              <h1 className="font-mono text-2xl font-bold">Python Unix Timestamps</h1>
              <p className="font-mono text-sm text-gray-600">Complete Reference Cheatsheet</p>
            </div>
            <p className="font-mono text-sm text-gray-500">unixcalculator.com/cheatsheets/python</p>
          </div>
        </div>

        <div className="mb-8 text-center print:hidden">
          <h1 className="mb-2 font-mono text-3xl font-bold text-foreground">Python Timestamps Cheatsheet</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Every timestamp operation you need. Print or save as PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section title="Get Current Timestamp" color="cyan">
            <CodeBlock>{`import time
from datetime import datetime, timezone

# Unix seconds (float)
time.time()
# → 1733529600.123

# Unix seconds (integer)
int(time.time())
# → 1733529600

# datetime object (UTC)
datetime.now(timezone.utc)

# datetime object (local)
datetime.now()`}</CodeBlock>
          </Section>

          <Section title="Timestamp → datetime" color="green">
            <CodeBlock>{`from datetime import datetime, timezone

ts = 1733529600

# → UTC datetime
datetime.fromtimestamp(ts, tz=timezone.utc)

# → Local datetime  
datetime.fromtimestamp(ts)

# → ISO 8601 string
datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
# "2024-12-07T04:00:00+00:00"

# → Formatted string
datetime.fromtimestamp(ts, tz=timezone.utc) \\
    .strftime('%Y-%m-%d %H:%M:%S UTC')`}</CodeBlock>
          </Section>

          <Section title="datetime → Timestamp" color="amber">
            <CodeBlock>{`from datetime import datetime, timezone

# datetime → Unix seconds (MUST be UTC-aware)
dt = datetime(2024, 12, 7, 4, 0, 0, tzinfo=timezone.utc)
int(dt.timestamp())
# → 1733529600

# String → Unix seconds
dt = datetime.fromisoformat('2024-12-07T04:00:00+00:00')
int(dt.timestamp())

# Naive datetime (assume UTC) → timestamp
dt_naive = datetime(2024, 12, 7, 4, 0, 0)
int(dt_naive.replace(tzinfo=timezone.utc).timestamp())`}</CodeBlock>
          </Section>

          <Section title="Timezone Handling" color="purple">
            <CodeBlock>{`from datetime import datetime, timezone
import zoneinfo  # Python 3.9+

ts = 1733529600
utc_dt = datetime.fromtimestamp(ts, tz=timezone.utc)

# Convert to any timezone
ny_tz = zoneinfo.ZoneInfo('America/New_York')
ny_dt = utc_dt.astimezone(ny_tz)

# Python 3.8 and below — use pytz
# import pytz
# ny_tz = pytz.timezone('America/New_York')
# ny_dt = utc_dt.astimezone(ny_tz)

# Format with timezone name
ny_dt.strftime('%Y-%m-%d %H:%M:%S %Z')
# "2024-12-06 23:00:00 EST"`}</CodeBlock>
          </Section>

          <Section title="strftime Format Codes" color="cyan">
            <CodeBlock>{`# Common format codes
%Y  # 4-digit year:        2024
%m  # Month (01-12):       12
%d  # Day (01-31):         07
%H  # Hour 24h (00-23):    04
%I  # Hour 12h (01-12):    04
%M  # Minutes (00-59):     00
%S  # Seconds (00-59):     00
%f  # Microseconds:        000000
%Z  # Timezone name:       UTC
%z  # UTC offset:          +0000
%A  # Weekday name:        Saturday
%j  # Day of year:         342
%U  # Week number:         49

# Common patterns
'%Y-%m-%d'           # 2024-12-07
'%Y-%m-%dT%H:%M:%SZ' # ISO 8601 UTC
'%d/%m/%Y %H:%M'     # 07/12/2024 04:00`}</CodeBlock>
          </Section>

          <Section title="⚠️ Common Mistakes" color="red">
            <CodeBlock>{`import time
from datetime import datetime, timezone

# ✗ WRONG — naive datetime, timezone ambiguous
dt = datetime(2024, 12, 7, 4, 0, 0)
dt.timestamp()  # Assumes LOCAL time, not UTC!

# ✓ RIGHT — always add UTC timezone
dt = datetime(2024, 12, 7, 4, 0, 0, tzinfo=timezone.utc)
int(dt.timestamp())  # → 1733529600

# ✗ WRONG — time.time() is a float
ts = time.time()  # 1733529600.1234

# ✓ RIGHT — convert to int
ts = int(time.time())

# ✗ WRONG — utcnow() is deprecated in 3.12
# datetime.utcnow()

# ✓ RIGHT
datetime.now(timezone.utc)`}</CodeBlock>
          </Section>

          <Section title="Date Arithmetic" color="green">
            <CodeBlock>{`from datetime import datetime, timezone, timedelta

now = datetime.now(timezone.utc)

# Add/subtract time
tomorrow  = now + timedelta(days=1)
last_week = now - timedelta(weeks=1)
in_1_hour = now + timedelta(hours=1)

# Duration between two datetimes
delta = dt2 - dt1
delta.total_seconds()  # float
delta.days             # integer days

# Duration between two Unix timestamps
diff = ts2 - ts1  # seconds
days  = diff // 86400
hours = (diff % 86400) // 3600`}</CodeBlock>
          </Section>

          <Section title="Expiry Checks" color="amber">
            <CodeBlock>{`import time

now = int(time.time())

# Check JWT expiry
is_expired = payload['exp'] < now

# Time until expiry
seconds_left = payload['exp'] - now
minutes_left = seconds_left // 60

# Create expiry timestamps
ONE_HOUR = 3600
expiry   = now + ONE_HOUR

SESSION_TTL    = 30 * 60  # 30 minutes
session_expiry = now + SESSION_TTL
is_valid       = now < session_expiry`}</CodeBlock>
          </Section>

          <Section title="Parsing Common Formats" color="purple">
            <CodeBlock>{`from datetime import datetime

# ISO 8601
datetime.fromisoformat('2024-12-07T04:00:00+00:00')

# Custom format
datetime.strptime(
    '07/Dec/2024:04:00:00 +0000',
    '%d/%b/%Y:%H:%M:%S %z'
)

# Unix timestamp string → int
ts = int('1733529600')

# Apache/nginx log timestamp → epoch seconds
datetime.strptime(
    '07/Dec/2024:04:00:00 +0000',
    '%d/%b/%Y:%H:%M:%S %z'
).timestamp()`}</CodeBlock>
          </Section>

          <Section title="Useful Constants" color="cyan">
            <CodeBlock>{`import time
from datetime import datetime, timezone

ONE_MINUTE = 60
ONE_HOUR   = 3_600
ONE_DAY    = 86_400
ONE_WEEK   = 604_800
ONE_MONTH  = 2_592_000   # 30 days
ONE_YEAR   = 31_536_000  # 365 days

# Famous timestamps
UNIX_EPOCH  = 0           # 1970-01-01
Y2K         = 946684800   # 2000-01-01  
Y2038_LIMIT = 2147483647  # 2038-01-19

# Current timestamp
NOW = int(time.time())

# Is current year a leap year?
year = datetime.now(timezone.utc).year
is_leap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0`}</CodeBlock>
          </Section>
        </div>

        <div className="mt-8 border-t border-terminal-border pt-4 print:border-gray-300">
          <p className="text-center font-mono text-xs text-muted-foreground print:text-gray-500">
            unixcalculator.com — Free developer tools & timestamp reference · /tools/timestamp-api ·
            /tutorials/javascript-timestamps
          </p>
        </div>
      </main>

      <CheatsheetPrintStyles />
    </div>
  )
}
