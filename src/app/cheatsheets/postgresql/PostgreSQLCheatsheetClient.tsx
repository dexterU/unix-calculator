'use client'

import { Download, Printer } from 'lucide-react'
import { Header } from '@/components/Header'
import { CheatsheetPrintStyles, CodeBlock, Section } from '../CheatsheetUi'

export function PostgreSQLCheatsheetClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />

      <div className="sticky top-0 z-10 border-b border-terminal-border bg-terminal-surface print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">PostgreSQL Timestamps Cheatsheet</p>
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
              <h1 className="font-mono text-2xl font-bold">PostgreSQL Timestamps</h1>
              <p className="font-mono text-sm text-gray-600">Complete Reference Cheatsheet</p>
            </div>
            <p className="font-mono text-sm text-gray-500">unixcalculator.com/cheatsheets/postgresql</p>
          </div>
        </div>

        <div className="mb-8 text-center print:hidden">
          <h1 className="mb-2 font-mono text-3xl font-bold text-foreground">PostgreSQL Timestamps Cheatsheet</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Every timestamp operation you need. Print or save as PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section title="Timestamp Types" color="cyan">
            <CodeBlock>{`-- TIMESTAMPTZ (recommended — stores UTC)
created_at TIMESTAMPTZ DEFAULT NOW()

-- TIMESTAMP (no timezone — avoid for apps)
created_at TIMESTAMP  -- timezone-naive!

-- DATE (date only, no time)
birth_date DATE

-- TIME / TIMETZ
event_time TIMETZ

-- Key difference:
-- TIMESTAMPTZ: stored as UTC, displayed in session tz
-- TIMESTAMP: stored as-is, no timezone conversion
-- ALWAYS prefer TIMESTAMPTZ for app timestamps`}</CodeBlock>
          </Section>

          <Section title="Get Current Timestamp" color="green">
            <CodeBlock>{`-- Current timestamp with timezone
NOW()                    -- TIMESTAMPTZ
CURRENT_TIMESTAMP        -- same as NOW()
TRANSACTION_TIMESTAMP()  -- start of transaction
STATEMENT_TIMESTAMP()    -- start of statement
CLOCK_TIMESTAMP()        -- actual current time

-- Current Unix timestamp (seconds)
EXTRACT(EPOCH FROM NOW())
-- → 1733529600.123456

-- Current Unix timestamp (integer)
FLOOR(EXTRACT(EPOCH FROM NOW()))::BIGINT

-- Current date / time only
CURRENT_DATE   -- → 2024-12-07
CURRENT_TIME   -- → 04:00:00+00`}</CodeBlock>
          </Section>

          <Section title="Unix Timestamp ↔ TIMESTAMPTZ" color="amber">
            <CodeBlock>{`-- Unix seconds → TIMESTAMPTZ
SELECT to_timestamp(1733529600);
-- → 2024-12-07 04:00:00+00

-- Unix milliseconds → TIMESTAMPTZ
SELECT to_timestamp(1733529600000 / 1000.0);

-- TIMESTAMPTZ → Unix seconds
SELECT EXTRACT(EPOCH FROM NOW())::BIGINT;

-- TIMESTAMPTZ → Unix milliseconds
SELECT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;

-- String → TIMESTAMPTZ
SELECT '2024-12-07T04:00:00Z'::TIMESTAMPTZ;
SELECT TO_TIMESTAMP('2024-12-07', 'YYYY-MM-DD');`}</CodeBlock>
          </Section>

          <Section title="Timezone Handling" color="purple">
            <CodeBlock>{`-- Set session timezone
SET timezone = 'America/New_York';

-- Convert to specific timezone
SELECT NOW() AT TIME ZONE 'America/New_York';

-- Store as UTC, display in any timezone
SELECT created_at AT TIME ZONE 'Asia/Tokyo'
FROM events;

-- List available timezones
SELECT * FROM pg_timezone_names LIMIT 20;

-- AT TIME ZONE behavior:
-- TIMESTAMPTZ AT TIME ZONE → TIMESTAMP (no tz)
-- TIMESTAMP AT TIME ZONE → TIMESTAMPTZ`}</CodeBlock>
          </Section>

          <Section title="EXTRACT & date_part" color="cyan">
            <CodeBlock>{`SELECT EXTRACT(EPOCH   FROM NOW()); -- Unix ts
SELECT EXTRACT(YEAR    FROM NOW()); -- 2024
SELECT EXTRACT(MONTH   FROM NOW()); -- 12
SELECT EXTRACT(DAY     FROM NOW()); -- 7
SELECT EXTRACT(HOUR    FROM NOW()); -- 4
SELECT EXTRACT(MINUTE  FROM NOW()); -- 0
SELECT EXTRACT(SECOND  FROM NOW()); -- 0.123
SELECT EXTRACT(DOW     FROM NOW()); -- 0=Sun..6=Sat
SELECT EXTRACT(DOY     FROM NOW()); -- 342
SELECT EXTRACT(WEEK    FROM NOW()); -- ISO week 49
SELECT EXTRACT(QUARTER FROM NOW()); -- 4

-- date_part() is equivalent (older syntax)
SELECT date_part('epoch', NOW());`}</CodeBlock>
          </Section>

          <Section title="Date Arithmetic" color="amber">
            <CodeBlock>{`-- Add/subtract intervals
NOW() + INTERVAL '1 hour'
NOW() + INTERVAL '7 days'
NOW() - INTERVAL '30 minutes'
NOW() + INTERVAL '1 year 2 months 3 days'

-- Duration between timestamps
ts2 - ts1  -- returns INTERVAL
EXTRACT(EPOCH FROM (ts2 - ts1))  -- seconds

-- Truncate to time boundary
date_trunc('hour',  NOW())  -- 2024-12-07 04:00
date_trunc('day',   NOW())  -- 2024-12-07 00:00
date_trunc('month', NOW())  -- 2024-12-01 00:00
date_trunc('year',  NOW())  -- 2024-01-01 00:00
date_trunc('week',  NOW())  -- Monday of week`}</CodeBlock>
          </Section>

          <Section title="Indexing Timestamps" color="purple">
            <CodeBlock>{`-- Always index timestamp columns
CREATE INDEX idx_events_created
ON events(created_at);

-- Partial index for recent data
CREATE INDEX idx_events_recent
ON events(created_at)
WHERE created_at > NOW() - INTERVAL '90 days';

-- Functional index for date queries
CREATE INDEX idx_events_date
ON events(date_trunc('day', created_at));

-- BRIN index for time-series (large tables)
CREATE INDEX idx_events_brin
ON events USING BRIN (created_at);`}</CodeBlock>
          </Section>

          <Section title="⚠️ Common Mistakes" color="red">
            <CodeBlock>{`-- ✗ WRONG — TIMESTAMP loses timezone
created_at TIMESTAMP DEFAULT NOW()

-- ✓ RIGHT
created_at TIMESTAMPTZ DEFAULT NOW()

-- ✗ WRONG — comparing TIMESTAMP to TIMESTAMPTZ
WHERE created_at > '2024-01-01'  -- ambiguous!

-- ✓ RIGHT — explicit timezone
WHERE created_at > '2024-01-01T00:00:00Z'

-- ✗ WRONG — AT TIME ZONE strips timezone
NOW() AT TIME ZONE 'UTC'  -- returns TIMESTAMP!

-- ✗ WRONG — storing Unix ts as INTEGER
-- loses precision and timezone context
ts INTEGER  -- don't do this

-- ✓ RIGHT
created_at TIMESTAMPTZ  -- always`}</CodeBlock>
          </Section>

          <Section title="Migration Patterns" color="green">
            <CodeBlock>{`-- Add new column alongside existing
ALTER TABLE events
ADD COLUMN created_at_new TIMESTAMPTZ;

-- Populate from Unix integer
UPDATE events
SET created_at_new = to_timestamp(created_at_unix);

-- Verify before dropping old column
SELECT COUNT(*) FROM events
WHERE created_at_new IS NULL;

-- Rename
ALTER TABLE events
DROP COLUMN created_at_unix;
ALTER TABLE events
RENAME COLUMN created_at_new TO created_at;

-- Convert stored strings to TIMESTAMPTZ
UPDATE events
SET created_at = created_at_str::TIMESTAMPTZ;`}</CodeBlock>
          </Section>

          <Section title="Useful Queries" color="cyan">
            <CodeBlock>{`-- Events in last 24 hours
SELECT * FROM events
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Events today (in UTC)
SELECT * FROM events
WHERE date_trunc('day', created_at) =
      date_trunc('day', NOW());

-- Count by hour
SELECT date_trunc('hour', created_at) as hour,
       COUNT(*) as count
FROM events
GROUP BY hour ORDER BY hour;

-- Count by day for last 30 days
SELECT date_trunc('day', created_at) as day,
       COUNT(*) as count
FROM events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY day ORDER BY day;`}</CodeBlock>
          </Section>
        </div>

        <div className="mt-8 border-t border-terminal-border pt-4 print:border-gray-300">
          <p className="text-center font-mono text-xs text-muted-foreground print:text-gray-500">
            unixcalculator.com · /cheatsheets · PostgreSQL reference
          </p>
        </div>
      </main>

      <CheatsheetPrintStyles />
    </div>
  )
}
