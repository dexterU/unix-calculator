'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  Key,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { AdUnit } from '@/components/AdUnit'
import { getRelatedGuides } from '@/lib/related-guides'

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4)
  try {
    return decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
  } catch {
    return atob(padded)
  }
}

interface JwtParts {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  raw: { header: string; payload: string; signature: string }
}

function decodeJwt(token: string): JwtParts | null {
  try {
    const parts = token.trim().split('.')
    if (parts.length !== 3) return null
    return {
      header: JSON.parse(base64UrlDecode(parts[0])),
      payload: JSON.parse(base64UrlDecode(parts[1])),
      signature: parts[2],
      raw: { header: parts[0], payload: parts[1], signature: parts[2] },
    }
  } catch {
    return null
  }
}

const STANDARD_CLAIMS = ['iss', 'sub', 'aud', 'exp', 'iat', 'nbf', 'jti'] as const

const CLAIM_MEANINGS: Record<(typeof STANDARD_CLAIMS)[number], string> = {
  iss: 'Who issued the token',
  sub: 'Who the token is about',
  aud: 'Who the token is for',
  exp: 'When the token expires',
  iat: 'When the token was issued',
  nbf: 'Token not valid before this time',
  jti: 'Unique identifier for this token',
}

function isUnixTsSeconds(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function formatUtcFromSec(sec: number): string {
  return new Date(sec * 1000).toLocaleString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

function formatDuration(totalSec: number): string {
  const s = Math.abs(Math.floor(totalSec))
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  if (days > 0) return `${days} day${days === 1 ? '' : 's'}`
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'}`
  return `${s} second${s === 1 ? '' : 's'}`
}

function expiresRelative(expSec: number, nowSec: number): string {
  const delta = expSec - nowSec
  if (delta > 0) return `Expires in ${formatDuration(delta)}`
  return `Expired ${formatDuration(delta)} ago`
}

function truncatePart(s: string, max: number): string {
  if (s.length <= max) return s
  return s.slice(0, max) + '…'
}

const EXAMPLE_VALID = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMzNTI5NjAwLCJleHAiOjk5OTk5OTk5OTl9.invalid-sig`
const EXAMPLE_EXPIRED = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.invalid-sig`
const EXAMPLE_RICH = `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtleS0xIn0.eyJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJzdWIiOiJ1c2VyXzQ1NiIsImF1ZCI6WyJhcGkuZXhhbXBsZS5jb20iXSwiaWF0IjoxNzMzNTI5NjAwLCJleHAiOjk5OTk5OTk5OTksIm5iZiI6MTczMzUyOTYwMCwianRpIjoiYWJjLTEyMyIsIm5hbWUiOiJKYW5lIFNtaXRoIiwicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl19.invalid-sig`

export function JwtDecoderClient() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState<'header' | 'payload' | null>(null)

  const decoded = useMemo(() => decodeJwt(input), [input])
  const partsPreview = useMemo(() => {
    const p = input.trim().split('.')
    if (p.length !== 3) return null
    return {
      h: truncatePart(p[0], 40),
      pl: truncatePart(p[1], 40),
      s: truncatePart(p[2], 40),
    }
  }, [input])

  const nowSec = Math.floor(Date.now() / 1000)

  const headerJson = decoded
    ? JSON.stringify(decoded.header, null, 2)
    : '// Paste a JWT above'
  const payloadJson = decoded
    ? JSON.stringify(decoded.payload, null, 2)
    : '// Paste a JWT above'

  const alg =
    decoded && typeof decoded.header.alg === 'string'
      ? decoded.header.alg
      : null
  const typ =
    decoded && typeof decoded.header.typ === 'string'
      ? decoded.header.typ
      : null

  const expSec = decoded?.payload.exp
  const nbfSec = decoded?.payload.nbf

  const isExpired =
    isUnixTsSeconds(expSec) && expSec < nowSec
  const isNotYetValid =
    isUnixTsSeconds(nbfSec) && nbfSec > nowSec

  let status: 'valid' | 'expired' | 'nbf' = 'valid'
  if (isNotYetValid) status = 'nbf'
  else if (isExpired) status = 'expired'

  const copy = async (text: string, which: 'header' | 'payload') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* ignore */
    }
  }

  const customClaims = useMemo(() => {
    if (!decoded) return null
    const rest: Record<string, unknown> = { ...decoded.payload }
    for (const k of STANDARD_CLAIMS) delete rest[k]
    return Object.keys(rest).length ? rest : null
  }, [decoded])

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-terminal-border bg-terminal-surface px-4 py-1.5 font-mono text-xs text-terminal-green">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            100% client-side — your token never leaves your browser
          </div>
          <h1 className="mb-3 font-mono text-3xl font-bold text-foreground">
            JWT Decoder
          </h1>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            Paste any JSON Web Token to instantly decode the header, payload, and
            check expiry status. Nothing is sent to a server.
          </p>
        </div>

        <textarea
          placeholder="Paste your JWT here — eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="h-32 w-full resize-none rounded-xl border-2 border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-green transition-colors placeholder:text-muted-foreground/40 focus:border-terminal-green focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Paste your JWT token here"
        />

        {partsPreview && (
          <div className="mt-3 rounded-lg border border-terminal-border/60 bg-background/50 p-3 font-mono text-xs break-all">
            <p className="mb-1">
              <span className="text-terminal-cyan">{partsPreview.h}</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-terminal-green">{partsPreview.pl}</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-terminal-amber">{partsPreview.s}</span>
            </p>
            <p className="text-muted-foreground">header.payload.signature</p>
          </div>
        )}

        {decoded && (
          <div
            className={`mt-4 rounded-xl border border-terminal-border bg-terminal-surface p-4 ${
              status === 'valid'
                ? 'border-l-4 border-l-terminal-green'
                : status === 'expired'
                  ? 'border-l-4 border-l-red-500'
                  : 'border-l-4 border-l-amber-500'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              {status === 'valid' && (
                <>
                  <ShieldCheck className="h-5 w-5 shrink-0 text-terminal-green" aria-hidden="true" />
                  <span className="font-mono text-sm font-bold text-foreground">
                    Valid Token
                  </span>
                  {alg && (
                    <span className="rounded bg-terminal-green/20 px-2 py-0.5 font-mono text-xs text-terminal-green">
                      {alg}
                    </span>
                  )}
                  {typ && (
                    <span className="text-xs text-muted-foreground font-mono">
                      typ: {typ}
                    </span>
                  )}
                </>
              )}
              {status === 'expired' && (
                <>
                  <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
                  <span className="font-mono text-sm font-bold text-foreground">
                    Token Expired
                  </span>
                  {isUnixTsSeconds(expSec) && (
                    <span className="text-xs text-muted-foreground">
                      {expiresRelative(expSec, nowSec)}
                    </span>
                  )}
                </>
              )}
              {status === 'nbf' && (
                <>
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
                  <span className="font-mono text-sm font-bold text-foreground">
                    Token Not Yet Valid
                  </span>
                  {isUnixTsSeconds(nbfSec) && (
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      nbf: {formatUtcFromSec(nbfSec)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface">
            <div className="flex items-center justify-between border-b border-terminal-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-terminal-cyan" aria-hidden="true" />
                <span className="font-mono text-sm font-bold text-terminal-cyan">
                  Header
                </span>
              </div>
              <button
                type="button"
                onClick={() => decoded && copy(headerJson, 'header')}
                disabled={!decoded}
                className="disabled:opacity-40"
                aria-label="Copy header"
              >
                {copied === 'header' ? (
                  <CheckCircle className="h-4 w-4 text-terminal-green" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground transition-colors hover:text-terminal-green" aria-hidden="true" />
                )}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all p-4 font-mono text-sm text-foreground">
              {headerJson}
            </pre>
          </div>

          <div className="overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface">
            <div className="flex items-center justify-between border-b border-terminal-border px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-terminal-green" aria-hidden="true" />
                <span className="font-mono text-sm font-bold text-terminal-green">
                  Payload
                </span>
              </div>
              <button
                type="button"
                onClick={() => decoded && copy(payloadJson, 'payload')}
                disabled={!decoded}
                className="disabled:opacity-40"
                aria-label="Copy payload"
              >
                {copied === 'payload' ? (
                  <CheckCircle className="h-4 w-4 text-terminal-green" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground transition-colors hover:text-terminal-green" aria-hidden="true" />
                )}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all p-4 font-mono text-sm text-foreground">
              {payloadJson}
            </pre>
          </div>
        </div>

        {decoded && (
          <>
            <div className="mt-6 overflow-x-auto rounded-xl border border-terminal-border bg-terminal-surface">
              <table className="w-full text-left font-mono text-sm">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="px-4 py-2 text-muted-foreground">Claim</th>
                    <th className="px-4 py-2 text-muted-foreground">Key</th>
                    <th className="px-4 py-2 text-muted-foreground">Value</th>
                    <th className="px-4 py-2 text-muted-foreground">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {STANDARD_CLAIMS.map((key) => {
                    if (!(key in decoded.payload)) return null
                    const val = decoded.payload[key]
                    const meaning = CLAIM_MEANINGS[key]

                    if (
                      (key === 'exp' || key === 'iat' || key === 'nbf') &&
                      isUnixTsSeconds(val as number)
                    ) {
                      const sec = val as number
                      const human = formatUtcFromSec(sec)
                      return (
                        <tr
                          key={key}
                          className="border-b border-terminal-border/50"
                        >
                          <td className="px-4 py-2 text-terminal-cyan">{key}</td>
                          <td className="px-4 py-2 text-foreground">
                            {key === 'exp'
                              ? 'Expiration'
                              : key === 'iat'
                                ? 'Issued At'
                                : 'Not Before'}
                          </td>
                          <td className="px-4 py-2 text-foreground">
                            <div className="space-y-1">
                              <span className="text-terminal-amber">{sec}</span>
                              <span className="block text-xs text-muted-foreground">
                                {human}
                              </span>
                              {key === 'exp' && (
                                <span
                                  className={`inline-block rounded px-1.5 py-0.5 text-xs font-bold ${
                                    sec < nowSec
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-terminal-green/20 text-terminal-green'
                                  }`}
                                >
                                  {sec < nowSec
                                    ? 'EXPIRED'
                                    : `in ${formatDuration(sec - nowSec)}`}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {meaning}
                          </td>
                        </tr>
                      )
                    }

                    return (
                      <tr
                        key={key}
                        className="border-b border-terminal-border/50"
                      >
                        <td className="px-4 py-2 text-terminal-cyan">{key}</td>
                        <td className="px-4 py-2 text-foreground">
                          {key === 'iss'
                            ? 'Issuer'
                            : key === 'sub'
                              ? 'Subject'
                              : key === 'aud'
                                ? 'Audience'
                                : key === 'jti'
                                  ? 'JWT ID'
                                  : key}
                        </td>
                        <td className="px-4 py-2 text-foreground break-all">
                          {typeof val === 'object' && val !== null
                            ? JSON.stringify(val)
                            : String(val)}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {meaning}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {customClaims && (
              <div className="mt-6 rounded-xl border border-terminal-border bg-terminal-surface p-4">
                <h3 className="mb-3 font-mono text-sm font-bold text-foreground">
                  Custom Claims
                </h3>
                <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs text-muted-foreground">
                  {JSON.stringify(customClaims, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-terminal-border bg-terminal-surface p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Lock className="h-4 w-4 text-terminal-amber" />
                <span className="font-mono text-sm font-bold text-terminal-amber">
                  Signature
                </span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  Cannot be verified client-side (requires secret/public key)
                </span>
              </div>
              <p className="rounded bg-background p-3 font-mono text-xs text-terminal-amber break-all">
                {decoded.signature}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                <span className="font-bold text-terminal-amber">
                  Security note:
                </span>{' '}
                This tool decodes but does not verify JWTs. Anyone can decode a
                JWT — the signature verification requires your secret key and
                should only happen server-side. Never paste production tokens
                containing sensitive data into any online tool.
              </p>
            </div>

            {decoded && (
              <AdUnit
                slot="2151149097"
                format="rectangle"
                className="my-6"
              />
            )}
          </>
        )}

        {!input.trim() && (
          <div className="mt-8 space-y-3">
            <p className="font-mono text-xs text-muted-foreground">
              Try an example (click to load):
            </p>
            <div className="flex flex-col gap-2 font-mono text-xs">
              <button
                type="button"
                className="rounded-lg border border-terminal-border bg-terminal-surface p-3 text-left text-terminal-green transition-colors hover:border-terminal-green"
                onClick={() => setInput(EXAMPLE_VALID)}
                aria-label="Load valid JWT example token"
              >
                <span className="text-muted-foreground">// valid token</span>
                <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                  {EXAMPLE_VALID}
                </span>
              </button>
              <button
                type="button"
                className="rounded-lg border border-terminal-border bg-terminal-surface p-3 text-left text-terminal-green transition-colors hover:border-terminal-green"
                onClick={() => setInput(EXAMPLE_EXPIRED)}
                aria-label="Load expired JWT example token"
              >
                <span className="text-muted-foreground">// expired token</span>
                <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                  {EXAMPLE_EXPIRED}
                </span>
              </button>
              <button
                type="button"
                className="rounded-lg border border-terminal-border bg-terminal-surface p-3 text-left text-terminal-green transition-colors hover:border-terminal-green"
                onClick={() => setInput(EXAMPLE_RICH)}
                aria-label="Load JWT example with rich claims"
              >
                <span className="text-muted-foreground">// rich claims</span>
                <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                  {EXAMPLE_RICH}
                </span>
              </button>
            </div>
          </div>
        )}

        <section className="mt-16 max-w-3xl border-t border-terminal-border pt-12">
          <div className="mb-8 rounded-r-xl border-l-4 border-terminal-green bg-terminal-surface p-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-terminal-green">
              ⚡ Quick Answer
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              A JWT (JSON Web Token) has three base64url-encoded parts separated
              by dots: header (algorithm), payload (claims), and signature. To
              decode: split on &quot;.&quot;, base64url-decode each part, parse as
              JSON. The signature cannot be verified without the secret key.
            </p>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">
            What is a JWT?
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            JSON Web Tokens (JWT, pronounced &quot;jot&quot;) are an open standard
            (RFC 7519) for securely transmitting information between parties as a
            JSON object. They are commonly used for authentication — after login,
            a server issues a JWT that the client includes in subsequent
            requests.
          </p>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">
            JWT Structure
          </h2>
          <div className="mb-6 rounded-lg border border-terminal-border bg-background p-4">
            <p className="mb-2 font-mono text-xs text-muted-foreground">
              // A JWT looks like this:
            </p>
            <p className="font-mono text-xs break-all">
              <span className="text-terminal-cyan">eyJhbGciOiJIUzI1NiJ9</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-terminal-green">
                eyJzdWIiOiJ1c2VyIn0
              </span>
              <span className="text-muted-foreground">.</span>
              <span className="text-terminal-amber">SflKxwRJSMeKKF2QT4fw</span>
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              header · payload · signature
            </p>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">
            Common JWT Claims Reference
          </h2>
          <div className="mb-6 overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="py-2 text-left text-muted-foreground">Claim</th>
                  <th className="py-2 text-left text-muted-foreground">Name</th>
                  <th className="py-2 text-left text-muted-foreground">Type</th>
                  <th className="py-2 text-left text-muted-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['iss', 'Issuer', 'String', 'Who issued the token'],
                  ['sub', 'Subject', 'String', 'Who the token is about'],
                  ['aud', 'Audience', 'String/Array', 'Who the token is for'],
                  [
                    'exp',
                    'Expiration',
                    'Unix timestamp',
                    'When the token expires',
                  ],
                  ['iat', 'Issued At', 'Unix timestamp', 'When the token was issued'],
                  [
                    'nbf',
                    'Not Before',
                    'Unix timestamp',
                    'Token not valid before this time',
                  ],
                  ['jti', 'JWT ID', 'String', 'Unique identifier for this token'],
                ].map(([claim, name, type, desc]) => (
                  <tr key={claim} className="border-b border-terminal-border/50">
                    <td className="py-2 text-terminal-cyan">{claim}</td>
                    <td className="py-2 text-foreground">{name}</td>
                    <td className="py-2 text-terminal-amber">{type}</td>
                    <td className="py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">
            How to Decode a JWT in Code
          </h2>

          <div className="space-y-4">
            <div className="rounded-lg border border-terminal-border bg-background p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                // JavaScript
              </p>
              <pre className="overflow-x-auto whitespace-pre font-mono text-xs text-cyan-400">{`function decodeJwt(token) {
  const [header, payload] = token.split('.');
  const decode = str => JSON.parse(
    atob(str.replace(/-/g,'+').replace(/_/g,'/'))
  );
  return {
    header: decode(header),
    payload: decode(payload)
  };
}

// Check expiry
const { payload } = decodeJwt(token);
const isExpired = payload.exp < Date.now() / 1000;`}</pre>
            </div>

            <div className="rounded-lg border border-terminal-border bg-background p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                // Python
              </p>
              <pre className="overflow-x-auto whitespace-pre font-mono text-xs text-cyan-400">{`import base64, json, time

def decode_jwt(token):
    parts = token.split('.')
    def decode(part):
        padded = part + '=' * (4 - len(part) % 4)
        return json.loads(base64.urlsafe_b64decode(padded))
    return {
        'header': decode(parts[0]),
        'payload': decode(parts[1])
    }

decoded = decode_jwt(token)
is_expired = decoded['payload']['exp'] < time.time()`}</pre>
            </div>

            <div className="rounded-lg border border-terminal-border bg-background p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                // Go
              </p>
              <pre className="overflow-x-auto whitespace-pre font-mono text-xs text-cyan-400">{`import (
    "encoding/base64"
    "encoding/json"
    "strings"
    "time"
)

func decodeJWT(token string) (map[string]interface{}, error) {
    parts := strings.Split(token, ".")
    payload, err := base64.RawURLEncoding.DecodeString(parts[1])
    if err != nil {
        return nil, err
    }
    var claims map[string]interface{}
    json.Unmarshal(payload, &claims)
    return claims, nil
}

// Check expiry
exp := int64(claims["exp"].(float64))
isExpired := exp < time.Now().Unix()`}</pre>
            </div>
          </div>
        </section>

        <AdUnit slot="1750948984" format="horizontal" className="my-6" />

        <RelatedGuides guides={getRelatedGuides('jwt-decoder')} />
      </main>
    </div>
  )
}
