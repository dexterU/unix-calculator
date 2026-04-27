'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

/** Same amortization as mortgage: fixed payment over n months */
function payment(P: number, annualPct: number, months: number) {
  if (months <= 0 || P <= 0) return null
  const r = annualPct / 100 / 12
  if (r === 0) return P / months
  return (P * r) / (1 - (1 + r) ** -months)
}

export default function LoanCalculatorClient() {
  const [principal, setPrincipal] = useState('15000')
  const [apr, setApr] = useState('8.99')
  const [months, setMonths] = useState('48')

  const pay = useMemo(() => {
    const P = parseFloat(principal)
    const a = parseFloat(apr)
    const m = parseFloat(months)
    if (![P, a, m].every((v) => Number.isFinite(v))) return null
    return payment(P, a, m)
  }, [principal, apr, months])

  const total = useMemo(() => {
    const m = parseFloat(months)
    if (pay === null || !Number.isFinite(m) || m <= 0) return null
    const t = pay * m
    return Number.isFinite(t) ? t : null
  }, [pay, months])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan payment</h1>
          <p className="text-gray-600 text-sm">
            Fixed APR, equal monthly payments, term in months.
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
          <Label htmlFor="m">Months</Label>
          <Input
            id="m"
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />
        </div>
        <div className="calc-result text-sm space-y-1">
          {pay !== null && total !== null && Number.isFinite(pay) ? (
            <>
              <p className="text-lg font-semibold">
                Monthly: ${pay.toFixed(2)}
              </p>
              <p>
                <strong>Total paid:</strong> ${total.toFixed(2)}
              </p>
            </>
          ) : (
            <span className="text-gray-500">Enter valid numbers.</span>
          )}
        </div>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
