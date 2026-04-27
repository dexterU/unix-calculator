'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function parseTimestamp(input: string): number | null {
  const t = input.trim()
  if (!t) return null
  const n = Number(t)
  if (!Number.isFinite(n)) return null
  if (n > 1e12) return Math.floor(n / 1000)
  return Math.floor(n)
}

export function UnixTimestampConverter() {
  const [raw, setRaw] = useState('')
  const parsed = useMemo(() => parseTimestamp(raw), [raw])
  const date = parsed !== null ? new Date(parsed * 1000) : null

  return (
    <Card className="border-terminal-border/80 bg-card/80">
      <CardHeader>
        <CardTitle className="text-foreground">Unix timestamp</CardTitle>
        <CardDescription>
          Seconds since Unix epoch (UTC). Millisecond values are detected automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="unix-ts-input">Timestamp</Label>
          <Input
            id="unix-ts-input"
            className="font-mono"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="e.g. 1700000000 or 1700000000000"
          />
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm min-h-[4.5rem]">
          {date ? (
            <div className="flex flex-col gap-2 text-left">
              <span>
                <span className="text-muted-foreground">UTC:</span> {date.toISOString()}
              </span>
              <span>
                <span className="text-muted-foreground">Local:</span> {date.toString()}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Enter a numeric Unix timestamp to convert.</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
