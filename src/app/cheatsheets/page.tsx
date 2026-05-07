import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, FileText } from 'lucide-react'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'Unix Timestamp Cheatsheets — Free PDF Downloads',
  description:
    'Free downloadable Unix timestamp cheatsheets for JavaScript, Python, Go, C/C++, PHP, and PostgreSQL. Print or save as PDF.',
  alternates: { canonical: 'https://unixcalculator.com/cheatsheets' },
}

const SHEETS = [
  {
    lang: 'JavaScript',
    href: '/cheatsheets/javascript',
    desc: 'Date.now(), new Date(), Intl, common mistakes',
    available: true,
    color: 'text-terminal-amber',
  },
  {
    lang: 'Python',
    href: '/cheatsheets/python',
    desc: 'time module, datetime, timezone, strftime',
    available: true,
    color: 'text-terminal-green',
  },
  {
    lang: 'Go',
    href: '/cheatsheets/go',
    desc: 'time.Now(), Unix(), Format(), LoadLocation()',
    available: false,
    color: 'text-terminal-cyan',
  },
  {
    lang: 'C / C++',
    href: '/cheatsheets/c-cpp',
    desc: 'time(), clock_gettime(), strftime(), struct tm',
    available: false,
    color: 'text-terminal-purple',
  },
  {
    lang: 'PostgreSQL',
    href: '/cheatsheets/postgresql',
    desc: 'TIMESTAMPTZ, to_timestamp(), AT TIME ZONE',
    available: false,
    color: 'text-terminal-blue',
  },
  {
    lang: 'PHP',
    href: '/cheatsheets/php',
    desc: 'time(), date(), strtotime(), DateTime',
    available: false,
    color: 'text-red-400',
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 font-mono text-3xl font-bold text-foreground">Unix Timestamp Cheatsheets</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Free printable reference cards for every language. Open any cheatsheet and click Download PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SHEETS.map((sheet) => (
            <div
              key={sheet.lang}
              className={`rounded-xl border border-terminal-border bg-terminal-surface p-5 ${
                sheet.available ? 'transition-colors hover:border-terminal-green' : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <FileText className={`h-4 w-4 shrink-0 ${sheet.color}`} />
                    <h2 className={`font-mono font-bold ${sheet.color}`}>{sheet.lang}</h2>
                    {!sheet.available ? (
                      <span className="rounded border border-terminal-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                        Coming soon
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-sm text-muted-foreground">{sheet.desc}</p>
                </div>
                {sheet.available ? (
                  <Link
                    href={sheet.href}
                    className="ml-2 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-terminal-green px-3 py-1.5 font-mono text-xs font-bold text-terminal-bg transition-opacity hover:opacity-90"
                  >
                    <Download className="h-3 w-3" />
                    Open
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <p className="mb-2 font-mono text-sm font-bold text-foreground">How to save as PDF</p>
          <ol className="list-inside list-decimal space-y-1 font-mono text-xs text-muted-foreground">
            <li>Open any cheatsheet above</li>
            <li>Click &quot;Download PDF&quot; or press Ctrl+P (Cmd+P on Mac)</li>
            <li>Set destination to &quot;Save as PDF&quot;</li>
            <li>Click Save</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
