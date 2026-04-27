'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

export default function MatrixCalculatorClient() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('2')
  const [c, setC] = useState('3')
  const [d, setD] = useState('4')

  const out = useMemo(() => {
    const m = [
      [parseFloat(a), parseFloat(b)],
      [parseFloat(c), parseFloat(d)],
    ]
    if (!m.flat().every((v) => Number.isFinite(v))) return null
    const det = m[0][0] * m[1][1] - m[0][1] * m[1][0]
    let inv: string | null = null
    if (det !== 0) {
      const invMat = [
        [m[1][1] / det, -m[0][1] / det],
        [-m[1][0] / det, m[0][0] / det],
      ]
      inv = invMat.map((r) => r.map((x) => x.toFixed(4)).join(' ')).join(' | ')
    }
    return { det, inv }
  }, [a, b, c, d])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">2×2 matrix</h1>
          <p className="text-gray-600 text-sm">Determinant and inverse when det ≠ 0.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>a₁₁</Label>
            <Input value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>a₁₂</Label>
            <Input value={b} onChange={(e) => setB(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>a₂₁</Label>
            <Input value={c} onChange={(e) => setC(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>a₂₂</Label>
            <Input value={d} onChange={(e) => setD(e.target.value)} />
          </div>
        </div>
        <div className="calc-result text-sm space-y-2">
          {out ? (
            <>
              <p>
                <strong>det:</strong> {out.det}
              </p>
              <p>
                <strong>inverse rows:</strong>{' '}
                {out.inv ?? 'singular (det = 0)'}
              </p>
            </>
          ) : (
            <span className="text-gray-500">Enter four numbers.</span>
          )}
        </div>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
