'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function trapz(f: (x: number) => number, a: number, b: number, n: number) {
  const h = (b - a) / n
  let s = 0.5 * (f(a) + f(b))
  for (let i = 1; i < n; i++) s += f(a + i * h)
  return s * h
}

export default function IntegralCalculatorClient() {
  const [aCoef, setACoef] = useState('1')
  const [bCoef, setBCoef] = useState('0')
  const [cCoef, setCCoef] = useState('0')
  const [lo, setLo] = useState('0')
  const [hi, setHi] = useState('2')

  const area = useMemo(() => {
    const A = parseFloat(aCoef)
    const B = parseFloat(bCoef)
    const C = parseFloat(cCoef)
    const x0 = parseFloat(lo)
    const x1 = parseFloat(hi)
    if (![A, B, C, x0, x1].every((v) => Number.isFinite(v)) || x1 <= x0)
      return null
    const f = (x: number) => A * x * x + B * x + C
    const numeric = trapz(f, x0, x1, 400)
    const antideriv = (x: number) =>
      (A / 3) * x * x * x + (B / 2) * x * x + C * x
    const exact = antideriv(x1) - antideriv(x0)
    return { numeric, exact }
  }, [aCoef, bCoef, cCoef, lo, hi])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Definite integral
          </h1>
          <p className="text-gray-600 text-sm">
            ∫ ax²+bx+c from lower to upper — trapezoid vs closed-form check.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="a">a</Label>
            <Input id="a" value={aCoef} onChange={(e) => setACoef(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="b">b</Label>
            <Input id="b" value={bCoef} onChange={(e) => setBCoef(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="c">c</Label>
            <Input id="c" value={cCoef} onChange={(e) => setCCoef(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="lo">Lower</Label>
            <Input id="lo" value={lo} onChange={(e) => setLo(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="hi">Upper</Label>
            <Input id="hi" value={hi} onChange={(e) => setHi(e.target.value)} />
          </div>
        </div>
        <div className="calc-result text-sm space-y-1">
          {area ? (
            <>
              <p>
                <strong>Exact:</strong> {area.exact.toFixed(6)}
              </p>
              <p>
                <strong>Trapezoid:</strong> {area.numeric.toFixed(6)}
              </p>
            </>
          ) : (
            <span className="text-gray-500">Valid range and coefficients required.</span>
          )}
        </div>
      </main>
    </div>
  )
}
