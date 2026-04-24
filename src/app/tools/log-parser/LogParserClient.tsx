'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Textarea } from '@/components/ui/textarea'

const ISO =
  /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g
const UNIX = /\b\d{10,13}\b/g

export default function LogParserClient() {
  const [text, setText] = useState('')

  const hits = useMemo(() => {
    const found: { raw: string; kind: string }[] = []
    for (const m of text.matchAll(ISO)) {
      found.push({ raw: m[0], kind: 'iso' })
    }
    for (const m of text.matchAll(UNIX)) {
      const n = Number(m[0])
      if (n > 1e11) continue
      found.push({ raw: m[0], kind: 'unix_s' })
    }
    return found
  }, [text])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Log parser</h1>
          <p className="text-gray-600 max-w-2xl">
            Paste log lines. ISO-8601 timestamps and 10-digit Unix seconds are
            highlighted and listed in order of appearance.
          </p>
        </div>
        <Textarea
          className="min-h-[220px] font-mono text-xs"
          placeholder="2025-01-15T12:00:00Z started job…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="px-3 py-2 border-b border-gray-100 text-sm font-medium text-gray-700">
            Matches ({hits.length})
          </div>
          <ul className="max-h-64 overflow-auto divide-y divide-gray-100">
            {hits.map((h, i) => (
              <li key={`${h.raw}-${i}`} className="px-3 py-2 font-mono text-xs">
                <span className="text-gray-500 mr-2">[{h.kind}]</span>
                {h.raw}
              </li>
            ))}
            {hits.length === 0 && (
              <li className="px-3 py-6 text-gray-500 text-sm">
                No timestamps detected yet.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}
