'use client'

import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function FunctionReferenceClient() {
  return (
    <ArticlePageShell>
      <article>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">
          Reference · GNU bc
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          BC Calculator Function Reference
        </h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Complete reference for GNU bc mathematical functions — useful alongside the Unix Calculator
          math tools that mirror bc-style precision.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Math functions
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          GNU bc provides standard numeric functions. <code className="font-mono text-terminal-cyan">sqrt(x)</code>{' '}
          returns the square root; <code className="font-mono text-terminal-cyan">length(x)</code> returns the number of
          significant digits in x; <code className="font-mono text-terminal-cyan">scale(x)</code> reports the scale of x
          (fractional digits in expressions using that value).
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`scale=10
sqrt(2)
length(3.14159)
scale(1/3)`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          String operations
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          bc treats strings in print statements and can mix lengths with arrays of digits for formatting. For scripted
          pipelines, combine bc with <code className="rounded bg-muted px-1 font-mono text-terminal-cyan">printf</code>{' '}
          for aligned columns.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`# Format bc output to fixed width
printf "%.4f\\n" "$(echo "scale=4; 355/113" | bc -l)"`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Control flow: if / while / for
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Use C-like blocks:{' '}
          <code className="font-mono text-terminal-cyan">{`if (cond) { } else { }`}</code>,{' '}
          <code className="font-mono text-terminal-cyan">{`while (cond) { }`}</code>, and{' '}
          <code className="font-mono text-terminal-cyan">{`for (init; cond; step) { }`}</code>. Conditions are numeric — zero
          is false, any non-zero is true.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`sum = 0
for (i = 1; i <= 10; i++) {
  sum += i
}
sum`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          User-defined functions
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Define reusable functions with{' '}
          <code className="font-mono text-terminal-cyan">{`define name(params) { ... }`}</code>
          . Use <code className="font-mono text-terminal-cyan">auto</code> for locals. Recursion is supported; watch{' '}
          <code className="font-mono text-terminal-cyan">scale</code> to avoid runaway precision cost.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`define factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}
factorial(6)`}
        </pre>
      </article>
    </ArticlePageShell>
  )
}
