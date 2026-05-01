'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const POSTS = [
  {
    href: '/blog/complete-guide-unix-timestamp-precision-2025',
    title: 'Complete Guide to Unix Timestamp Precision in 2026',
    category: 'Deep Dive',
    readTime: '12 min',
    author: 'Unix Calculator Editorial Team',
    date: 'May 1, 2026',
    featured: true,
    description:
      'Everything engineers need to know about timestamp precision — seconds vs milliseconds vs microseconds, rounding errors in production, and how language runtimes handle precision loss. Use this as your internal standard before changing API schemas or database types.',
  },
  {
    href: '/blog/session-management-timestamp-expiration',
    title: 'Session Management with Timestamp Expiration',
    category: 'Tutorial',
    readTime: '8 min',
    author: 'Unix Calculator Editorial Team',
    date: 'Apr 18, 2026',
    featured: false,
    description:
      'How to implement JWT expiration, sliding session windows, and token refresh correctly using Unix timestamps. Includes Python, JavaScript, and Go patterns you can paste into code review checklists. Server-side clock authority is non-negotiable — we show why.',
  },
  {
    href: '/blog/caching-strategies-time-sensitive-data',
    title: 'Caching Strategies for Time-Sensitive Data',
    category: 'Guide',
    readTime: '7 min',
    author: 'Unix Calculator Editorial Team',
    date: 'Apr 5, 2026',
    featured: false,
    description:
      'TTL-based cache invalidation, timestamp-aware CDN configuration, and avoiding stale data in distributed systems. Learn to compute TTL from absolute expiry instants, emit usable ETags, and keep edge caches honest when producers and consumers disagree on units.',
  },
  {
    href: '/blog/graphql-subscriptions-realtime-timestamps',
    title: 'GraphQL Subscriptions with Real-Time Timestamps',
    category: 'Tutorial',
    readTime: '9 min',
    author: 'Unix Calculator Editorial Team',
    date: 'Mar 22, 2026',
    featured: false,
    description:
      'Transmit, validate, and display timestamps in GraphQL subscriptions. Covers cursor-based pagination using timestamps and real-time feed ordering when throughput spikes. Includes schema patterns for Int seconds vs custom DateTime scalars and how to avoid client clock trust.',
  },
] as const

export default function BlogNewClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unix &amp; Developer Timestamp Guides
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          In-depth tutorials written by senior engineers
        </p>
        <p className="mt-6 leading-relaxed text-muted-foreground">
          Production systems fail at layer boundaries: JSON numbers, ORM defaults, 32-bit drivers, and JavaScript&apos;s
          millisecond ceiling. Each article below ties Unix epoch math to code you can audit — with tables,
          migrations, and counterexamples from real outages. Start with the precision guide if you are standardizing a
          new service; use the session and caching pieces when hardening auth and edge performance.
        </p>

        <ul className="mt-10 space-y-6">
          {POSTS.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="group block rounded-xl border border-terminal-border bg-terminal-surface p-6 transition-colors hover:border-terminal-green/45"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-terminal-border bg-background px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-terminal-green">
                    {p.category}
                  </span>
                  {p.featured ? (
                    <span className="rounded-full border border-amber-500/50 bg-amber-950/40 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                      Featured
                    </span>
                  ) : null}
                  <span className="font-mono text-[10px] text-muted-foreground">{p.readTime}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-foreground group-hover:text-terminal-green">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                  <span>{p.author}</span>
                  <span className="text-terminal-border">·</span>
                  <span>{p.date}</span>
                </div>
                <span
                  className={cn(
                    'mt-4 inline-flex items-center gap-1 font-mono text-xs text-terminal-green',
                    'group-hover:underline'
                  )}
                >
                  Read article <ArrowRight className="h-3 w-3" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-muted-foreground">
          Legacy listing:{' '}
          <Link href="/blog-old" className="text-terminal-green underline hover:no-underline">
            /blog-old
          </Link>
        </p>
      </main>
    </div>
  )
}
