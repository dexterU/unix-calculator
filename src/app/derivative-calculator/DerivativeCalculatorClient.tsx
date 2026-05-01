'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

/** f(x) = ax² + bx + c — numerical derivative at x0 using central difference */
function derivQuad(a: number, b: number, _c: number, x0: number, h: number) {
  const f = (x: number) => a * x * x + b * x + _c
  return (f(x0 + h) - f(x0 - h)) / (2 * h)
}

export default function DerivativeCalculatorClient() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('-3')
  const [c, setC] = useState('2')
  const [x0, setX0] = useState('2')

  const d = useMemo(() => {
    const A = parseFloat(a)
    const B = parseFloat(b)
    const C = parseFloat(c)
    const X = parseFloat(x0)
    if (
      ![A, B, C, X].every((v) => Number.isFinite(v))
    )
      return null
    const exact = 2 * A * X + B
    const approx = derivQuad(A, B, C, X, 1e-4)
    return { exact, approx }
  }, [a, b, c, x0])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Derivative (quadratic)
          </h1>
          <p className="text-gray-600 text-sm">
            For <code className="text-xs">f(x)=ax²+bx+c</code>, exact f′(x)=2ax+b
            vs central difference check.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="a">a</Label>
            <Input id="a" value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="b">b</Label>
            <Input id="b" value={b} onChange={(e) => setB(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="c">c</Label>
            <Input id="c" value={c} onChange={(e) => setC(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="x">x</Label>
          <Input id="x" value={x0} onChange={(e) => setX0(e.target.value)} />
        </div>
        <div className="calc-result text-sm space-y-1">
          {d ? (
            <>
              <p>
                <strong>Exact f′(x):</strong> {d.exact}
              </p>
              <p>
                <strong>Central Δ (1e-4):</strong> {d.approx.toFixed(6)}
              </p>
            </>
          ) : (
            <span className="text-gray-500">Enter valid coefficients.</span>
          )}
        </div>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
