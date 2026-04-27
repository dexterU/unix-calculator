'use client'

/**
 * Matches CRA `/blog/:slug` behavior: a single component handled all dynamic slugs.
 * Specific `/blog/...` static segments in the App Router take precedence.
 */
import TimestampPrecision2025 from '@/_lovable_pages/blog/TimestampPrecision2025'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

export default function BlogSlugFallbackClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TimestampPrecision2025 />
      <div className="container max-w-4xl px-4 pb-12">
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </div>
    </div>
  )
}
