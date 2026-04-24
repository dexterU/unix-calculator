'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('\\d+')
  const [flags, setFlags] = useState('g')
  const [haystack, setHaystack] = useState('Room 101 and 202')

  const { regex, error, matches } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags)
      const m = haystack.match(re)
      const all = haystack.match(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))
      return { regex: re, error: null as string | null, matches: all }
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Invalid pattern',
        matches: null,
      }
    }
  }, [pattern, flags, haystack])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-3xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Regex tester</h1>
          <p className="text-gray-600 text-sm">JavaScript RegExp syntax.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="pat">Pattern</Label>
            <Input
              id="pat"
              className="font-mono text-sm"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fl">Flags</Label>
            <Input
              id="fl"
              className="font-mono text-sm"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="text">Text</Label>
          <Textarea
            id="text"
            className="min-h-[120px] font-mono text-sm"
            value={haystack}
            onChange={(e) => setHaystack(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && matches && (
          <div className="calc-result">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">
              Matches ({matches.length})
            </p>
            <ul className="font-mono text-sm space-y-1">
              {matches.map((m, i) => (
                <li key={`${m}-${i}`}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
