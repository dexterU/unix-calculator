'use client'

/**
 * Matches CRA `/blog/:slug` behavior: a single component handled all dynamic slugs.
 * Specific `/blog/...` static segments in the App Router take precedence.
 */
import TimestampPrecision2025 from '@/_lovable_pages/blog/TimestampPrecision2025'

export default function BlogSlugFallbackClient() {
  return <TimestampPrecision2025 />
}
