'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TimeCalculatorClient() {
  const [start, setStart] = useState(() =>
    new Date().toISOString().slice(0, 16)
  )
  const [addHours, setAddHours] = useState('24')

  const end = useMemo(() => {
    const h = parseFloat(addHours)
    const d = new Date(start)
    if (!Number.isFinite(h) || Number.isNaN(d.getTime())) return null
    d.setTime(d.getTime() + h * 3600_000)
    return d
  }, [start, addHours])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Time shift</h1>
          <p className="text-gray-600 text-sm">
            Add hours to a local datetime (browser timezone).
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="s">Start</Label>
          <Input
            id="s"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="h">Hours to add</Label>
          <Input
            id="h"
            inputMode="decimal"
            value={addHours}
            onChange={(e) => setAddHours(e.target.value)}
          />
        </div>
        <div className="calc-result text-sm">
          {end ? (
            <p>
              <strong>Result:</strong> {end.toLocaleString()}
            </p>
          ) : (
            <span className="text-gray-500">Check inputs.</span>
          )}
        </div>
      </main>
    </div>
  )
}
