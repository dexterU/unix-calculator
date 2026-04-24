'use client'

import { PercentageCalculator as PercentageCalculatorUI } from '@/components/PercentageCalculator'
import { Header } from '@/components/Header'

export default function PercentageCalculator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <PercentageCalculatorUI />
      </div>
    </div>
  )
}
