'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function monthlyPayment(principal: number, annualPct: number, years: number) {
  const n = Math.round(years * 12)
  if (n <= 0 || principal <= 0) return null
  const r = annualPct / 100 / 12
  if (r === 0) return principal / n
  const pow = (1 + r) ** -n
  return (principal * r) / (1 - pow)
}

export default function MortgageCalculator() {
  const [principal, setPrincipal] = useState('300000')
  const [apr, setApr] = useState('6.5')
  const [years, setYears] = useState('30')

  const pay = useMemo(() => {
    const P = parseFloat(principal)
    const a = parseFloat(apr)
    const y = parseFloat(years)
    if (![P, a, y].every((v) => Number.isFinite(v)) || P <= 0 || y <= 0)
      return null
    return monthlyPayment(P, a, y)
  }, [principal, apr, years])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mortgage payment
          </h1>
          <p className="text-gray-600 text-sm">
            Fixed-rate amortized loan — principal, APR, term in years.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="p">Principal ($)</Label>
          <Input
            id="p"
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apr">APR (%)</Label>
          <Input
            id="apr"
            inputMode="decimal"
            value={apr}
            onChange={(e) => setApr(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="y">Years</Label>
          <Input
            id="y"
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
        <div className="calc-result">
          {pay !== null ? (
            <p className="text-xl font-semibold">
              Monthly: ${pay.toFixed(2)}
            </p>
          ) : (
            <span className="text-gray-500">Enter valid loan parameters.</span>
          )}
        </div>
      </main>
    </div>
  )
}
