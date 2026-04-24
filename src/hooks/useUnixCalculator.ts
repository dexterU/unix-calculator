import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface CalculationHistory {
  expression: string
  result: string
  timestamp: Date
}

export function useUnixCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [scale, setScale] = useState(10)

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('unix-calc-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
      } catch (e) {
        console.error('Failed to load history:', e)
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('unix-calc-history', JSON.stringify(history))
  }, [history])

  const processBCExpression = useCallback((expr: string): string => {
    try {
      // Handle scale setting
      let workingExpr = expr
      const scaleMatch = expr.match(/scale=(\d+)/)
      if (scaleMatch) {
        setScale(parseInt(scaleMatch[1]))
        workingExpr = expr.replace(/scale=\d+;?\s*/, '')
      }

      if (!workingExpr.trim()) {
        return ''
      }

      // Replace BC functions with JavaScript equivalents
      workingExpr = workingExpr
        .replace(/\^/g, '**') // Power operator
        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
        .replace(/log\(([^)]+)\)/g, 'Math.log($1)')
        .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)')
        .replace(/atan\(([^)]+)\)/g, 'Math.atan($1)')
        // BC single-letter functions
        .replace(/s\(([^)]+)\)/g, 'Math.sin($1)')
        .replace(/c\(([^)]+)\)/g, 'Math.cos($1)')
        .replace(/a\(([^)]+)\)/g, 'Math.atan($1)')
        .replace(/l\(([^)]+)\)/g, 'Math.log($1)')
        .replace(/e\(([^)]+)\)/g, 'Math.exp($1)')

      // Handle base conversions
      let outputBase = 10
      
      const obaseMatch = expr.match(/obase=(\d+)/)
      
      if (obaseMatch) {
        outputBase = parseInt(obaseMatch[1])
        workingExpr = workingExpr.replace(/obase=\d+;?\s*/, '')
      }

      // Evaluate the expression
      const evalResult = Function(`"use strict"; return (${workingExpr})`)()
      
      if (typeof evalResult !== 'number' || !isFinite(evalResult)) {
        throw new Error('Invalid expression')
      }

      // Handle output base conversion
      if (outputBase !== 10) {
        const intResult = Math.floor(evalResult)
        return intResult.toString(outputBase).toUpperCase()
      }

      // Apply scale formatting
      if (scale !== undefined && !Number.isInteger(evalResult)) {
        return parseFloat(evalResult.toFixed(scale)).toString()
      }

      return evalResult.toString()
    } catch (e) {
      throw new Error('Invalid expression or syntax error')
    }
  }, [scale])

  const calculate = useCallback(async (expr?: string) => {
    const expressionToCalculate = expr || expression
    
    if (!expressionToCalculate.trim()) {
      toast.error('Please enter an expression')
      return
    }

    setIsCalculating(true)
    setError(null)

    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      const calculatedResult = processBCExpression(expressionToCalculate)
      setResult(calculatedResult)
      
      // Add to history
      const historyItem: CalculationHistory = {
        expression: expressionToCalculate,
        result: calculatedResult,
        timestamp: new Date()
      }
      
      setHistory(prev => [historyItem, ...prev.slice(0, 49)]) // Keep last 50
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setResult('')
    } finally {
      setIsCalculating(false)
    }
  }, [expression, processBCExpression])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('unix-calc-history')
    toast.success('History cleared')
  }, [])

  const clearAll = useCallback(() => {
    setExpression('')
    setResult('')
    setError(null)
  }, [])

  return {
    expression,
    setExpression,
    result,
    error,
    isCalculating,
    calculate,
    history,
    clearHistory,
    clearAll,
    scale,
    setScale
  }
}