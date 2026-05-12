'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { AdUnit } from '@/components/AdUnit'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

type CalculationType = 'basic' | 'increase' | 'decrease' | 'of'

type PercentageCalcResult = {
  value: number
  explanation: string
  formatted: string
} | null

export default function PercentageCalculatorClient() {
  const [calculationType, setCalculationType] = useState<CalculationType>('basic')
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [result, setResult] = useState<PercentageCalcResult>(null)

  const calculatePercentage = () => {
    const num1 = parseFloat(value1)
    const num2 = parseFloat(value2)

    if (Number.isNaN(num1) || Number.isNaN(num2)) return

    let calculatedResult: number
    let explanation = ''

    switch (calculationType) {
      case 'basic':
        calculatedResult = (num1 / 100) * num2
        explanation = `${num1}% of ${num2} = ${calculatedResult}`
        break
      case 'increase':
        calculatedResult = ((num2 - num1) / num1) * 100
        explanation = `Percentage increase from ${num1} to ${num2} = ${calculatedResult.toFixed(2)}%`
        break
      case 'decrease':
        calculatedResult = ((num1 - num2) / num1) * 100
        explanation = `Percentage decrease from ${num1} to ${num2} = ${calculatedResult.toFixed(2)}%`
        break
      case 'of':
        calculatedResult = (num1 / num2) * 100
        explanation = `${num1} is ${calculatedResult.toFixed(2)}% of ${num2}`
        break
      default:
        return
    }

    setResult({
      value: calculatedResult,
      explanation,
      formatted: calculationType === 'basic' ? String(calculatedResult) : `${calculatedResult.toFixed(2)}%`,
    })
  }

  const bcCommand = useMemo(() => {
    const a = value1 || 'PERCENTAGE'
    const b = value2 || 'VALUE'
    switch (calculationType) {
      case 'basic':
        return `echo "scale=2; (${a} / 100) * ${b}" | bc`
      case 'increase':
        return `echo "scale=2; ((${b} - ${a}) / ${a}) * 100" | bc`
      case 'decrease':
        return `echo "scale=2; ((${a} - ${b}) / ${a}) * 100" | bc`
      case 'of':
        return `echo "scale=2; (${a} / ${b}) * 100" | bc`
      default:
        return `echo "scale=2; (${a} / 100) * ${b}" | bc`
    }
  }, [calculationType, value1, value2])

  const label1 = calculationType === 'basic' ? 'Percentage' : 'First value'
  const label2 = calculationType === 'basic' ? 'Of value' : 'Second value'

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="bg-terminal-surface border border-terminal-border rounded-xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Percentage calculator</h1>

          <div className="space-y-2">
            <label className="block text-sm font-mono text-muted-foreground">Calculation type</label>
            <select
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value as CalculationType)}
              className="w-full rounded-lg border border-terminal-border bg-background px-4 py-3 font-mono text-sm text-foreground focus:border-terminal-green focus:outline-none"
            >
              <option value="basic">X% of Y</option>
              <option value="increase">Percentage increase</option>
              <option value="decrease">Percentage decrease</option>
              <option value="of">X is what % of Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-mono text-muted-foreground">{label1}</label>
            <input
              type="number"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder={calculationType === 'basic' ? 'Enter percentage' : 'Enter first value'}
              className="w-full rounded-lg border border-terminal-border bg-background px-4 py-3 font-mono text-terminal-green focus:border-terminal-green focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-mono text-muted-foreground">{label2}</label>
            <input
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder={calculationType === 'basic' ? 'Enter value' : 'Enter second value'}
              className="w-full rounded-lg border border-terminal-border bg-background px-4 py-3 font-mono text-terminal-green focus:border-terminal-green focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={calculatePercentage}
            disabled={!value1 || !value2}
            className="mt-2 w-full rounded-lg bg-terminal-green py-3 font-mono font-bold text-terminal-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Calculate Percentage
          </button>

          {result ? (
            <>
              <div className="mt-4 rounded-lg border border-terminal-green/30 bg-background p-4">
                <p className="font-mono text-3xl font-bold text-terminal-green">{result.formatted}</p>
              </div>
              <p className="text-sm text-muted-foreground">{result.explanation}</p>
            </>
          ) : null}
        </div>

        {result ? (
          <AdUnit slot="2151149097" format="rectangle" className="my-6" />
        ) : null}

        <div className="mt-6 bg-terminal-surface border border-terminal-border rounded-xl p-8 space-y-6">
          <div className="rounded-lg border border-terminal-border bg-background p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              BC Command Equivalent
            </p>
            <pre className="overflow-x-auto break-all whitespace-pre-wrap font-mono text-sm text-cyan-400">
              {bcCommand}
            </pre>
          </div>
        </div>

        <AdUnit slot="1750948984" format="horizontal" className="my-6" />

        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
