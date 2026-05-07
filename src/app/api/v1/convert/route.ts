import { NextRequest, NextResponse } from 'next/server'

const requestCounts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 100
const RATE_WINDOW = 60 * 60 * 1000

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function getRateLimitInfo(ip: string): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetAt) {
    const resetAt = now + RATE_WINDOW
    requestCounts.set(ip, { count: 1, resetAt })
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt }
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count++
  return {
    allowed: true,
    remaining: RATE_LIMIT - record.count,
    resetAt: record.resetAt,
  }
}

function detectFormat(ts: number): 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds' {
  const digits = Math.trunc(Math.abs(ts)).toString().length
  if (digits <= 10) return 'seconds'
  if (digits <= 13) return 'milliseconds'
  if (digits <= 16) return 'microseconds'
  return 'nanoseconds'
}

function toUnixSeconds(ts: number): number {
  const fmt = detectFormat(ts)
  if (fmt === 'seconds') return ts
  if (fmt === 'milliseconds') return ts / 1000
  if (fmt === 'microseconds') return ts / 1_000_000
  return ts / 1_000_000_000
}

function rateHeaders(remaining: number, resetAt: number): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-RateLimit-Limit': RATE_LIMIT.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.floor(resetAt / 1000).toString(),
    'Content-Type': 'application/json',
  }
}

export async function GET(req: NextRequest) {
  const ip = clientIp(req)
  const { allowed, remaining, resetAt } = getRateLimitInfo(ip)
  const headers = rateHeaders(remaining, resetAt)

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Max ${RATE_LIMIT} requests per hour. Resets at ${new Date(resetAt).toISOString()}`,
        docs: 'https://unixcalculator.com/tools/timestamp-api',
      },
      { status: 429, headers },
    )
  }

  const { searchParams } = new URL(req.url)
  const tsParam = searchParams.get('ts') ?? searchParams.get('timestamp')
  const timezone =
    searchParams.get('tz') ?? searchParams.get('timezone') ?? 'UTC'
  const format = searchParams.get('format')

  const rawTs = tsParam != null && tsParam !== '' ? parseFloat(tsParam) : Date.now() / 1000

  if (Number.isNaN(rawTs)) {
    return NextResponse.json(
      {
        error: 'Invalid timestamp',
        message: 'Parameter "ts" must be a valid number',
        example: '/api/v1/convert?ts=1733529600',
        docs: 'https://unixcalculator.com/tools/timestamp-api',
      },
      { status: 400, headers },
    )
  }

  const seconds = toUnixSeconds(rawTs)
  const date = new Date(seconds * 1000)

  let validTz = 'UTC'
  try {
    Intl.DateTimeFormat('en', { timeZone: timezone })
    validTz = timezone
  } catch {
    validTz = 'UTC'
  }

  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { timeZone: validTz, ...opts }).format(date)

  const utcFmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts }).format(date)

  const detectedFormat = detectFormat(rawTs)

  const warnings: string[] = []
  const y = date.getUTCFullYear()
  if (y < 1972 || y > 2100) {
    warnings.push('Timestamp resolves to an unusual date — verify your input')
  }
  if (detectedFormat === 'seconds' && rawTs < 1000) {
    warnings.push(
      'Timestamp resolves near Unix epoch (1970) — you may have passed seconds to a milliseconds function',
    )
  }
  if (seconds > 2147483647) {
    warnings.push('Timestamp exceeds Y2038 limit — check 32-bit integer fields')
  }
  if (rawTs < 0) {
    warnings.push('Negative timestamp — represents a date before January 1, 1970 UTC')
  }

  if (format === 'iso') {
    return NextResponse.json({ iso: date.toISOString() }, { headers })
  }

  if (format === 'unix') {
    return NextResponse.json(
      {
        unix: Math.floor(seconds),
        unix_ms: Math.floor(seconds * 1000),
      },
      { headers },
    )
  }

  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0)
  const dayOfYear = Math.ceil((date.getTime() - startOfYear) / 86400000)

  const weekNumber = (() => {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  })()

  const base = {
    input: {
      raw: rawTs,
      detected_format: detectedFormat,
      timezone: validTz,
    },
    unix: {
      seconds: Math.floor(seconds),
      milliseconds: Math.floor(seconds * 1000),
      microseconds: Math.floor(seconds * 1_000_000),
    },
    utc: {
      iso_8601: date.toISOString(),
      rfc_2822: date.toUTCString(),
      human: utcFmt({
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      }),
      date: date.toISOString().split('T')[0],
      time: date.toISOString().split('T')[1].replace('Z', ''),
    },
    relative: (() => {
      const diffMs = Date.now() - date.getTime()
      const diffSec = Math.floor(Math.abs(diffMs) / 1000)
      const isPast = diffMs > 0
      const diffMin = Math.floor(diffSec / 60)
      const diffHr = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHr / 24)

      let human = ''
      if (diffDay > 365) human = `${Math.floor(diffDay / 365)} years`
      else if (diffDay > 30) human = `${Math.floor(diffDay / 30)} months`
      else if (diffDay > 0) human = `${diffDay} days`
      else if (diffHr > 0) human = `${diffHr} hours`
      else if (diffMin > 0) human = `${diffMin} minutes`
      else human = `${diffSec} seconds`

      return {
        human: isPast ? `${human} ago` : `in ${human}`,
        is_past: isPast,
        diff_seconds: diffSec,
      }
    })(),
    meta: {
      day_of_week: fmt({ weekday: 'long' }),
      day_of_year: dayOfYear,
      week_number: weekNumber,
      is_leap_year: (() => {
        const yy = date.getUTCFullYear()
        return (yy % 4 === 0 && yy % 100 !== 0) || yy % 400 === 0
      })(),
      unix_y2038_safe: seconds <= 2147483647,
    },
    powered_by: 'unixcalculator.com',
    docs: 'https://unixcalculator.com/tools/timestamp-api',
  }

  const response = {
    ...base,
    ...(validTz !== 'UTC'
      ? {
          local: {
            timezone: validTz,
            formatted: fmt({
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short',
            }),
            date: fmt({ year: 'numeric', month: '2-digit', day: '2-digit' }),
            time: fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
        }
      : {}),
    ...(warnings.length > 0 ? { warnings } : {}),
  }

  return NextResponse.json(response, { headers })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
