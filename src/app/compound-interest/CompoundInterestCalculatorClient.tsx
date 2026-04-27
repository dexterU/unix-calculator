'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

export default function CompoundInterestCalculatorClient() {
  const [principal, setPrincipal] = useState('10000')
  const [annualPct, setAnnualPct] = useState('5')
  const [years, setYears] = useState('10')
  const [nPerYear, setNPerYear] = useState('12')

  const future = useMemo(() => {
    const P = parseFloat(principal)
    const r = parseFloat(annualPct) / 100
    const t = parseFloat(years)
    const n = parseFloat(nPerYear)
    if (![P, r, t, n].every((v) => Number.isFinite(v)) || P < 0 || t < 0 || n <= 0)
      return null
    const A = P * (1 + r / n) ** (n * t)
    return { A, interest: A - P }
  }, [principal, annualPct, years, nPerYear])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compound interest
          </h1>
          <p className="text-gray-600 text-sm">
            A = P(1 + r/n)<sup>nt</sup> — r annual as decimal from percent.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="p">Principal</Label>
          <Input
            id="p"
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="r">Annual rate (%)</Label>
          <Input
            id="r"
            inputMode="decimal"
            value={annualPct}
            onChange={(e) => setAnnualPct(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="t">Years</Label>
          <Input
            id="t"
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="n">Compounds / year</Label>
          <Input
            id="n"
            inputMode="numeric"
            value={nPerYear}
            onChange={(e) => setNPerYear(e.target.value)}
          />
        </div>
        <div className="calc-result text-sm space-y-1">
          {future ? (
            <>
              <p>
                <strong>Future value:</strong> {future.A.toFixed(2)}
              </p>
              <p>
                <strong>Interest earned:</strong> {future.interest.toFixed(2)}
              </p>
            </>
          ) : (
            <span className="text-gray-500">Check inputs.</span>
          )}
        </div>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
