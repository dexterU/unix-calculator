'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

export default function BMICalculatorClient() {
  const [kg, setKg] = useState('70')
  const [m, setM] = useState('1.75')

  const bmi = useMemo(() => {
    const w = parseFloat(kg)
    const h = parseFloat(m)
    if (!Number.isFinite(w) || !Number.isFinite(h) || h <= 0) return null
    return w / (h * h)
  }, [kg, m])

  const label =
    bmi === null
      ? ''
      : bmi < 18.5
        ? 'Underweight'
        : bmi < 25
          ? 'Normal'
          : bmi < 30
            ? 'Overweight'
            : 'Obese'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BMI calculator</h1>
          <p className="text-gray-600 text-sm">Metric: kilograms and meters.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="kg">Weight (kg)</Label>
          <Input
            id="kg"
            inputMode="decimal"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="m">Height (m)</Label>
          <Input
            id="m"
            inputMode="decimal"
            value={m}
            onChange={(e) => setM(e.target.value)}
          />
        </div>
        <div className="calc-result">
          {bmi !== null ? (
            <>
              <p className="text-2xl font-semibold">{bmi.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mt-1">{label}</p>
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
