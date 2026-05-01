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

const TZ_SHELL = `# Convert time between timezones in bash
TZ='America/New_York' date
TZ='Asia/Tokyo' date

# Convert a specific timestamp to a timezone
TZ='Europe/London' date -d @1733569200

# List all available timezones
timedatectl list-timezones

# Check current system timezone
timedatectl status`

const TZ_PY = `# Python
from datetime import datetime
import pytz

utc_time = datetime.fromtimestamp(1733569200, tz=pytz.utc)
eastern = utc_time.astimezone(pytz.timezone('America/New_York'))
print(eastern.strftime('%Y-%m-%d %H:%M:%S %Z'))`

const TZ_JS = `// JavaScript (Intl API — no libraries needed)
const ts = 1733569200;
const date = new Date(ts * 1000);
const formatted = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
}).format(date);
console.log(formatted);`

const TZ_GO = `// Go
import "time"
loc, _ := time.LoadLocation("America/New_York")
t := time.Unix(1733569200, 0).In(loc)
fmt.Println(t.Format("2006-01-02 15:04:05 MST"))`

const OFFSETS = [
  { id: 'utc', label: 'UTC', minutes: 0 },
  { id: 'est', label: 'US Eastern (UTC−5)', minutes: -300 },
  { id: 'pst', label: 'US Pacific (UTC−8)', minutes: -480 },
  { id: 'cet', label: 'Central Europe (UTC+1)', minutes: 60 },
  { id: 'jst', label: 'Japan (UTC+9)', minutes: 540 },
]

export default function TimezoneConverterClient() {
  const [iso, setIso] = useState(() => new Date().toISOString().slice(0, 16))
  const [from, setFrom] = useState('utc')
  const [to, setTo] = useState('cet')

  const result = useMemo(() => {
    const fromOff = OFFSETS.find((o) => o.id === from)?.minutes ?? 0
    const toOff = OFFSETS.find((o) => o.id === to)?.minutes ?? 0
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return null
    const utcMs = d.getTime() - fromOff * 60_000
    const target = new Date(utcMs + toOff * 60_000)
    return target.toISOString()
  }, [iso, from, to])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Timezone converter
          </h1>
          <p className="text-gray-600">
            Pick a local datetime, choose a source zone offset, then convert to
            another offset. For production, swap in a full IANA timezone database.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dt">Date and time</Label>
          <Input
            id="dt"
            type="datetime-local"
            value={iso}
            onChange={(e) => setIso(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <select
              id="from"
              className="calc-input w-full"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {OFFSETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <select
              id="to"
              className="calc-input w-full"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {OFFSETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="calc-result min-h-[3rem]">
          {result ? (
            <span className="font-mono text-sm">{result}</span>
          ) : (
            <span className="text-gray-500">Enter a valid date and time.</span>
          )}
        </div>

        <RelatedGuides guides={getRelatedGuides('timezone-converter')} />
        <TerminalReferenceSection>
          <TerminalRefH2 />
          <TerminalRefIntro>
            Convert and inspect wall-clock time across IANA timezones using the same data your server
            uses — no web UI required.
          </TerminalRefIntro>
          <TerminalRefCodeBlock label="bash" code={TZ_SHELL} />
          <TerminalRefSubH3>Language Quick Reference</TerminalRefSubH3>
          <TerminalRefLangTabs
            tabs={[
              { id: 'python', label: 'Python', codeLabel: 'python', code: TZ_PY },
              { id: 'js', label: 'JavaScript', codeLabel: 'javascript', code: TZ_JS },
              { id: 'go', label: 'Go', codeLabel: 'go', code: TZ_GO },
            ]}
          />
          <TerminalRefSubH3>How It Works</TerminalRefSubH3>
          <TerminalRefHowItWorks>
            <p>
              Timezone conversion works by storing all times as UTC internally, then applying an offset
              for display. Offsets are not always whole hours — India (IST) is UTC+5:30, Nepal is
              UTC+5:45. Daylight Saving Time (DST) adds complexity: the same timezone can have two
              different offsets depending on the date. The IANA timezone database (used by all modern
              systems) handles this automatically using historical DST rules.
            </p>
          </TerminalRefHowItWorks>
        </TerminalReferenceSection>
      </main>
    </div>
  )
}
