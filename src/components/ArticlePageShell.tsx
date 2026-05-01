'use client'

import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { DEFAULT_GUIDES } from '@/lib/related-guides'

export function ArticlePageShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="container max-w-4xl px-4 py-12">{children}</main>
      <div className="container max-w-4xl px-4 pb-16">
        <RelatedGuides guides={DEFAULT_GUIDES} />
      </div>
    </div>
  )
}
