'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { NewsletterCapture } from '@/components/NewsletterCapture'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

type Challenge = {
  id: number
  difficulty: Difficulty
  category: string
  question: string
  acceptedAnswers: string[]
  hint: string
  explanation: string
  codeExample: string
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    difficulty: 'Easy',
    category: 'Epoch Basics',
    question: 'What Unix timestamp is January 1, 2000 00:00:00 UTC?',
    acceptedAnswers: ['946684800'],
    hint: 'The year 2000 is roughly 30 years × 365.25 days × 86400 seconds after 1970.',
    explanation:
      'January 1, 2000 00:00:00 UTC = 946684800. This was a famous milestone — the Y2K boundary.',
    codeExample: `// Verify in JavaScript
new Date(946684800 * 1000).toISOString()
// "2000-01-01T00:00:00.000Z"`,
  },
  {
    id: 2,
    difficulty: 'Easy',
    category: 'Epoch Basics',
    question: 'What year does Unix timestamp 0 represent?',
    acceptedAnswers: ['1970'],
    hint: 'Timestamp 0 is the Unix epoch — the starting point all timestamps count from.',
    explanation: 'Unix timestamp 0 = January 1, 1970 00:00:00 UTC. This is the Unix epoch.',
    codeExample: `new Date(0).toISOString()
// "1970-01-01T00:00:00.000Z"`,
  },
  {
    id: 3,
    difficulty: 'Easy',
    category: 'Time Math',
    question: 'How many seconds are in exactly one day?',
    acceptedAnswers: ['86400'],
    hint: '24 hours × 60 minutes × 60 seconds.',
    explanation: '86400 = 24 × 60 × 60. This constant appears everywhere in timestamp math.',
    codeExample: `const ONE_DAY = 24 * 60 * 60; // 86400
const tomorrow = Date.now()/1000 + ONE_DAY;`,
  },
  {
    id: 4,
    difficulty: 'Easy',
    category: 'JavaScript',
    question: "JavaScript's Date.now() returns time in what unit — seconds or milliseconds?",
    acceptedAnswers: ['milliseconds', 'ms', 'millisecond'],
    hint: 'JavaScript multiplies Unix seconds by 1000. Divide by 1000 to get seconds.',
    explanation:
      'Date.now() returns milliseconds. To get Unix seconds: Math.floor(Date.now() / 1000)',
    codeExample: `Date.now()          // 1733529600000 (ms)
Date.now() / 1000   // 1733529600 (seconds)
Math.floor(Date.now() / 1000) // safe integer`,
  },
  {
    id: 5,
    difficulty: 'Easy',
    category: 'JavaScript',
    question: 'What month does new Date(2024, 1, 15) represent in JavaScript?',
    acceptedAnswers: ['february', 'feb', '2'],
    hint: 'JavaScript months are 0-indexed. January = 0, February = 1.',
    explanation:
      'Month 1 = February. This 0-indexed month is one of the most common JS date bugs.',
    codeExample: `new Date(2024, 0, 15) // January 15
new Date(2024, 1, 15) // February 15
new Date(2024, 11, 15) // December 15`,
  },
  {
    id: 6,
    difficulty: 'Easy',
    category: 'Epoch Basics',
    question: 'Is Unix timestamp -86400 a valid timestamp?',
    acceptedAnswers: ['yes', 'true', 'valid'],
    hint: 'Negative timestamps count backwards from January 1, 1970.',
    explanation:
      '-86400 = December 31, 1969 00:00:00 UTC. Negative timestamps are valid and represent pre-1970 dates.',
    codeExample: `new Date(-86400 * 1000).toISOString()
// "1969-12-31T00:00:00.000Z"`,
  },
  {
    id: 7,
    difficulty: 'Easy',
    category: 'Format Detection',
    question: 'How many digits does a Unix timestamp in seconds typically have today (2024–2026)?',
    acceptedAnswers: ['10'],
    hint: 'Current timestamps are around 1.7 billion seconds. Count the digits.',
    explanation: '10 digits — e.g. 1733529600. Timestamps will stay 10 digits until November 2286.',
    codeExample: `// Quick digit check
const ts = Math.floor(Date.now() / 1000);
ts.toString().length // 10`,
  },
  {
    id: 8,
    difficulty: 'Easy',
    category: 'Format Detection',
    question: 'How many digits does a Unix timestamp in milliseconds have?',
    acceptedAnswers: ['13'],
    hint: 'Milliseconds = seconds × 1000, which adds 3 digits.',
    explanation:
      '13 digits — e.g. 1733529600000. The digit count is how you distinguish seconds from milliseconds.',
    codeExample: `Date.now().toString().length // 13
// 10 digits = seconds
// 13 digits = milliseconds`,
  },
  {
    id: 9,
    difficulty: 'Easy',
    category: 'Terminology',
    question: 'UTC stands for what?',
    acceptedAnswers: ['coordinated universal time'],
    hint: 'The acronym is from the French "Temps Universel Coordonné" — hence UTC not CUT.',
    explanation: 'Coordinated Universal Time. UTC is the basis for all timezone offsets worldwide.',
    codeExample: `// Always store in UTC
new Date().toISOString() // ends in Z = UTC
// Convert for display only, store UTC`,
  },
  {
    id: 10,
    difficulty: 'Easy',
    category: 'Epoch Basics',
    question: 'What is the Unix epoch — the starting point all timestamps count from?',
    acceptedAnswers: [
      'january 1 1970',
      'january 1, 1970',
      'jan 1 1970',
      'jan 1, 1970',
      '1970-01-01',
      'january 1st 1970',
    ],
    hint: 'It is midnight UTC on the first day of 1970.',
    explanation:
      'January 1, 1970 00:00:00 UTC. Chosen by Unix developers as a convenient round number.',
    codeExample: `new Date(0).toISOString()
// "1970-01-01T00:00:00.000Z"`,
  },
  {
    id: 11,
    difficulty: 'Medium',
    category: 'Format Detection',
    question: 'A timestamp reads 1705329000. Is it in seconds or milliseconds?',
    acceptedAnswers: ['seconds', 'second'],
    hint: 'Count the digits. 10 digits = seconds, 13 digits = milliseconds.',
    explanation:
      '1705329000 has 10 digits = seconds. It resolves to January 15, 2024.',
    codeExample: `const ts = 1705329000;
ts.toString().length // 10 → seconds
new Date(ts * 1000).toISOString()
// "2024-01-15T11:30:00.000Z"`,
  },
  {
    id: 12,
    difficulty: 'Medium',
    category: 'JavaScript',
    question:
      'You pass a Unix timestamp in seconds directly to new Date() without multiplying by 1000. What era does the resulting date show?',
    acceptedAnswers: ['1970', 'january 1970', 'jan 1970'],
    hint: 'new Date() expects milliseconds. Passing seconds gives a date 1000× too small.',
    explanation:
      'new Date(1733529600) = January 21, 1970. Off by 1000×. Always multiply by 1000.',
    codeExample: `// WRONG — date in 1970
new Date(1733529600).toISOString()
// "1970-01-21T..."

// RIGHT
new Date(1733529600 * 1000).toISOString()
// "2024-12-07T..."`,
  },
  {
    id: 13,
    difficulty: 'Medium',
    category: 'Y2038',
    question: 'What is the maximum value of a signed 32-bit integer?',
    acceptedAnswers: ['2147483647', '2,147,483,647'],
    hint: 'It is 2^31 - 1. This is the Y2038 overflow boundary.',
    explanation:
      '2147483647 = January 19, 2038 03:14:07 UTC. After this, 32-bit systems overflow.',
    codeExample: `// Y2038 boundary
new Date(2147483647 * 1000).toISOString()
// "2038-01-19T03:14:07.000Z"

// Check if your system is affected:
// Any 32-bit time_t field is vulnerable`,
  },
  {
    id: 14,
    difficulty: 'Medium',
    category: 'Y2038',
    question: 'What date does the Y2038 problem occur on?',
    acceptedAnswers: [
      'january 19 2038',
      'january 19, 2038',
      'jan 19 2038',
      '2038-01-19',
      'january 19th 2038',
    ],
    hint: 'It is when a signed 32-bit integer storing Unix seconds overflows.',
    explanation:
      'January 19, 2038 03:14:07 UTC. After this, 32-bit time_t wraps to a large negative number representing 1901.',
    codeExample: `const Y2038 = 2147483647;
new Date(Y2038 * 1000).toISOString()
// "2038-01-19T03:14:07.000Z"

// Fix: migrate to 64-bit integers`,
  },
  {
    id: 15,
    difficulty: 'Medium',
    category: 'Timezones',
    question:
      'A server in Tokyo stores "2025-01-01 09:00:00" as DATETIME with no timezone. A user in New York sees the wrong time. What is the root cause?',
    acceptedAnswers: [
      'no timezone',
      'missing timezone',
      'timezone naive',
      'datetime is timezone naive',
      'no tz',
      'timezone-naive',
    ],
    hint: 'MySQL DATETIME stores the literal value you give it — it has no concept of timezone.',
    explanation:
      'DATETIME is timezone-naive. It stored JST (09:00) but displayed as local time in other timezones. Use TIMESTAMPTZ (PostgreSQL) or store Unix timestamps.',
    codeExample: `-- Wrong: DATETIME is timezone-naive
stored: "2025-01-01 09:00:00" (ambiguous)

-- Right: TIMESTAMPTZ stores UTC internally
stored: 2025-01-01 00:00:00+00
-- Converts correctly for any timezone`,
  },
  {
    id: 16,
    difficulty: 'Medium',
    category: 'DST',
    question: 'What does DST stand for?',
    acceptedAnswers: ['daylight saving time', 'daylight savings time', 'daylight saving'],
    hint: 'It is the practice of moving clocks forward in spring and back in fall.',
    explanation:
      'Daylight Saving Time. DST causes clocks to spring forward (gap) and fall back (duplicate hour), both of which break naive timestamp scheduling.',
    codeExample: `// DST gap: 2:00 AM → 3:00 AM (spring)
// 2:30 AM does not exist on this day

// DST overlap: 2:00 AM → 1:00 AM (fall)
// 1:30 AM occurs TWICE — different UTC values`,
  },
  {
    id: 17,
    difficulty: 'Medium',
    category: 'Databases',
    question:
      'Which PostgreSQL column type stores timestamps with microsecond precision AND timezone awareness?',
    acceptedAnswers: ['timestamptz', 'timestamp with time zone', 'timestamp with timezone'],
    hint: 'It is the recommended type for all production timestamp storage in PostgreSQL.',
    explanation:
      'TIMESTAMPTZ stores UTC internally and converts on read. TIMESTAMP (without tz) is naive and timezone-ambiguous.',
    codeExample: `-- Recommended
created_at TIMESTAMPTZ DEFAULT NOW()

-- Avoid for cross-timezone apps  
created_at TIMESTAMP  -- no timezone info`,
  },
  {
    id: 18,
    difficulty: 'Medium',
    category: 'Epoch Basics',
    question: 'What Unix timestamp represents midnight UTC on January 1, 2024?',
    acceptedAnswers: ['1704067200'],
    hint: 'Use an epoch converter or: python3 -c "from datetime import datetime,timezone; print(int(datetime(2024,1,1,tzinfo=timezone.utc).timestamp()))"',
    explanation:
      '1704067200. Knowing landmark timestamps helps you quickly sanity-check values in production.',
    codeExample: `// JavaScript
new Date('2024-01-01T00:00:00Z').getTime() / 1000
// 1704067200

// Python
from datetime import datetime, timezone
datetime(2024,1,1,tzinfo=timezone.utc).timestamp()
# 1704067200.0`,
  },
  {
    id: 19,
    difficulty: 'Medium',
    category: 'Time Math',
    question: 'A leap year has 366 days. How many MORE seconds does it have compared to a regular year?',
    acceptedAnswers: ['86400'],
    hint: 'One extra day × seconds per day.',
    explanation:
      '86400 — one extra day. This is why calculating age as totalSeconds / 31536000 is slightly wrong — it ignores leap years.',
    codeExample: `const regularYear = 365 * 86400; // 31536000
const leapYear    = 366 * 86400; // 31622400
const difference  = leapYear - regularYear; // 86400`,
  },
  {
    id: 20,
    difficulty: 'Medium',
    category: 'Time Math',
    question:
      "You calculate a user's age as Math.floor(secondsSinceBirth / 31536000). What is the flaw in this approach?",
    acceptedAnswers: [
      'leap years',
      'ignores leap years',
      'does not account for leap years',
      'leap year',
    ],
    hint: 'Not every year has the same number of seconds.',
    explanation:
      'It ignores leap years. Every 4 years there are 86400 extra seconds, causing the age calculation to drift by ~1 day every 4 years.',
    codeExample: `// Wrong: fixed seconds per year
const age = Math.floor(elapsed / 31536000);

// Right: use date arithmetic
const birth = new Date(birthTs * 1000);
const now = new Date();
let age = now.getFullYear() - birth.getFullYear();
// then adjust for birthday not yet passed`,
  },
  {
    id: 21,
    difficulty: 'Hard',
    category: 'JavaScript Precision',
    question:
      "What is JavaScript's Number.MAX_SAFE_INTEGER and why does it matter for nanosecond timestamps?",
    acceptedAnswers: [
      '9007199254740991',
      '9,007,199,254,740,991',
      '2^53-1',
      '2^53 - 1',
    ],
    hint: 'JavaScript numbers are 64-bit IEEE 754 doubles. They cannot represent every integer above this value.',
    explanation:
      '9007199254740991 (2^53 - 1). Current nanosecond timestamps (~1.7×10^18) far exceed this, causing silent precision loss when stored as JS Numbers.',
    codeExample: `Number.MAX_SAFE_INTEGER // 9007199254740991

// Nanosecond timestamp (too large for safe integer)
const ns = 1733529600000000000n; // BigInt required
console.log(typeof ns); // "bigint"

// Never store nanosecond ts as Number in JS`,
  },
  {
    id: 22,
    difficulty: 'Hard',
    category: 'DST',
    question:
      'Two different Unix timestamps can both represent "2024-11-03 01:30:00 America/New_York". Why?',
    acceptedAnswers: [
      'dst fall back',
      'daylight saving time fall back',
      'fall back',
      'clock falls back',
      'dst overlap',
      'clocks go back',
    ],
    hint: 'In the fall, clocks go back one hour. What happens to the hour that repeats?',
    explanation:
      'DST fall-back: 2:00 AM reverts to 1:00 AM, so 1:30 AM occurs twice — once at UTC-4 (EDT) and once at UTC-5 (EST). Both map to different UTC timestamps.',
    codeExample: `// 1:30 AM EDT (UTC-4) 
// 2024-11-03T05:30:00Z → Unix: 1730609400

// 1:30 AM EST (UTC-5) — after fall-back
// 2024-11-03T06:30:00Z → Unix: 1730613000

// Same wall clock time, different UTC values
// Always store UTC — never local time`,
  },
  {
    id: 23,
    difficulty: 'Hard',
    category: 'Go',
    question: 'A Go service calls time.Now().UnixNano() on a date far in the future. What is the risk?',
    acceptedAnswers: [
      'int64 overflow',
      'overflow',
      'integer overflow',
    ],
    hint: 'UnixNano() returns int64. What happens when nanoseconds since 1970 exceed the int64 max?',
    explanation:
      'int64 overflow. UnixNano() cannot correctly represent times beyond roughly ±292 years from 1970 (year ~2262). After that, it overflows silently.',
    codeExample: `// Go int64 max nanoseconds: ~year 2262
// time.Now().UnixNano() on future dates overflows

// Safe alternative for far-future dates:
t := time.Now()
sec := t.Unix()        // int64 seconds (safe)
ns  := t.Nanosecond()  // 0-999999999 (safe)`,
  },
  {
    id: 24,
    difficulty: 'Hard',
    category: 'Data Types',
    question: "Why can't you reliably store nanosecond-precision Unix timestamps in a JSON number field?",
    acceptedAnswers: [
      'ieee 754',
      'floating point',
      'double precision',
      'float64',
      'not enough precision',
      'json numbers are doubles',
      'ieee 754 double',
    ],
    hint: 'JSON numbers are IEEE 754 64-bit doubles. What is their integer precision limit?',
    explanation:
      'JSON numbers are IEEE 754 doubles with 53-bit mantissa (max safe integer: 9007199254740991). Nanosecond timestamps exceed this, causing silent rounding.',
    codeExample: `// JSON silently loses precision
const ns = 1733529600123456789;
JSON.parse(JSON.stringify(ns))
// 1733529600123456800  ← wrong!

// Fix: use string in JSON
{ "timestamp_ns": "1733529600123456789" }`,
  },
  {
    id: 25,
    difficulty: 'Hard',
    category: 'C/POSIX',
    question: 'What POSIX function should you prefer over gettimeofday() for new C code, and why?',
    acceptedAnswers: ['clock_gettime', 'clock_gettime()'],
    hint: 'It was introduced in POSIX.1-2001 and supports multiple clock sources including CLOCK_MONOTONIC.',
    explanation:
      'clock_gettime(). gettimeofday() is legacy/deprecated in POSIX.1-2008. clock_gettime() offers nanosecond resolution, monotonic clocks, and is the modern standard.',
    codeExample: `// Legacy — avoid in new code
struct timeval tv;
gettimeofday(&tv, NULL);

// Modern — prefer this
struct timespec ts;
clock_gettime(CLOCK_REALTIME, &ts);
// ts.tv_sec  = seconds
// ts.tv_nsec = nanoseconds

// For timing (not wall clock) use CLOCK_MONOTONIC
clock_gettime(CLOCK_MONOTONIC, &ts);`,
  },
]

