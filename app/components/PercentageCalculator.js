'use client'

import { useState } from 'react'
import { Copy, Terminal, BookOpen } from 'lucide-react'

export function PercentageCalculator() {
  const [calculationType, setCalculationType] = useState('basic')
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [result, setResult] = useState(null)

  const calculatePercentage = () => {
    const num1 = parseFloat(value1)
    const num2 = parseFloat(value2)
    
    if (isNaN(num1) || isNaN(num2)) return

    let calculatedResult
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
      formatted: calculationType === 'basic' ? calculatedResult.toString() : `${calculatedResult.toFixed(2)}%`
    })
  }

  const copyCommand = () => {
    const command = `echo "scale=2; (${value1} / 100) * ${value2}" | bc`
    navigator.clipboard.writeText(command)
    alert('Command copied to clipboard!')
  }

  return (
    <div className="container py-8">
      <div style={{ maxWidth: '4rem', margin: '0 auto' }}>
        {/* Calculator Interface */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Percentage Calculator</h2>
          
          <div className="grid-auto">
            <div>
              {/* Calculation Type Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calculation Type
                </label>
                <select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value)}
                  className="calc-input"
                >
                  <option value="basic">X% of Y</option>
                  <option value="increase">Percentage Increase</option>
                  <option value="decrease">Percentage Decrease</option>
                  <option value="of">X is what % of Y</option>
                </select>
              </div>

              {/* Input Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {calculationType === 'basic' ? 'Percentage' : 'First Value'}
                  </label>
                  <input
                    type="number"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    placeholder={calculationType === 'basic' ? 'Enter percentage' : 'Enter first value'}
                    className="calc-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {calculationType === 'basic' ? 'Of Value' : 'Second Value'}
                  </label>
                  <input
                    type="number"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    placeholder={calculationType === 'basic' ? 'Enter value' : 'Enter second value'}
                    className="calc-input"
                  />
                </div>
              </div>

              <button
                onClick={calculatePercentage}
                disabled={!value1 || !value2}
                className="btn btn-primary w-full mt-6"
                style={{ opacity: (!value1 || !value2) ? 0.5 : 1 }}
              >
                Calculate Percentage
              </button>
            </div>

            {result && (
              <div className="calc-result text-center">
                <h3 className="font-semibold mb-4">Result</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {result.formatted}
                </div>
                <p className="text-gray-600 text-sm">
                  {result.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* BC Commands Section */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-900">BC Command Equivalent</h3>
          </div>
          
          <div style={{ border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '1rem' }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Percentage Calculation with BC</h4>
              <button onClick={copyCommand} className="btn btn-secondary btn-sm">
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </button>
            </div>
            <div className="terminal">
              <code>{`echo "scale=2; (${value1 || 'PERCENTAGE'} / 100) * ${value2 || 'VALUE'}" | bc`}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
