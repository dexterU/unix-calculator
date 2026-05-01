'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

function formatBytes(n: number, base: 1000 | 1024) {
  let v = n
  let i = 0
  const div = base
  while (v >= div && i < UNITS.length - 1) {
    v /= div
    i++
  }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${UNITS[i]}${base === 1024 ? ' (1024)' : ' (1000)'}`
}

export default function FileSizeCalculatorClient() {
  const [bytes, setBytes] = useState('1048576')

  const n = useMemo(() => {
    const x = parseFloat(bytes)
    return Number.isFinite(x) && x >= 0 ? x : null
  }, [bytes])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            File size converter
          </h1>
          <p className="text-gray-600 text-sm">
            Convert raw byte counts to SI (1000) and binary (1024) prefixes.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="b">Bytes</Label>
          <Input
            id="b"
            inputMode="decimal"
            value={bytes}
            onChange={(e) => setBytes(e.target.value)}
          />
        </div>
        <div className="calc-result space-y-2 text-sm">
          {n !== null ? (
            <>
              <p>{formatBytes(n, 1000)}</p>
              <p>{formatBytes(n, 1024)}</p>
            </>
          ) : (
            <span className="text-gray-500">Enter a non-negative number.</span>
          )}
        </div>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
