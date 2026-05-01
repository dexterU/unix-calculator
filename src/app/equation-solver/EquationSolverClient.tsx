'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

export default function EquationSolverClient() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('-5')
  const [c, setC] = useState('6')

  const roots = useMemo(() => {
    const A = parseFloat(a)
    const B = parseFloat(b)
    const C = parseFloat(c)
    if (![A, B, C].every((v) => Number.isFinite(v)) || A === 0) return null
    const disc = B * B - 4 * A * C
    if (disc < 0) {
      const re = -B / (2 * A)
      const im = Math.sqrt(-disc) / (2 * A)
      return { kind: 'complex' as const, re, im }
    }
    if (disc === 0) {
      const x = -B / (2 * A)
      return { kind: 'one' as const, x }
    }
    const s = Math.sqrt(disc)
    const x1 = (-B + s) / (2 * A)
    const x2 = (-B - s) / (2 * A)
    return { kind: 'two' as const, x1, x2 }
  }, [a, b, c])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quadratic solver
          </h1>
          <p className="text-gray-600 text-sm">Solve ax² + bx + c = 0 (a ≠ 0).</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>a</Label>
            <Input value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>b</Label>
            <Input value={b} onChange={(e) => setB(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>c</Label>
            <Input value={c} onChange={(e) => setC(e.target.value)} />
          </div>
        </div>
        <div className="calc-result text-sm">
          {roots?.kind === 'two' && (
            <p>
              x₁ = {roots.x1}, x₂ = {roots.x2}
            </p>
          )}
          {roots?.kind === 'one' && <p>Double root x = {roots.x}</p>}
          {roots?.kind === 'complex' && (
            <p>
              {roots.re.toFixed(4)} ± {roots.im.toFixed(4)}i
            </p>
          )}
          {!roots && (
            <span className="text-gray-500">Need a ≠ 0 and valid numbers.</span>
          )}
        </div>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
