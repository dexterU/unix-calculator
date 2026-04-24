'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'

const POSTS = [
  {
    href: '/blog/complete-guide-unix-timestamp-precision-2025',
    title: 'Complete guide: Unix timestamp precision (2025)',
    summary: 'Precision, milliseconds, and common pitfalls.',
  },
  {
    href: '/blog/session-management-timestamp-expiration',
    title: 'Session management & timestamp expiration',
    summary: 'TTLs, cookies, and server-side validation.',
  },
  {
    href: '/blog/caching-strategies-time-sensitive-data',
    title: 'Caching strategies for time-sensitive data',
    summary: 'Stale-while-revalidate and cache keys with time.',
  },
  {
    href: '/blog/graphql-subscriptions-realtime-timestamps',
    title: 'GraphQL subscriptions & realtime timestamps',
    summary: 'Ordering events and clock skew in subscriptions.',
  },
]

export default function BlogNew() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-600 mb-10">
          Articles on Unix time, APIs, and production systems.
        </p>
        <ul className="space-y-6">
          {POSTS.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-gray-900">{p.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{p.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-gray-500">
          Legacy listing:{' '}
          <Link href="/blog-old" className="text-blue-600 hover:underline">
            /blog-old
          </Link>
        </p>
      </main>
    </div>
  )
}
