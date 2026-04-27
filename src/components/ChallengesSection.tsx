'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target } from 'lucide-react'

type ChallengesSectionProps = {
  onNavigate: (section: string) => void
}

export function ChallengesSection({ onNavigate }: ChallengesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Challenges
        </h2>
        <p className="text-muted-foreground">
          Practice problems and puzzles—jump to the dedicated challenges page or keep exploring below.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
        <Card className="border-terminal-border/80 bg-card/80">
          <CardHeader>
            <CardTitle className="text-foreground">Challenge hub</CardTitle>
            <CardDescription>Browse all published challenges on the site.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/challenges" className="gap-2">
                Go to challenges
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-terminal-border/80 bg-card/80">
          <CardHeader>
            <CardTitle className="text-foreground">Stay on this page</CardTitle>
            <CardDescription>Return to the calculator or tutorials without leaving home.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => onNavigate('calculator')}>
              Calculator
            </Button>
            <Button type="button" variant="secondary" onClick={() => onNavigate('tutorials')}>
              Tutorials
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
