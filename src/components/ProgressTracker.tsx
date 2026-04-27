'use client'

type ProgressTrackerProps = {
  progress: number
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const pct = Math.min(100, Math.max(0, progress))
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-terminal-border/40 pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)] transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
