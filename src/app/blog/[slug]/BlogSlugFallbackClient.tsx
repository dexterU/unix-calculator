'use client'

/**
 * Matches CRA `/blog/:slug` behavior: a single component handled all dynamic slugs.
 * Specific `/blog/...` static segments in the App Router take precedence.
 */
import TimestampPrecision2025Client from '../complete-guide-unix-timestamp-precision-2025/TimestampPrecision2025Client'

export default function BlogSlugFallbackClient() {
  return <TimestampPrecision2025Client />
}
