'use client'

import { useCallback, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const copyBtnClass =
  'absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-terminal-surface border border-terminal-border rounded px-2 py-1 text-xs text-muted-foreground hover:text-terminal-green font-mono'

export function TerminalReferenceSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-16 w-full border-t border-terminal-border pt-12">{children}</section>
  )
}

export function TerminalRefH2() {
  return (
    <h2 className="mb-2 font-mono text-xl font-bold text-terminal-green">Terminal Equivalent</h2>
  )
}

export function TerminalRefIntro({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 text-sm text-muted-foreground">{children}</p>
}

export function TerminalRefCodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }, [code])

  return (
    <div className="relative mb-4 rounded-lg border border-terminal-border bg-background p-4 group">
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <pre className="overflow-x-auto whitespace-pre pr-24 font-mono text-sm leading-relaxed text-cyan-400">
        {code}
      </pre>
      <button type="button" onClick={copy} className={copyBtnClass}>
        {copied ? '✓' : 'Copy Command'}
      </button>
    </div>
  )
}

export function TerminalRefSubH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 mt-8 font-mono text-base font-semibold text-foreground">{children}</h3>
  )
}

export function TerminalRefHowItWorks({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
}

export type TerminalLangTab = { id: string; label: string; codeLabel: string; code: string }

export function TerminalRefLangTabs({ tabs }: { tabs: TerminalLangTab[] }) {
  const defaultVal = tabs[0]?.id ?? 'tab-0'
  return (
    <Tabs defaultValue={defaultVal} className="w-full">
      <TabsList className="flex h-auto min-h-10 flex-wrap gap-1 bg-muted/30 p-1">
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id} className="font-mono text-xs">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.id} value={t.id} className="mt-4">
          <TerminalRefCodeBlock label={t.codeLabel} code={t.code} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
