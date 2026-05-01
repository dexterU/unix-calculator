'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

const ARTICLES = [
  {
    href: '/knowledge/log-timestamp-analysis',
    title: 'Log timestamp analysis',
    description: 'Parse and reason about timestamps in log streams.',
  },
  {
    href: '/knowledge/rate-limiting-timestamps',
    title: 'Rate limiting & timestamps',
    description: 'Windows, counters, and epoch-aligned limits.',
  },
  {
    href: '/knowledge/graphql-timestamps',
    title: 'GraphQL & timestamps',
    description: 'Scalars, serialization, and subscription ordering.',
  },
  {
    href: '/knowledge/c-cpp-unix-timestamps',
    title: 'C/C++ Unix timestamps',
    description: 'time_t, timespec, and portability notes.',
  },
  {
    href: '/knowledge/golang-unix-timestamps',
    title: 'Go Unix timestamps',
    description: 'time.Time, monotonic clocks, and JSON.',
  },
]

export default function KnowledgeBaseClient() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="container max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Knowledge base</h1>
        <p className="mb-10 max-w-2xl text-muted-foreground">
          Deep dives on timestamps, limits, and language-specific APIs.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {ARTICLES.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="block h-full rounded-lg border border-terminal-border bg-terminal-surface p-6 shadow-card transition-colors hover:border-terminal-green/40"
              >
                <h2 className="text-base font-semibold text-foreground">{a.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
