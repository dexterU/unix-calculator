'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const OFFSETS = [
  { id: 'utc', label: 'UTC', minutes: 0 },
  { id: 'est', label: 'US Eastern (UTC−5)', minutes: -300 },
  { id: 'pst', label: 'US Pacific (UTC−8)', minutes: -480 },
  { id: 'cet', label: 'Central Europe (UTC+1)', minutes: 60 },
  { id: 'jst', label: 'Japan (UTC+9)', minutes: 540 },
]

export default function TimezoneConverter() {
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-xl space-y-6">
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
      </main>
    </div>
  )
}
