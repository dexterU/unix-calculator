'use client'

import type { ReactNode } from 'react'

const SECTION_STYLES: Record<
  'cyan' | 'green' | 'amber' | 'purple' | 'red',
  { title: string; border: string }
> = {
  cyan: { title: 'text-terminal-cyan', border: 'border-terminal-cyan/30' },
  green: { title: 'text-terminal-green', border: 'border-terminal-green/30' },
  amber: { title: 'text-terminal-amber', border: 'border-terminal-amber/30' },
  purple: { title: 'text-terminal-purple', border: 'border-terminal-purple/30' },
  red: { title: 'text-red-400', border: 'border-red-400/30' },
}

export function Section({
  title,
  color,
  children,
}: {
  title: string
  color: keyof typeof SECTION_STYLES
  children: ReactNode
}) {
  const s = SECTION_STYLES[color]
  return (
    <div
      className={`section-card rounded-xl border bg-terminal-surface p-4 ${s.border}`}
    >
      <h3 className={`mb-3 font-mono text-sm font-bold ${s.title}`}>{title}</h3>
      {children}
    </div>
  )
}

export function CodeBlock({ children }: { children: string; lang?: string }) {
  return (
    <pre className="overflow-x-auto whitespace-pre rounded-lg bg-background p-3 font-mono text-xs leading-relaxed text-cyan-400 print:bg-gray-50 print:text-gray-800">
      {children}
    </pre>
  )
}

export function TableBlock({ rows }: { rows: [string, string, string][] }) {
  return (
    <table className="mb-3 w-full font-mono text-xs">
      <thead>
        <tr className="border-b border-terminal-border">
          <th className="py-1 text-left font-normal text-muted-foreground">Digits</th>
          <th className="py-1 text-left font-normal text-muted-foreground">Unit</th>
          <th className="py-1 text-left font-normal text-muted-foreground">Example</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([digits, unit, example]) => (
          <tr key={digits} className="border-b border-terminal-border/40">
            <td className="py-1 text-terminal-green">{digits}</td>
            <td className="py-1 text-foreground">{unit}</td>
            <td className="py-1 font-mono text-xs text-muted-foreground">{example}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function CheatsheetPrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        body {
          background: white !important;
          color: black !important;
        }
        .print\\:hidden {
          display: none !important;
        }
        pre {
          background: #f4f4f4 !important;
          border: 1px solid #ddd !important;
          color: #333 !important;
          font-size: 10px !important;
          padding: 8px !important;
          border-radius: 4px !important;
          white-space: pre-wrap !important;
        }
        h3 {
          color: #333 !important;
        }
        .section-card {
          border: 1px solid #ddd !important;
          background: #fafafa !important;
          break-inside: avoid !important;
        }
      }
    `}</style>
  )
}
