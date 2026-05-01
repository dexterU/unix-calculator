'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CHALLENGES = [
  {
    difficulty: 'Easy' as const,
    prompt: 'What Unix timestamp is January 1, 2000 00:00:00 UTC?',
    hint: 'The year 2000 Unix timestamp is a famous milestone. It is roughly 30 years × 365.25 days × 86400 seconds after 1970.',
    normalize: (s: string) => s.trim().replace(/\s+/g, ''),
    check: (s: string) => s === '946684800',
  },
  {
    difficulty: 'Easy' as const,
    prompt: 'How many seconds are in exactly 7 days?',
    hint: '7 × 24 × 60 × 60 = ?',
    normalize: (s: string) => s.trim().replace(/\s+/g, ''),
    check: (s: string) => s === '604800',
  },
  {
    difficulty: 'Medium' as const,
    prompt: 'What is the maximum value of a 32-bit signed Unix timestamp (as an integer)?',
    hint: 'This is 2^31 - 1. The corresponding date is January 19, 2038.',
    normalize: (s: string) => s.trim().replace(/\s+/g, ''),
    check: (s: string) => s === '2147483647',
  },
  {
    difficulty: 'Medium' as const,
    prompt: 'In JavaScript, Date.now() returns timestamps in what unit?',
    hint: 'JavaScript multiplies Unix seconds by 1000. Divide by 1000 to get seconds.',
    normalize: (s: string) => s.trim().toLowerCase().replace(/\.$/, ''),
    check: (s: string) => ['milliseconds', 'millisecond', 'ms'].includes(s),
  },
  {
    difficulty: 'Hard' as const,
    prompt: 'How many leap seconds have been added to UTC since 1972 (through 2017)?',
    hint: 'As of 2017, 27 leap seconds have been inserted. The last in that era was January 1, 2017.',
    normalize: (s: string) => s.trim().replace(/\s+/g, ''),
    check: (s: string) => s === '27',
  },
] as const

function DifficultyBadge({ level }: { level: (typeof CHALLENGES)[number]['difficulty'] }) {
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
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [answered, setAnswered] = useState(false)
  const [scoreCount, setScoreCount] = useState(0)
  const [solved, setSolved] = useState<Set<number>>(() => new Set())

  const [showSummary, setShowSummary] = useState(false)

  const total = CHALLENGES.length
  const challenge = CHALLENGES[idx]
  const isLast = idx === total - 1

  const progressPct = useMemo(() => Math.round((scoreCount / total) * 100), [scoreCount, total])

  const checkAnswer = useCallback(() => {
    const raw = challenge.normalize(input)
    const ok = challenge.check(raw)
    if (ok) {
      setFeedback('correct')
      if (!solved.has(idx)) {
        const next = new Set(solved)
        next.add(idx)
        setSolved(next)
        setScoreCount((n) => n + 1)
      }
    } else {
      setFeedback('wrong')
    }
    setAnswered(true)
  }, [challenge, input, idx, solved])

  const nextChallenge = useCallback(() => {
    if (isLast) {
      setShowSummary(true)
      return
    }
    setIdx((i) => i + 1)
    setInput('')
    setFeedback('idle')
    setAnswered(false)
  }, [isLast])

  const restart = useCallback(() => {
    setIdx(0)
    setInput('')
    setFeedback('idle')
    setAnswered(false)
    setScoreCount(0)
    setSolved(new Set())
    setShowSummary(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Learn · Practice</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Unix Timestamp Challenges</h1>
        <p className="mt-2 text-muted-foreground">Test your timestamp knowledge — type an answer and check it.</p>

        <div className="mt-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-sm font-semibold text-foreground">
              Score: {scoreCount} / {total}
            </span>
            <span className="font-mono text-xs text-muted-foreground">Challenge {idx + 1} of {total}</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-terminal-border bg-background">
            <div
              className="h-full bg-terminal-green transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {!showSummary ? (
          <div className="mt-8 rounded-xl border border-terminal-border bg-terminal-surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyBadge level={challenge.difficulty} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{challenge.prompt}</h2>
            <div className="mt-4 space-y-2">
              <label htmlFor="challenge-answer" className="font-mono text-xs text-muted-foreground">
                Your answer
              </label>
              <Input
                id="challenge-answer"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setFeedback('idle')
                  setAnswered(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !answered) checkAnswer()
                }}
                className="border-terminal-border bg-background font-mono text-terminal-green"
                autoComplete="off"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={checkAnswer}
                disabled={answered}
                className="bg-terminal-green font-mono text-[hsl(var(--terminal-bg))] hover:bg-terminal-green/90"
              >
                Check Answer
              </Button>
              {answered ? (
                <Button type="button" variant="outline" onClick={nextChallenge}>
                  {isLast ? 'Finish' : 'Next Challenge'}
                </Button>
              ) : null}
            </div>
            {feedback === 'correct' ? (
              <p className="mt-4 font-mono text-sm text-terminal-green">Correct! ✓</p>
            ) : null}
            {feedback === 'wrong' ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Not quite — hint: <span className="text-foreground">{challenge.hint}</span>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-terminal-green/40 bg-terminal-green/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-terminal-green">Challenge Complete!</h2>
            <p className="mt-3 text-muted-foreground">
              You finished all {total} challenges — score {scoreCount}/{total} first-time correct. Share Unix Calculator
              with a teammate who still mixes seconds and milliseconds.
            </p>
            <Button type="button" variant="outline" className="mt-6 border-terminal-border" onClick={restart}>
              Play again
            </Button>
          </div>
        )}

        <p className="mt-10 text-sm text-muted-foreground">
          <Link href="/tutorials/javascript-timestamps" className="text-terminal-green hover:underline">
            Back to tutorials
          </Link>
        </p>
      </main>
    </div>
  )
}
