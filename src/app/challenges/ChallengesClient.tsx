'use client'

import { ArticlePageShell } from '@/components/ArticlePageShell'
import { cn } from '@/lib/utils'

const CHALLENGES = [
  {
    title: 'Five time zones, one timestamp',
    body: 'Take a single Unix second and render it in UTC, New York, Los Angeles, Tokyo, and Sydney with full locale strings.',
    difficulty: 'Easy' as const,
  },
  {
    title: 'Day of week from any historical Unix timestamp',
    body: 'Without external APIs, derive weekday name; verify against an edge case near a DST transition.',
    difficulty: 'Easy' as const,
  },
  {
    title: 'Exact age of the Unix epoch',
    body: 'Express elapsed years, days, hours, and seconds since 1970-01-01T00:00:00Z using your language’s UTC rules.',
    difficulty: 'Medium' as const,
  },
  {
    title: 'Detect a leap second in a log file',
    body: 'Given lines with timestamps around a known leap insertion, flag repeated or smeared seconds and propose normalization.',
    difficulty: 'Hard' as const,
  },
  {
    title: 'Countdown to Y2038',
    body: 'Build a component that shows remaining seconds until signed 32-bit time_t overflow and animates without drift.',
    difficulty: 'Medium' as const,
  },
] as const

function Badge({ level }: { level: (typeof CHALLENGES)[number]['difficulty'] }) {
  const style =
    level === 'Easy'
      ? 'border-terminal-green/50 bg-terminal-green/15 text-terminal-green'
      : level === 'Medium'
        ? 'border-terminal-border bg-terminal-surface text-foreground'
        : 'border-red-400/50 bg-red-950/30 text-red-300'
  return (
    <span className={cn('rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase', style)}>
      {level}
    </span>
  )
}

export default function ChallengesClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Learn · Practice</p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Unix Timestamp Challenges</h1>
        <p className="mb-10 text-lg text-muted-foreground">Test your timestamp knowledge</p>

        <ul className="space-y-4">
          {CHALLENGES.map((c, i) => (
            <li
              key={c.title}
              className="flex flex-col gap-3 rounded-xl border border-terminal-border bg-terminal-surface p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">#{String(i + 1).padStart(2, '0')}</span>
                  <Badge level={c.difficulty} />
                </div>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </ArticlePageShell>
  )
}
