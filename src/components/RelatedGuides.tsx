'use client'

import Link from 'next/link'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'

interface Guide {
  title: string
  href: string
  category: string
  readTime: string
  description: string
}

interface RelatedGuidesProps {
  guides: Guide[]
  title?: string
}

export function RelatedGuides({
  guides,
  title = 'Related Guides & Tutorials',
}: RelatedGuidesProps) {
  if (!guides || guides.length === 0) return null

  return (
    <section className="mt-12 border-t border-terminal-border pt-10">
      <div className="mb-6 flex items-center gap-3">
        <BookOpen className="h-5 w-5 text-terminal-green" />
        <h2 className="font-mono text-lg font-bold text-foreground">{title}</h2>
        <span className="font-mono text-xs text-muted-foreground">
          // developers also read
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group block rounded-xl border border-terminal-border bg-terminal-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-terminal-green/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-terminal-green">
                {guide.category}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="font-mono text-xs">{guide.readTime}</span>
              </div>
            </div>
            <h3 className="mb-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-terminal-green">
              {guide.title}
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
              {guide.description}
            </p>
            <div className="flex items-center gap-1 font-mono text-xs text-terminal-green opacity-0 transition-opacity group-hover:opacity-100">
              Read guide
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
