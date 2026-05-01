'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Wrench } from 'lucide-react'
import { Header } from '@/components/Header'
import { getHomeToolCards } from '@/lib/homepage-tools'
import { cn } from '@/lib/utils'

function formatSearchVolume(volume: number) {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`
  return volume.toString()
}

export default function AllCalculatorsClient() {
  const cards = useMemo(() => {
    const base = getHomeToolCards()
    const hub = {
      id: 'tools-hub',
      name: 'Tools hub',
      description: 'Browse batch processing, log parsing, cron, DB migration helpers, and more.',
      path: '/tools' as const,
      icon: Wrench,
      searchVolume: 200000,
      tab: 'dev' as const,
    }
    return [hub, ...base]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">All calculators &amp; tools</h1>
          <p className="mt-3 max-w-2xl mx-auto font-mono text-sm text-muted-foreground">
            // Every Unix Calculator route in one grid — same terminal cards as the homepage
          </p>
        </div>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}
        >
          {cards.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.id}
                href={tool.path}
                className={cn(
                  'group rounded-xl border border-terminal-border bg-terminal-surface p-4 transition-colors',
                  'hover:border-terminal-green/50'
                )}
              >
                <Icon className="mb-2 h-6 w-6 text-terminal-green" />
                <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-terminal-green">
                  {tool.name}
                </h3>
                <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{tool.description}</p>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground/80">
                  ~{formatSearchVolume(tool.searchVolume)} / mo
                </p>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
