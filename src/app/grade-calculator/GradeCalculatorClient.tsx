'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
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
    if (Number.isFinite(score) && Number.isFinite(weight)) rows.push({ score, weight })
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

  const weightSum = result ? result.wsum.toFixed(2) : '—'

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="bg-terminal-surface border border-terminal-border rounded-xl p-8 space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Weighted grade calculator</h1>
            <p className="text-sm text-muted-foreground">
              One row per line: <code className="font-mono text-xs text-terminal-cyan">score weight</code> (e.g.{' '}
              <code className="font-mono text-xs text-terminal-cyan">88 0.25</code>).
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="rows" className="block text-sm font-mono text-muted-foreground">
              Scores &amp; weights
            </label>
            <textarea
              id="rows"
              className="w-full min-h-[160px] resize-y rounded-lg border border-terminal-border bg-background px-4 py-3 font-mono text-terminal-green placeholder:text-muted-foreground focus:border-terminal-green focus:outline-none"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
          </div>

          <div className="mt-6 rounded-xl border border-terminal-border bg-terminal-surface p-6">
            <p className="font-mono text-4xl font-bold text-terminal-green">
              {result ? result.gpa.toFixed(2) : '—'}
            </p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">Weight sum: {weightSum}</p>
            {!result ? (
              <p className="mt-3 text-sm text-muted-foreground">Add at least one valid row.</p>
            ) : null}
          </div>
        </div>

        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
