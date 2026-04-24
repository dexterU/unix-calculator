'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { TOOLS_ROUTE_LIST } from '@/lib/toolsRouteList'

export function ToolsIndexPage() {
  const toolLinks = TOOLS_ROUTE_LIST.filter((r) => r.path !== '/tools')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tools</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Command-line style utilities and converters. More routes appear here as
          you sync them from Lovable.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolLinks.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {route.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{route.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
