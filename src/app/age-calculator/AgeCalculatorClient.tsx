'use client'

import { AgeCalculator as AgeCalculatorUI } from '@/components/AgeCalculator'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { AdUnit } from '@/components/AdUnit'
import { getRelatedGuides } from '@/lib/related-guides'

export default function AgeCalculatorClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <AgeCalculatorUI />
        <AdUnit slot="1750948984" format="horizontal" className="my-6" />
        <RelatedGuides guides={getRelatedGuides('age-calculator')} />
      </main>
    </div>
  )
}
