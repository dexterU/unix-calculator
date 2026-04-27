'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'

async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function HashCalculatorClient() {
  const [input, setInput] = useState('')
  const [hash, setHash] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function run() {
    setBusy(true)
    try {
      setHash(await sha256Hex(input))
    } catch {
      setHash('(Web Crypto not available)')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-2xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SHA-256 hash</h1>
          <p className="text-gray-600 text-sm">
            Browser <code className="text-xs">crypto.subtle</code> over UTF-8 bytes.
          </p>
        </div>
        <Textarea
          className="min-h-[120px] font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="button" onClick={run} disabled={busy}>
          {busy ? 'Hashing…' : 'Compute SHA-256'}
        </Button>
        {hash && (
          <div className="calc-result font-mono text-xs break-all">{hash}</div>
        )}
        <RelatedGuides guides={getRelatedGuides('hash-calculator')} />
      </main>
    </div>
  )
}
