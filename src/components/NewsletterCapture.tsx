'use client'

import { useState, type FormEvent } from 'react'
import { Mail, Download, CheckCircle, Loader2 } from 'lucide-react'

interface NewsletterCaptureProps {
  source: string
}

export function NewsletterCapture({ source }: NewsletterCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong')
        return
      }

      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Network error — please try again')
    }
  }

  if (status === 'success') {
    return (
      <div className="my-10 rounded-xl border border-terminal-green/30 bg-terminal-surface p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-8 w-8 text-terminal-green" aria-hidden="true" />
        <p className="mb-1 font-mono text-lg font-bold text-terminal-green">Check your inbox</p>
        <p className="font-mono text-sm text-muted-foreground">Your Unix Timestamp Cheatsheet is on its way.</p>
      </div>
    )
  }

  return (
    <div className="my-10 rounded-xl border border-terminal-border bg-terminal-surface p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-lg border border-terminal-green/20 bg-terminal-green/10 p-3">
          <Download className="h-5 w-5 text-terminal-green" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1 font-mono font-bold text-foreground">Get the Unix Timestamp Cheatsheet</p>
          <p className="mb-4 font-mono text-sm text-muted-foreground">
            One email. Instant cheatsheet. No drip sequence.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
            <div className="min-w-[200px] flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                aria-label="Email address"
                className="w-full rounded-lg border border-terminal-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-terminal-green focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-terminal-green px-5 py-2.5 font-mono text-sm font-bold text-terminal-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" aria-hidden="true" /> Send me the cheatsheet
                </>
              )}
            </button>
          </form>

          {status === 'error' ? <p className="mt-2 font-mono text-xs text-red-400">{errorMsg}</p> : null}
        </div>
      </div>
    </div>
  )
}
