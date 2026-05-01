'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function CCppUnixTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Knowledge · C/C++</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          C and C++ Unix timestamps
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          <code className="font-mono text-terminal-cyan">time_t</code>, <code className="font-mono text-terminal-cyan">timespec</code>, and
          portability between POSIX, Windows CRT, and embedded libc builds.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">time_t size</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          On many platforms <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">time_t</code> is 64-bit; on legacy
          32-bit embedded toolchains it may still be 32-bit — audit before shipping firmware that must survive past 2038.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Clock sources</h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <code className="font-mono text-terminal-cyan">CLOCK_REALTIME</code> — wall; subject to NTP step adjustments.
          </li>
          <li>
            <code className="font-mono text-terminal-cyan">CLOCK_MONOTONIC</code> — for durations; never map to calendar without care.
          </li>
        </ul>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Example</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`#include <time.h>
time_t now = time(NULL);
struct timespec ts;
clock_gettime(CLOCK_REALTIME, &ts);  // sec + nsec`}
        </pre>

        <p className="text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Compare with higher-level tools
          </Link>
          .
        </p>
      </article>
    </ArticlePageShell>
  )
}
