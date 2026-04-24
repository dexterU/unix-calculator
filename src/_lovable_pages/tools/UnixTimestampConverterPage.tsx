'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'

function parseTimestamp(input: string): number | null {
  const t = input.trim()
  if (!t) return null
  const n = Number(t)
  if (!Number.isFinite(n)) return null
  if (n > 1e12) return Math.floor(n / 1000)
  return Math.floor(n)
}

export function UnixTimestampConverterPage() {
  const [raw, setRaw] = useState('')
  const parsed = useMemo(() => parseTimestamp(raw), [raw])
  const date = parsed !== null ? new Date(parsed * 1000) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-2xl">
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
      </main>
    </div>
  )
}
