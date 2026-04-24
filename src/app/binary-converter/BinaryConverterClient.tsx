'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function BinaryConverterClient() {
  const [dec, setDec] = useState('42')

  const parsed = useMemo(() => {
    const n = parseInt(dec, 10)
    if (!Number.isFinite(n) || dec.trim() === '' || !/^-?\d+$/.test(dec.trim()))
      return null
    return n
  }, [dec])

  const bin = parsed !== null ? (parsed >>> 0).toString(2) : ''
  const hex = parsed !== null ? (parsed >>> 0).toString(16).toUpperCase() : ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-lg space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Binary / hex converter
          </h1>
          <p className="text-gray-600 text-sm">
            Non-negative integers to binary and hexadecimal.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="d">Decimal</Label>
          <Input
            id="d"
            inputMode="numeric"
            value={dec}
            onChange={(e) => setDec(e.target.value)}
          />
        </div>
        <div className="calc-result space-y-2 font-mono text-sm">
          {parsed !== null ? (
            <>
              <p>
                <strong>Binary:</strong> {bin}
              </p>
              <p>
                <strong>Hex:</strong> {hex}
              </p>
            </>
          ) : (
            <span className="text-gray-500">Enter a whole number.</span>
          )}
        </div>
      </main>
    </div>
  )
}
