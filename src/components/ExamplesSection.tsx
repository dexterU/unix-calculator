'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const EXAMPLES = [
  { label: 'Powers', expr: '2^10' },
  { label: 'Square root', expr: 'sqrt(144)' },
  { label: 'Scale', expr: 'scale=4; 1/3' },
  { label: 'Trig', expr: 'sin(1) + cos(1)' },
  { label: 'Log / exp', expr: 'l(100) / l(10)' },
]

type ExamplesSectionProps = {
  onUseExample: (expression: string) => void
}

export function ExamplesSection({ onUseExample }: ExamplesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-2">Examples</h2>
        <p className="text-muted-foreground">
          Tap an example to load it into the BC calculator tab above.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((ex) => (
          <Card key={ex.label} className="border-terminal-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">{ex.label}</CardTitle>
              <CardDescription className="font-mono text-xs break-all">{ex.expr}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" size="sm" className="w-full" onClick={() => onUseExample(ex.expr)}>
                Use example
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
