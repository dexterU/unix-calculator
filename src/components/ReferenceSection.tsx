'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

const OPS = [
  { sym: '+ − × ÷', desc: 'Arithmetic' },
  { sym: '^', desc: 'Power (also ** in this evaluator)' },
  { sym: 'sqrt(x)', desc: 'Square root' },
  { sym: 'sin, cos, tan', desc: 'Trig (radians)' },
  { sym: 'scale=n', desc: 'Decimal places (BC-style prefix)' },
  { sym: 'obase=n', desc: 'Output base (integer result)' },
]

export function ReferenceSection() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reference</h2>
        <p className="text-muted-foreground">
          Quick BC-style cheatsheet. Full guides live on the reference pages.
        </p>
      </div>
      <Card className="border-terminal-border/80 bg-card/80 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-foreground">Common syntax</CardTitle>
          <CardDescription>How expressions are interpreted in the calculator above.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {OPS.map((row) => (
              <li key={row.sym} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 first:pt-0">
                <span className="font-mono text-sm text-primary">{row.sym}</span>
                <span className="text-sm text-muted-foreground">{row.desc}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 w-full sm:w-auto gap-2">
            <Link href="/reference">
              Open full reference
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
