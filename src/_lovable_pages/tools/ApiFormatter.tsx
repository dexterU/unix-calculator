'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function ApiFormatter() {
  const [raw, setRaw] = useState('{\n  "hello": "world"\n}')

  const { pretty, error } = useMemo(() => {
    try {
      const v = JSON.parse(raw)
      return {
        pretty: JSON.stringify(v, null, 2),
        error: null as string | null,
      }
    } catch (e) {
      return {
        pretty: null as string | null,
        error: e instanceof Error ? e.message : 'Invalid JSON',
      }
    }
  }, [raw])

  function minify() {
    try {
      const v = JSON.parse(raw)
      setRaw(JSON.stringify(v))
    } catch {
      /* error surfaced via pretty/error */
    }
  }

  function prettify() {
    if (pretty !== null) setRaw(pretty)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-4xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API formatter</h1>
          <p className="text-gray-600">
            Parse and pretty-print JSON payloads. Invalid documents show an error
            below.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={prettify}>
            Prettify
          </Button>
          <Button type="button" variant="outline" onClick={minify}>
            Minify
          </Button>
        </div>
        <Textarea
          className="min-h-[320px] font-mono text-sm"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </main>
    </div>
  )
}
