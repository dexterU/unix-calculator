'use client'

import { AgeCalculator as AgeCalculatorUI } from '@/components/AgeCalculator'
import { Header } from '@/components/Header'

export default function AgeCalculator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <AgeCalculatorUI />
      </div>
    </div>
  )
}
