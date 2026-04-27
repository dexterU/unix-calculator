'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

function parseWeightedRows(text: string) {
  const rows: { score: number; weight: number }[] = []
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim()
    if (!t) continue
    const [a, b] = t.split(/[,\s]+/)
    const score = parseFloat(a)
    const weight = parseFloat(b)
    if (Number.isFinite(score) && Number.isFinite(weight))
      rows.push({ score, weight })
  }
  return rows
}

export default function GradeCalculatorClient() {
  const [raw, setRaw] = useState('85 0.3\n90 0.4\n78 0.3')

  const result = useMemo(() => {
    const rows = parseWeightedRows(raw)
    if (!rows.length) return null
    const wsum = rows.reduce((s, r) => s + r.weight, 0)
    if (wsum <= 0) return null
    const gpa = rows.reduce((s, r) => s + r.score * r.weight, 0) / wsum
    return { gpa, wsum }
  }, [raw])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-lg space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Weighted grade calculator
          </h1>
          <p className="text-gray-600 text-sm">
            One row per line: <code className="text-xs">score weight</code> (e.g.{' '}
            <code className="text-xs">88 0.25</code>).
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rows">Scores & weights</Label>
          <textarea
            id="rows"
            className="calc-input min-h-[140px] font-mono text-sm"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        <div className="calc-result">
          {result ? (
            <>
              <p className="text-2xl font-semibold">{result.gpa.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Weight sum: {result.wsum.toFixed(2)}
              </p>
            </>
          ) : (
            <span className="text-gray-500">Add at least one valid row.</span>
          )}
        </div>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
