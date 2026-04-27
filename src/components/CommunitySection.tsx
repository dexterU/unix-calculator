'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Info, Mail } from 'lucide-react'

export function CommunitySection() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-2">Community</h2>
        <p className="text-muted-foreground">
          Learn, read, and reach out—more ways to use Unix Calculator beyond the tools above.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        <Card className="border-terminal-border/80 bg-card/80">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Blog
            </CardTitle>
            <CardDescription>Articles on timestamps, tooling, and workflows.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/blog">Visit blog</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-terminal-border/80 bg-card/80">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-primary" />
              About
            </CardTitle>
            <CardDescription>What this project is and how it is maintained.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/about">About us</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-terminal-border/80 bg-card/80 sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-primary" />
              Contact
            </CardTitle>
            <CardDescription>Questions, feedback, or partnership ideas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/contact">Contact</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
