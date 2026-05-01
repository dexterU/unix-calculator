'use client'

import { PercentageCalculator as PercentageCalculatorUI } from '@/components/PercentageCalculator'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

export default function PercentageCalculatorClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <PercentageCalculatorUI />
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
