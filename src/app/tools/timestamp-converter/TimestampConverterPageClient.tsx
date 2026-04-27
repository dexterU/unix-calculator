'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'
import {
  TerminalReferenceSection,
  TerminalRefCodeBlock,
  TerminalRefH2,
  TerminalRefHowItWorks,
  TerminalRefIntro,
  TerminalRefLangTabs,
  TerminalRefSubH3,
} from '@/components/tools/TerminalReference'

const TS_SHELL = `# Convert Unix timestamp to human-readable date (Linux/Mac)
date -d @1733569200
# Output: Sat Dec  7 04:00:00 UTC 2024

# Mac/BSD syntax
date -r 1733569200

# Get current Unix timestamp
date +%s

# Convert date to timestamp
date -d "2024-12-07 04:00:00 UTC" +%s`

const TS_PY = `# Python
import datetime
ts = 1733569200
dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2024-12-07T04:00:00+00:00

# Get current timestamp
import time
print(int(time.time()))`

const TS_JS = `// JavaScript
const ts = 1733569200;
const date = new Date(ts * 1000);
console.log(date.toISOString()); // 2024-12-07T04:00:00.000Z

// Get current timestamp
Math.floor(Date.now() / 1000);`

const TS_GO = `// Go
import "time"
ts := int64(1733569200)
t := time.Unix(ts, 0).UTC()
fmt.Println(t.Format(time.RFC3339)) // 2024-12-07T04:00:00Z`

const TS_SQL = `-- PostgreSQL
SELECT to_timestamp(1733569200);
SELECT EXTRACT(EPOCH FROM NOW())::bigint;

-- MySQL
SELECT FROM_UNIXTIME(1733569200);
SELECT UNIX_TIMESTAMP();`

function parseTimestamp(input: string): number | null {
  const t = input.trim()
  if (!t) return null
  const n = Number(t)
  if (!Number.isFinite(n)) return null
  if (n > 1e12) return Math.floor(n / 1000)
  return Math.floor(n)
}

export default function TimestampConverterPageClient() {
  const [raw, setRaw] = useState('')
  const parsed = useMemo(() => parseTimestamp(raw), [raw])
  const date = parsed !== null ? new Date(parsed * 1000) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Unix Timestamp Converter
        </h1>
        <p className="text-gray-600 mb-8">
          Enter seconds since Unix epoch (UTC). Millisecond timestamps are detected
          automatically.
        </p>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timestamp
        </label>
        <input
          className="calc-input mb-4"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="e.g. 1700000000 or 1700000000000"
        />
        <div className="calc-result min-h-[4rem]">
          {date ? (
            <div className="flex flex-col gap-1 text-left w-full">
              <span>
                <strong>UTC:</strong> {date.toISOString()}
              </span>
              <span>
                <strong>Local:</strong> {date.toString()}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">
              Enter a numeric Unix timestamp to convert.
            </span>
          )}
        </div>

        <RelatedGuides guides={getRelatedGuides('timestamp-converter')} />
        <TerminalReferenceSection>
          <TerminalRefH2 />
          <TerminalRefIntro>
            Convert Unix timestamps directly in your terminal without any tools.
          </TerminalRefIntro>
          <TerminalRefCodeBlock label="bash" code={TS_SHELL} />
          <TerminalRefSubH3>Language Quick Reference</TerminalRefSubH3>
          <TerminalRefLangTabs
            tabs={[
              { id: 'python', label: 'Python', codeLabel: 'python', code: TS_PY },
              { id: 'js', label: 'JavaScript', codeLabel: 'javascript', code: TS_JS },
              { id: 'go', label: 'Go', codeLabel: 'go', code: TS_GO },
              { id: 'sql', label: 'SQL', codeLabel: 'sql', code: TS_SQL },
            ]}
          />
          <TerminalRefSubH3>How It Works</TerminalRefSubH3>
          <TerminalRefHowItWorks>
            <p>
              Unix timestamps count seconds elapsed since the Unix epoch — January 1, 1970, 00:00:00
              UTC. This date was chosen because it was a convenient round number when Unix was being
              developed at Bell Labs. Negative timestamps represent dates before 1970. The maximum
              32-bit timestamp is 2,147,483,647 (January 19, 2038) — the Y2038 problem. 64-bit
              systems extend this to year 292 billion.
            </p>
          </TerminalRefHowItWorks>
        </TerminalReferenceSection>
      </main>
    </div>
  )
}
