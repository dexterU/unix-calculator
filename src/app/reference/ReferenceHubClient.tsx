'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ArticlePageShell } from '@/components/ArticlePageShell'

const CARDS = [
  {
    href: '/reference/leap-seconds',
    title: 'Leap seconds',
    description: 'Why they exist, historical table, and how POSIX vs civil UTC differ.',
  },
  {
    href: '/reference/timestamp-precision',
    title: 'Timestamp precision',
    description: 'Seconds through nanoseconds, Y2038, and language-level limits.',
  },
  {
    href: '/reference/timestamp-formats',
    title: 'Timestamp formats',
    description: 'ISO 8601, RFC 3339, Unix seconds, HTTP-Date, and when to use each.',
  },
  {
    href: '/knowledge/c-cpp-unix-timestamps',
    title: 'C/C++ Unix timestamps',
    description: 'time_t, struct timespec, and portability across platforms.',
  },
  {
    href: '/knowledge/golang-unix-timestamps',
    title: 'Go Unix timestamps',
    description: 'time.Time, monotonic clocks, and JSON marshaling.',
  },
] as const

export default function ReferenceHubClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Learn · Reference</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unix &amp; Developer Reference Hub
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
          Curated references for epoch time, precision, and language APIs — deep enough for production debugging.
        </p>

        <ul className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-xl border border-terminal-border bg-terminal-surface p-6 transition-colors hover:border-terminal-green/45"
              >
                <h2 className="text-base font-semibold text-foreground group-hover:text-terminal-green">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-terminal-green">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </ArticlePageShell>
  )
}
