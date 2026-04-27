'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Textarea } from '@/components/ui/textarea'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'
import {
  TerminalReferenceSection,
  TerminalRefCodeBlock,
  TerminalRefH2,
  TerminalRefHowItWorks,
  TerminalRefIntro,
  TerminalRefSubH3,
} from '@/components/tools/TerminalReference'

const BATCH_SHELL = `# Convert a list of timestamps from a file
while IFS= read -r ts; do
  echo "$ts -> $(date -d @$ts '+%Y-%m-%d %H:%M:%S UTC')"
done < timestamps.txt

# Process CSV: convert timestamp column
awk -F',' 'NR>1 {
  cmd = "date -d @" $2 " +\\"%Y-%m-%d\\""
  cmd | getline date
  close(cmd)
  print $1 "," date "," $3
}' data.csv

# Batch convert and output to new file
cat timestamps.txt | xargs -I{} date -d @{} > dates.txt`

function parseLine(line: string): { ok: boolean; label: string } {
  const t = line.trim()
  if (!t) return { ok: false, label: '(empty)' }
  const n = Number(t)
  if (!Number.isFinite(n)) return { ok: false, label: 'not a number' }
  const sec = n > 1e12 ? Math.floor(n / 1000) : Math.floor(n)
  const d = new Date(sec * 1000)
  return { ok: true, label: d.toISOString() }
}

export default function BatchProcessorClient() {
  const [text, setText] = useState('')
  const rows = useMemo(
    () =>
      text.split(/\r?\n/).map((line, i) => ({
        i: i + 1,
        line,
        ...parseLine(line),
      })),
    [text]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Batch timestamp processor
          </h1>
          <p className="text-gray-600 max-w-2xl">
            One Unix timestamp per line (seconds or milliseconds). Results show as
            UTC ISO strings.
          </p>
        </div>
        <Textarea
          className="min-h-[200px] font-mono text-sm"
          placeholder={'1700000000\n1700000000000'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left text-gray-700">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Input</th>
                <th className="px-3 py-2 font-medium">UTC</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.i} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-gray-500">{r.i}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.line || '—'}</td>
                  <td
                    className={`px-3 py-2 font-mono text-xs ${
                      r.ok ? 'text-gray-900' : 'text-red-600'
                    }`}
                  >
                    {r.ok ? r.label : r.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <RelatedGuides guides={getRelatedGuides('batch-processor')} />
        <TerminalReferenceSection>
          <TerminalRefH2 />
          <TerminalRefIntro>
            Pipe files of epoch values through while-read loops, awk, and xargs for bulk conversion.
          </TerminalRefIntro>
          <TerminalRefCodeBlock label="bash" code={BATCH_SHELL} />
          <TerminalRefSubH3>How It Works</TerminalRefSubH3>
          <TerminalRefHowItWorks>
            <p>
              Batch processing timestamps is common in data migrations, analytics pipelines, and log
              analysis. The key is identifying the input format (seconds vs milliseconds), handling
              invalid values gracefully, and choosing an output format that downstream systems can
              consume. For large datasets (millions of rows), process in streaming fashion rather than
              loading all into memory.
            </p>
          </TerminalRefHowItWorks>
        </TerminalReferenceSection>
      </main>
    </div>
  )
}
