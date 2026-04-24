'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-xl space-y-6">
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
      </main>
    </div>
  )
}
