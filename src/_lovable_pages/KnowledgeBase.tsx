'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'

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

export default function KnowledgeBase() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge base</h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Deep dives on timestamps, limits, and language-specific APIs.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {ARTICLES.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="block h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-base font-semibold text-gray-900">{a.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{a.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
