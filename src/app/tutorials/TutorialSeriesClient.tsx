'use client'

import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

/** Replace with your Lovable page (this file path). */
export default function TutorialSeriesClient() {
  return (
    <div className="container max-w-4xl py-12">
      <RelatedGuides guides={DEFAULT_GUIDES} />
    </div>
  )
}
