'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="font-mono text-lg font-semibold text-foreground">Something went wrong</h2>
      {process.env.NODE_ENV === 'development' && error.message ? (
        <pre className="max-h-40 w-full overflow-auto rounded border border-border bg-muted/30 p-3 text-left font-mono text-xs text-muted-foreground">
          {error.message}
        </pre>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md border border-terminal-border bg-terminal-surface px-4 py-2 font-mono text-sm text-foreground hover:border-terminal-green"
      >
        Try again
      </button>
    </div>
  )
}
