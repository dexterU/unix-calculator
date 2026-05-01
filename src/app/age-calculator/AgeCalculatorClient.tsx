'use client'

import { AgeCalculator as AgeCalculatorUI } from '@/components/AgeCalculator'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'

export default function AgeCalculatorClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <AgeCalculatorUI />
        <RelatedGuides guides={getRelatedGuides('age-calculator')} />
      </main>
    </div>
  )
}
