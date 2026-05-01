'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { TOOLS_ROUTE_LIST } from '@/lib/toolsRouteList'

export function ToolsIndexPage() {
  const toolLinks = TOOLS_ROUTE_LIST.filter((r) => r.path !== '/tools')

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Tools</h1>
        <p className="mb-8 max-w-2xl text-muted-foreground">
          Command-line style utilities and converters. More routes appear here as
          you sync them from Lovable.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolLinks.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className="block rounded-lg border border-terminal-border bg-terminal-surface p-6 shadow-card transition-colors hover:border-terminal-green/40"
              >
                <h2 className="text-lg font-semibold text-foreground">{route.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{route.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
