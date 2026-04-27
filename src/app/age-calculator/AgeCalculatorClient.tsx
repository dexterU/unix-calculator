'use client'

import { AgeCalculator as AgeCalculatorUI } from '@/components/AgeCalculator'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'

export default function AgeCalculatorClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <AgeCalculatorUI />
        <RelatedGuides guides={getRelatedGuides('age-calculator')} />
      </div>
    </div>
  )
}
