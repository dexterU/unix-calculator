'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const DUR_SHELL = `# Calculate duration between two timestamps
echo $((1733569200 - 1700000000)) seconds

# Convert to days
echo "scale=2; (1733569200 - 1700000000) / 86400" | bc

# Time since a specific date
echo "Days since 2024-01-01:"
echo $(( ($(date +%s) - $(date -d "2024-01-01" +%s)) / 86400 ))

# Human-readable duration using GNU date
start=1700000000
end=1733569200
diff=$((end - start))
echo "$((diff/86400)) days, $((diff%86400/3600)) hours, \\
$((diff%3600/60)) minutes"`

const DUR_PY = `# Python
from datetime import datetime, timezone

start = datetime.fromtimestamp(1700000000, tz=timezone.utc)
end = datetime.fromtimestamp(1733569200, tz=timezone.utc)
delta = end - start
print(f"{delta.days} days, "
      f"{delta.seconds // 3600} hours, "
      f"{(delta.seconds % 3600) // 60} minutes")`

const DUR_JS = `// JavaScript
const start = 1700000000;
const end = 1733569200;
const diff = end - start;
const days = Math.floor(diff / 86400);
const hours = Math.floor((diff % 86400) / 3600);
const minutes = Math.floor((diff % 3600) / 60);
console.log(\`\${days} days, \${hours} hours, \${minutes} minutes\`);`

function formatDuration(ms: number) {
  const sign = ms < 0 ? '−' : ''
  const x = Math.abs(ms)
  const s = Math.floor(x / 1000)
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const mins = Math.floor((s % 3600) / 60)
  const secs = s % 60
  const parts: string[] = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (mins) parts.push(`${mins}m`)
  if (secs || parts.length === 0) parts.push(`${secs}s`)
  return `${sign}${parts.join(' ')}`
}

export default function DurationCalculatorClient() {
  const [start, setStart] = useState(() =>
    new Date(Date.now() - 86400000).toISOString().slice(0, 16)
  )
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 16))

  const delta = useMemo(() => {
    const a = new Date(start)
    const b = new Date(end)
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null
    return b.getTime() - a.getTime()
  }, [start, end])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Duration calculator
          </h1>
          <p className="text-gray-600">
            Difference between two local datetimes (interpreted in the browser
            timezone).
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start">Start</Label>
            <Input
              id="start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end">End</Label>
            <Input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>
        <div className="calc-result min-h-[4rem]">
          {delta !== null ? (
            <div className="flex flex-col gap-1">
              <span>
                <strong>Human:</strong> {formatDuration(delta)}
              </span>
              <span className="font-mono text-sm text-gray-700">
                <strong>Ms:</strong> {delta.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">Invalid range.</span>
          )}
        </div>

        <RelatedGuides guides={getRelatedGuides('duration-calculator')} />
        <TerminalReferenceSection>
          <TerminalRefH2 />
          <TerminalRefIntro>
            Compute elapsed time between two epoch values using shell arithmetic and GNU date.
          </TerminalRefIntro>
          <TerminalRefCodeBlock label="bash" code={DUR_SHELL} />
          <TerminalRefSubH3>Language Quick Reference</TerminalRefSubH3>
          <TerminalRefLangTabs
            tabs={[
              { id: 'python', label: 'Python', codeLabel: 'python', code: DUR_PY },
              { id: 'js', label: 'JavaScript', codeLabel: 'javascript', code: DUR_JS },
            ]}
          />
          <TerminalRefSubH3>How It Works</TerminalRefSubH3>
          <TerminalRefHowItWorks>
            <p>
              Duration calculation subtracts two Unix timestamps to get a difference in seconds. Since
              timestamps are always in UTC, timezone differences don&apos;t affect the calculation —
              86,400 seconds always equals one day regardless of DST. Watch out for leap seconds: UTC
              occasionally inserts a 61st second in a minute, making some days 86,401 seconds long. Most
              applications ignore this.
            </p>
          </TerminalRefHowItWorks>
        </TerminalReferenceSection>
      </main>
    </div>
  )
}
