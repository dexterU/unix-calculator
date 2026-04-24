'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState('0')

  const temps = useMemo(() => {
    const c = parseFloat(celsius)
    if (!Number.isFinite(c)) return null
    return { f: (c * 9) / 5 + 32, k: c + 273.15 }
  }, [celsius])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Temperature converter
          </h1>
          <p className="text-gray-600 text-sm">Celsius → Fahrenheit and Kelvin.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="c">°C</Label>
          <Input
            id="c"
            inputMode="decimal"
            value={celsius}
            onChange={(e) => setCelsius(e.target.value)}
          />
        </div>
        <div className="calc-result text-sm space-y-1">
          {temps ? (
            <>
              <p>
                <strong>°F:</strong> {temps.f.toFixed(2)}
              </p>
              <p>
                <strong>K:</strong> {temps.k.toFixed(2)}
              </p>
            </>
          ) : (
            <span className="text-gray-500">Enter a number.</span>
          )}
        </div>
      </main>
    </div>
  )
}
