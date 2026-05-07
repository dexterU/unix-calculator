'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'
import {
  TerminalReferenceSection,
  TerminalRefCodeBlock,
  TerminalRefH2,
  TerminalRefHowItWorks,
  TerminalRefIntro,
  TerminalRefSubH3,
} from '@/components/tools/TerminalReference'

const LOG_SHELL = `# Extract all timestamps from a log file
grep -oP '\\d{10}' /var/log/app.log

# Convert all timestamps in a log to readable dates
grep -oP '\\d{10}' /var/log/app.log | \\
  while read ts; do
    echo "$ts -> $(date -d @$ts)"
  done

# Find log entries in a time range
awk -F'[][]' '{print $2}' access.log | \\
  awk -F/ '{print $3"-"$2"-"$1}' | sort | uniq -c

# Parse nginx access log timestamps
awk '{print $4}' /var/log/nginx/access.log | \\
  cut -c2- | sort | uniq -c

# Filter logs by date range using Unix timestamps
start=$(date -d "2024-12-01" +%s)
end=$(date -d "2024-12-07" +%s)
awk -v s=$start -v e=$end '$1>=s && $1<=e' timestamps.log`

const ISO =
  /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g
const UNIX = /\b\d{10,13}\b/g

export default function LogParserClient() {
  const [text, setText] = useState('')

  const hits = useMemo(() => {
    const found: { raw: string; kind: string }[] = []
    for (const m of text.matchAll(ISO)) {
      found.push({ raw: m[0], kind: 'iso' })
    }
    for (const m of text.matchAll(UNIX)) {
      const n = Number(m[0])
      if (n > 1e11) continue
      found.push({ raw: m[0], kind: 'unix_s' })
    }
    return found
  }, [text])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Log parser</h1>
          <p className="text-gray-600 max-w-2xl">
            Paste log lines. ISO-8601 timestamps and 10-digit Unix seconds are
            highlighted and listed in order of appearance.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="log-parser-input" className="text-gray-700">
            Log lines
          </Label>
          <Textarea
            id="log-parser-input"
            className="min-h-[220px] font-mono text-xs"
            placeholder="2025-01-15T12:00:00Z started job…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Paste log lines to extract timestamps"
          />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="px-3 py-2 border-b border-gray-100 text-sm font-medium text-gray-700">
            Matches ({hits.length})
          </div>
          <ul className="max-h-64 overflow-auto divide-y divide-gray-100">
            {hits.map((h, i) => (
              <li key={`${h.raw}-${i}`} className="px-3 py-2 font-mono text-xs">
                <span className="text-gray-500 mr-2">[{h.kind}]</span>
                {h.raw}
              </li>
            ))}
            {hits.length === 0 && (
              <li className="px-3 py-6 text-gray-500 text-sm">
                No timestamps detected yet.
              </li>
            )}
          </ul>
        </div>

        <RelatedGuides guides={getRelatedGuides('log-parser')} />
        <TerminalReferenceSection>
          <TerminalRefH2 />
          <TerminalRefIntro>
            Rip epoch digits and structured dates out of logs using grep, awk, and GNU date.
          </TerminalRefIntro>
          <TerminalRefCodeBlock label="bash" code={LOG_SHELL} />
          <TerminalRefSubH3>How It Works</TerminalRefSubH3>
          <TerminalRefHowItWorks>
            <p>
              Log files use many timestamp formats: Unix seconds, ISO 8601, Apache Common Log Format
              ([07/Dec/2024:04:00:00 +0000]), syslog format (Dec 7 04:00:00), and RFC 3339. Parsing
              requires identifying the format and converting to a common representation for comparison.
              The key challenge is timezone — logs from distributed systems may use different zones,
              making naive string comparison incorrect. Always normalize to UTC first.
            </p>
          </TerminalRefHowItWorks>
        </TerminalReferenceSection>
      </main>
    </div>
  )
}
