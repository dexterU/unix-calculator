'use client'

import Link from 'next/link'
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
  TerminalRefSubH3,
} from '@/components/tools/TerminalReference'

const CRON_SHELL = `# View current crontab
crontab -l

# Edit crontab
crontab -e

# Run a command every day at 9am
# 0 9 * * * /path/to/command

# Every Monday at midnight
# 0 0 * * MON /path/to/command

# Every 15 minutes
# */15 * * * * /path/to/command

# Test when a cron will next run (using GNU date)
# Install: sudo apt install ncal
# Check next 5 occurrences:
echo "Next 5 runs of '0 9 * * *':"
for i in 1 2 3 4 5; do
  date -d "$(date -d 'tomorrow' +%Y-%m-%d) + $((i-1)) days" \\
  "+%Y-%m-%d 09:00:00"
done

# View cron logs
grep CRON /var/log/syslog | tail -20`

export default function CronGeneratorClient() {
  const [minute, setMinute] = useState('0')
  const [hour, setHour] = useState('9')
  const [dom, setDom] = useState('*')
  const [month, setMonth] = useState('*')
  const [dow, setDow] = useState('*')

  const expr = useMemo(
    () => `${minute} ${hour} ${dom} ${month} ${dow}`,
    [minute, hour, dom, month, dow]
  )

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-terminal-green/30 bg-terminal-surface p-4">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">See when your cron will actually run →</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Use Cron Next Runs to preview the next 10 execution times
            </p>
          </div>
          <Link
            href="/tools/cron-next-runs"
            className="whitespace-nowrap rounded-lg bg-terminal-green px-4 py-2 font-mono text-sm font-bold text-terminal-bg transition-opacity hover:opacity-90"
          >
            Try it →
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cron expression builder
          </h1>
          <p className="text-gray-600">
            Standard five-field cron (minute hour day-of-month month day-of-week).
            Validate against your scheduler (systemd, k8s, cloud) before use.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="m">Minute</Label>
            <Input
              id="m"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="0-59 or *"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h">Hour</Label>
            <Input
              id="h"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="0-23 or *"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dom">Day of month</Label>
            <Input
              id="dom"
              value={dom}
              onChange={(e) => setDom(e.target.value)}
              placeholder="1-31 or *"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="1-12 or *"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="dow">Day of week</Label>
            <Input
              id="dow"
              value={dow}
              onChange={(e) => setDow(e.target.value)}
              placeholder="0-6 or * (0 = Sunday)"
            />
          </div>
        </div>
        <div className="calc-result">
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">
            Expression
          </p>
          <code className="text-lg font-mono">{expr}</code>
        </div>

        <RelatedGuides guides={getRelatedGuides('cron-generator')} />
        <TerminalReferenceSection>
          <TerminalRefH2 />
          <TerminalRefIntro>
            Manage user crontabs and validate schedules with the same tools your Linux server uses.
          </TerminalRefIntro>
          <TerminalRefCodeBlock label="bash" code={CRON_SHELL} />
          <TerminalRefSubH3>How It Works</TerminalRefSubH3>
          <TerminalRefHowItWorks>
            <p>
              A cron expression has 5 fields: minute (0-59), hour (0-23), day of month (1-31), month
              (1-12), day of week (0-7, where both 0 and 7 = Sunday). Asterisk (*) means
              &apos;every&apos;. Slash (/) means &apos;every N&apos; — */15 means every 15 units.
              Comma separates values: MON,WED,FRI means those three days. Systems like AWS EventBridge
              and Kubernetes use 6-field cron with seconds. Quartz scheduler uses 7 fields including
              year.
            </p>
          </TerminalRefHowItWorks>
        </TerminalReferenceSection>
      </main>
    </div>
  )
}
