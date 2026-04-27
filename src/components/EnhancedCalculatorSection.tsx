'use client'

import { BookOpen, Loader2, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

type HistoryItem = {
  expression: string
  result: string
  timestamp: Date
}

type EnhancedCalculatorSectionProps = {
  expression: string
  setExpression: (value: string) => void
  result: string
  error: string | null
  isCalculating: boolean
  onCalculate: (expr?: string) => void | Promise<void>
  history: HistoryItem[]
  onClearHistory: () => void
  onNavigate: (section: string) => void
}

export function EnhancedCalculatorSection({
  expression,
  setExpression,
  result,
  error,
  isCalculating,
  onCalculate,
  history,
  onClearHistory,
  onNavigate,
}: EnhancedCalculatorSectionProps) {
  return (
    <Card className="border-terminal-border/80 bg-card/80">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-foreground">BC-style calculator</CardTitle>
          <CardDescription>
            Expressions are evaluated in-browser with BC-like syntax (see Reference below).
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-2"
          onClick={() => onNavigate('tutorials')}
        >
          <BookOpen className="h-4 w-4" />
          Tutorials
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. sqrt(16) + 2^3"
          className="min-h-[120px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              void onCalculate()
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => void onCalculate()} disabled={isCalculating}>
            {isCalculating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Calculate
          </Button>
          <Button type="button" variant="secondary" onClick={() => setExpression('')}>
            Clear input
          </Button>
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
            Result
          </div>
          <div className="font-mono text-lg text-foreground break-all">{result || '—'}</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-foreground">History</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              onClick={onClearHistory}
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
          <ScrollArea className="h-[200px] rounded-md border border-border p-2">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">No calculations yet.</p>
            ) : (
              <ul className="space-y-3 pr-3">
                {history.map((item, i) => (
                  <li key={`${item.timestamp.getTime()}-${i}`} className="text-sm">
                    <button
                      type="button"
                      className="w-full text-left rounded-md p-2 hover:bg-muted/50 transition-colors"
                      onClick={() => setExpression(item.expression)}
                    >
                      <div className="font-mono text-foreground break-all">{item.expression}</div>
                      <div className="font-mono text-primary break-all">= {item.result}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.timestamp.toLocaleString()}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
