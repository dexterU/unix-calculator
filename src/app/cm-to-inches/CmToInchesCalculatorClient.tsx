'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

const CM_PER_IN = 2.54

export default function CmToInchesCalculatorClient() {
  const [cmStr, setCmStr] = useState('2.54')

  const result = useMemo(() => {
    const cm = parseFloat(cmStr)
    if (!Number.isFinite(cm)) return null
    const inches = cm / CM_PER_IN
    return { inches, ft: inches / 12 }
  }, [cmStr])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CM to inches converter</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Precise conversion using the exact factor 1 in = 2.54 cm (international inch). Values are computed in the
            browser — suitable for layout, manufacturing tolerances, and quick checks alongside BC-style math on the
            command line.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cm">Centimeters</Label>
          <Input
            id="cm"
            inputMode="decimal"
            value={cmStr}
            onChange={(e) => setCmStr(e.target.value)}
            className="border-terminal-border bg-background font-mono text-terminal-green"
          />
        </div>
        <div className="rounded-lg border border-terminal-border bg-terminal-surface p-4 text-sm">
          {result ? (
            <ul className="space-y-1 font-mono text-terminal-cyan">
              <li>
                <span className="text-muted-foreground">Inches:</span> {result.inches.toFixed(6)}
              </li>
              <li>
                <span className="text-muted-foreground">Feet (decimal):</span> {result.ft.toFixed(6)}
              </li>
            </ul>
          ) : (
            <p className="text-muted-foreground">Enter a numeric centimeter value.</p>
          )}
        </div>
        <pre className="overflow-x-auto rounded-lg border border-terminal-border bg-background p-4 font-mono text-xs text-terminal-cyan">
          {`# GNU bc one-liner (scale = fractional digits)
echo "scale=8; ${cmStr || '0'} / 2.54" | bc -l`}
        </pre>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
