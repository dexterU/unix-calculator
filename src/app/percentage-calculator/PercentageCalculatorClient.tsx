'use client'

import { PercentageCalculator as PercentageCalculatorUI } from '@/components/PercentageCalculator'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

export default function PercentageCalculatorClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <PercentageCalculatorUI />
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </div>
    </div>
  )
}
