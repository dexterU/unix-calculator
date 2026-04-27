'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

/** Mifflin–St Jeor BMR (kcal/day) */
function bmrMifflin(
  sex: 'm' | 'f',
  kg: number,
  cm: number,
  age: number
): number {
  const base = 10 * kg + 6.25 * cm - 5 * age
  return sex === 'm' ? base + 5 : base - 161
}

export default function CalorieCalculatorClient() {
  const [sex, setSex] = useState<'m' | 'f'>('m')
  const [kg, setKg] = useState('70')
  const [cm, setCm] = useState('175')
  const [age, setAge] = useState('30')
  const [activity, setActivity] = useState('1.55')

  const out = useMemo(() => {
    const w = parseFloat(kg)
    const h = parseFloat(cm)
    const a = parseFloat(age)
    const act = parseFloat(activity)
    if (
      !Number.isFinite(w) ||
      !Number.isFinite(h) ||
      !Number.isFinite(a) ||
      !Number.isFinite(act)
    )
      return null
    const b = bmrMifflin(sex, w, h, a)
    return { bmr: b, tdee: b * act }
  }, [sex, kg, cm, age, activity])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calorie estimator
          </h1>
          <p className="text-gray-600 text-sm">
            Mifflin–St Jeor BMR × activity factor (not medical advice).
          </p>
        </div>
        <div className="space-y-2">
          <Label>Sex</Label>
          <select
            className="calc-input w-full"
            value={sex}
            onChange={(e) => setSex(e.target.value as 'm' | 'f')}
          >
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="cm">Height (cm)</Label>
            <Input
              id="cm"
              inputMode="decimal"
              value={cm}
              onChange={(e) => setCm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="act">Activity multiplier</Label>
          <select
            id="act"
            className="calc-input w-full"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="1.2">Sedentary (1.2)</option>
            <option value="1.375">Light (1.375)</option>
            <option value="1.55">Moderate (1.55)</option>
            <option value="1.725">Very active (1.725)</option>
            <option value="1.9">Extra active (1.9)</option>
          </select>
        </div>
        <div className="calc-result space-y-1">
          {out ? (
            <>
              <p>
                <strong>BMR:</strong> {Math.round(out.bmr)} kcal/day
              </p>
              <p>
                <strong>TDEE:</strong> {Math.round(out.tdee)} kcal/day
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