const TOTAL = 25

type Tab = 'all' | Difficulty

function normalizeResponse(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/,/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\(\)\s*$/g, '')
    .replace(/^\s+|\s+$/g, '')
}

function matchesAccepted(user: string, accepted: string[]): boolean {
  const u = normalizeResponse(user)
  const uCompact = u.replace(/\s/g, '')
  if (!u && !uCompact) return false
  return accepted.some((a) => {
    const na = normalizeResponse(a)
    const naCompact = na.replace(/\s/g, '')
    return u === na || (uCompact === naCompact && naCompact.length > 0)
  })
}

function DifficultyBadge({ level }: { level: Difficulty }) {
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
  const [tab, setTab] = useState<Tab>('all')
  const [cursor, setCursor] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [answered, setAnswered] = useState(false)
  const [solvedIds, setSolvedIds] = useState<Set<number>>(() => new Set())
  const [attemptedCount, setAttemptedCount] = useState(0)
  const [wrongById, setWrongById] = useState<Record<number, number>>({})
  const [codeOpenById, setCodeOpenById] = useState<Record<number, boolean>>({})
  const [copiedShare, setCopiedShare] = useState(false)

  const filtered = useMemo(() => {
    if (tab === 'all') return CHALLENGES
    return CHALLENGES.filter((c) => c.difficulty === tab)
  }, [tab])

  const challenge = filtered[cursor] ?? filtered[0]

  useEffect(() => {
    setCursor(0)
  }, [tab])

  useEffect(() => {
    if (cursor >= filtered.length) setCursor(Math.max(0, filtered.length - 1))
  }, [filtered.length, cursor])

  const easyCount = CHALLENGES.filter((c) => c.difficulty === 'Easy').length
  const medCount = CHALLENGES.filter((c) => c.difficulty === 'Medium').length
  const hardCount = CHALLENGES.filter((c) => c.difficulty === 'Hard').length

  const completedCount = solvedIds.size
  const progressPct = Math.round((completedCount / TOTAL) * 100)
  const scorePct = Math.round((completedCount / TOTAL) * 100)

  const challengeId = challenge?.id
  useEffect(() => {
    if (challengeId == null) return
    if (solvedIds.has(challengeId)) {
      setFeedback('correct')
      setAnswered(true)
      setInput('')
    } else {
      setFeedback('idle')
      setAnswered(false)
      setInput('')
    }
  }, [challengeId, tab, completedCount, solvedIds])

  const wrongCount = challenge ? wrongById[challenge.id] ?? 0 : 0
  const showExplanationWrong = feedback === 'wrong' && wrongCount >= 2

  const checkAnswer = useCallback(() => {
    if (!challenge) return
    setAttemptedCount((n) => n + 1)
    const ok = matchesAccepted(input, challenge.acceptedAnswers)
    if (ok) {
      setFeedback('correct')
      setSolvedIds((prev) => {
        const next = new Set(prev)
        next.add(challenge.id)
        return next
      })
    } else {
      setFeedback('wrong')
      setWrongById((prev) => ({
        ...prev,
        [challenge.id]: (prev[challenge.id] ?? 0) + 1,
      }))
    }
    setAnswered(true)
  }, [challenge, input])

  const goPrev = useCallback(() => {
    setCursor((i) => Math.max(0, i - 1))
  }, [])

  const goNext = useCallback(() => {
    setCursor((i) => Math.min(filtered.length - 1, i + 1))
  }, [filtered.length])

  const toggleCode = useCallback((id: number) => {
    setCodeOpenById((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const restart = useCallback(() => {
    setSolvedIds(new Set())
    setAttemptedCount(0)
    setWrongById({})
    setCodeOpenById({})
    setCursor(0)
    setInput('')
    setFeedback('idle')
    setAnswered(false)
    setCopiedShare(false)
  }, [])

  const shareText = `I scored ${completedCount}/${TOTAL} on the Unix Timestamp Challenges at unixcalculator.com/challenges 🕐`

  const copyShare = useCallback(() => {
    void navigator.clipboard.writeText(shareText)
    setCopiedShare(true)
    window.setTimeout(() => setCopiedShare(false), 2000)
  }, [shareText])

  const allComplete = completedCount >= TOTAL

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: TOTAL },
    { key: 'Easy', label: 'Easy', count: easyCount },
    { key: 'Medium', label: 'Medium', count: medCount },
    { key: 'Hard', label: 'Hard', count: hardCount },
  ]

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 font-mono text-3xl font-bold text-foreground">Unix Timestamp Challenges</h1>
          <p className="text-muted-foreground">
            25 challenges across 3 difficulty levels. Test your real-world timestamp knowledge.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={String(t.key)}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  'rounded-lg border px-4 py-2 font-mono text-sm transition-colors',
                  active
                    ? 'border-transparent bg-terminal-green text-terminal-bg'
                    : 'border-terminal-border bg-terminal-surface text-foreground hover:border-terminal-green/40'
                )}
              >
                {t.label} ({t.count})
              </button>
            )
          })}
        </div>

        <div className="mb-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-sm font-semibold text-foreground">
              {completedCount} / {TOTAL} completed · {scorePct}%
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Attempts: {attemptedCount}
            </span>
          </div>
          <p className="mt-1 text-center font-mono text-sm text-terminal-green">
            🎯 {completedCount} / {TOTAL} Complete!
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-terminal-border bg-background">
            <div
              className="h-full bg-terminal-green transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {allComplete ? (
          <div className="mb-8 rounded-xl border border-terminal-green/50 bg-terminal-green/10 p-8 text-center">
            <p className="font-mono text-lg font-bold text-terminal-green">
              You&apos;ve mastered Unix timestamps. Share your score:
            </p>
            <p className="mt-2 text-sm text-muted-foreground">🏆 All 25 challenges solved — confetti-worthy precision.</p>
            <Button
              type="button"
              className="mt-6 bg-terminal-green font-mono text-terminal-bg hover:bg-terminal-green/90"
              onClick={copyShare}
            >
              {copiedShare ? '✓ Copied' : 'Copy share message'}
            </Button>
            <Button type="button" variant="outline" className="mt-3 ml-0 block w-full border-terminal-border sm:ml-3 sm:inline-block sm:w-auto" onClick={restart}>
              Play again
            </Button>
          </div>
        ) : null}

        {allComplete ? <NewsletterCapture source="challenges" /> : null}

        {challenge ? (
          <div className="rounded-xl border border-terminal-border bg-terminal-surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyBadge level={challenge.difficulty} />
              <span className="rounded border border-terminal-cyan/30 px-2 py-0.5 font-mono text-xs text-terminal-cyan">
                {challenge.category}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                #{challenge.id} · {cursor + 1} / {filtered.length} in view
              </span>
            </div>

            <h2 className="mt-4 text-lg font-semibold leading-snug text-foreground">{challenge.question}</h2>

            <div className="mt-4 space-y-2">
              <label htmlFor="challenge-answer" className="font-mono text-xs text-muted-foreground">
                Your answer
              </label>
              <Input
                id="challenge-answer"
                value={input}
                disabled={answered && feedback === 'correct'}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (!answered) return
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
                disabled={answered && feedback === 'correct'}
                className="bg-terminal-green font-mono text-terminal-bg hover:bg-terminal-green/90"
              >
                Check Answer
              </Button>
              <Button type="button" variant="outline" className="border-terminal-border" onClick={goPrev} disabled={cursor <= 0}>
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-terminal-border"
                onClick={goNext}
                disabled={cursor >= filtered.length - 1}
              >
                Next
              </Button>
            </div>

            {solvedIds.has(challenge.id) && feedback !== 'wrong' ? (
              <p className="mt-3 font-mono text-sm text-terminal-green">Solved ✓</p>
            ) : null}

            {feedback === 'correct' ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-terminal-green">✓ {challenge.explanation}</p>
                <button
                  type="button"
                  onClick={() => toggleCode(challenge.id)}
                  className="font-mono text-xs text-terminal-cyan underline hover:no-underline"
                >
                  {codeOpenById[challenge.id] ? 'Hide the code' : 'See the code'}
                </button>
                {codeOpenById[challenge.id] ? (
                  <pre className="overflow-x-auto whitespace-pre rounded border border-terminal-border bg-background p-4 font-mono text-sm text-cyan-400">
                    {challenge.codeExample}
                  </pre>
                ) : null}
              </div>
            ) : null}

            {feedback === 'wrong' ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Not quite — hint: <span className="text-foreground">{challenge.hint}</span>
                </p>
                {showExplanationWrong ? (
                  <p className="text-sm font-medium text-amber-200">{challenge.explanation}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Check again — explanation unlocks after another wrong attempt.</p>
                )}
                {!answered ? null : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-terminal-border font-mono text-xs"
                    onClick={() => {
                      setInput('')
                      setFeedback('idle')
                      setAnswered(false)
                    }}
                  >
                    Try again
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        {!allComplete && completedCount > 0 ? (
          <div className="mt-6 text-center">
            <Button type="button" variant="outline" className="border-terminal-border font-mono text-xs" onClick={copyShare}>
              {copiedShare ? '✓ Copied' : 'Share progress'}
            </Button>
          </div>
        ) : null}

        <p className="mt-10 text-sm text-muted-foreground">
          <Link href="/tutorials/javascript-timestamps" className="text-terminal-green hover:underline">
            Back to tutorials
          </Link>
        </p>
      </main>
    </div>
  )
}
