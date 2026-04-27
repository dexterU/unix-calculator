'use client'

import type { LucideIcon } from 'lucide-react'

export type CalculatorsGridItem = {
  id: string
  title: string
  description: string
  searchVolume: number
  difficulty: string
  color: string
  icon: LucideIcon
  component: React.ComponentType | null
}

type CalculatorsGridProps = {
  calculators: CalculatorsGridItem[]
  getDifficultyColor: (d: string) => string
  getIconColor: (c: string) => string
  formatSearchVolume: (n: number) => string
  onOpenCalculator: (id: string) => void
}

export function CalculatorsGrid({
  calculators,
  getDifficultyColor,
  getIconColor,
  formatSearchVolume,
  onOpenCalculator,
}: CalculatorsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {calculators.map((calc) => {
        const Icon = calc.icon
        const enabled = Boolean(calc.component)
        return (
          <div
            key={calc.id}
            role={enabled ? 'button' : undefined}
            tabIndex={enabled ? 0 : undefined}
            onClick={() => enabled && onOpenCalculator(calc.id)}
            onKeyDown={(e) => {
              if (!enabled) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpenCalculator(calc.id)
              }
            }}
            className={[
              'rounded-xl border border-border/80 bg-card/60 p-6 text-card-foreground shadow-sm backdrop-blur-sm transition-shadow',
              'min-w-0 overflow-hidden break-words',
              enabled
                ? 'cursor-pointer hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                : 'cursor-not-allowed opacity-60',
            ].join(' ')}
          >
            <div className="mb-4 flex items-start gap-3 min-w-0">
              <div
                className={`shrink-0 rounded-lg p-3 ${getIconColor(calc.color)}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-foreground break-words">
                  {calc.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getDifficultyColor(calc.difficulty)}`}
                  >
                    {calc.difficulty}
                  </span>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                    Unix
                  </span>
                </div>
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground break-words">
              {calc.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">
                {formatSearchVolume(calc.searchVolume)} monthly searches
              </span>
              <span
                className={
                  enabled
                    ? 'font-medium text-primary'
                    : 'font-medium text-muted-foreground'
                }
              >
                {enabled ? 'Open Calculator →' : 'Coming Soon'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
