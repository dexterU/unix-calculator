import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { NewsletterCapture } from '@/components/NewsletterCapture'
import { AdUnit } from '@/components/AdUnit'
import { DEFAULT_GUIDES } from '@/lib/related-guides'
import { getPostBySlug, getAllPublishedSlugs } from '@/lib/supabase/blog'
import { Clock, User, Calendar, Tag, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATIC_BLOG_SLUGS = [
  'complete-guide-unix-timestamp-precision-2025',
  'session-management-timestamp-expiration',
  'caching-strategies-time-sensitive-data',
  'graphql-subscriptions-realtime-timestamps',
] as const

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Article Not Found' }

  return {
    title: `${post.title} | Unix Calculator Blog`,
    description: post.excerpt ?? post.title,
    alternates: {
      canonical: `https://www.unixcalculator.com/blog/${post.slug}`,
    },
    ...(post.keywords?.length ? { keywords: post.keywords.join(', ') } : {}),
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs
    .filter((slug) => !STATIC_BLOG_SLUGS.includes(slug as (typeof STATIC_BLOG_SLUGS)[number]))
    .map((slug) => ({ slug }))
}

export default async function BlogArticlePage({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post) notFound()

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const categoryColors: Record<string, string> = {
    'Deep Dive': 'text-terminal-purple border-terminal-purple/30 bg-terminal-purple/10',
    Tutorial: 'text-terminal-green border-terminal-green/30 bg-terminal-green/10',
    Guide: 'text-terminal-cyan border-terminal-cyan/30 bg-terminal-cyan/10',
    Reference: 'text-terminal-amber border-terminal-amber/30 bg-terminal-amber/10',
    Analysis: 'text-terminal-blue border-terminal-blue/30 bg-terminal-blue/10',
  }
  const color =
    categoryColors[post.category] ?? 'text-terminal-green border-terminal-green/30 bg-terminal-green/10'

  const cleanContent =
    post.content === 'existing-static-page'
      ? '<p>This article has been migrated.</p>'
      : post.content
          .replace(/^```html\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim()

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/blog"
            className="flex w-fit items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-terminal-green"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Blog
          </Link>
        </nav>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`rounded border px-2 py-0.5 font-mono text-xs ${color}`}>{post.category}</span>
            {post.featured ? (
              <span className="font-mono text-xs text-terminal-amber">★ Featured</span>
            ) : null}
          </div>

          <h1 className="mb-4 font-mono text-2xl font-bold leading-tight text-foreground md:text-3xl">{post.title}</h1>

          {post.excerpt ? <p className="mb-6 leading-relaxed text-muted-foreground">{post.excerpt}</p> : null}

          <div className="flex flex-wrap items-center gap-4 border-b border-terminal-border pb-6 font-mono text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {post.author}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {post.read_time_minutes} min read
            </div>
            {publishedDate ? (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {publishedDate}
              </div>
            ) : null}
            {post.keywords && post.keywords.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                {post.keywords.slice(0, 3).join(', ')}
              </div>
            ) : null}
          </div>
        </header>

        <article className="max-w-none">
          <div
            className="article-content font-mono text-sm leading-relaxed text-foreground"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </article>

        <div className="mt-12 rounded-xl border border-terminal-border bg-terminal-surface p-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-terminal-green/20 bg-terminal-green/10 text-xl"
              aria-hidden="true"
            >
              👨‍💻
            </div>
            <div>
              <p className="mb-1 font-mono text-sm font-bold text-foreground">{post.author}</p>
              <p className="mb-2 font-mono text-xs text-muted-foreground">
                Senior Unix/Linux Engineers &amp; Developer Tooling Specialists
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                All articles are verified against current POSIX standards, tested with real production scenarios, and
                updated when language versions change. Last verified: {publishedDate ?? 'May 2026'}.
              </p>
            </div>
          </div>
        </div>

        <AdUnit slot="3915656904" format="horizontal" className="my-8" />

        <NewsletterCapture source={`blog-${post.slug}`} />

        <RelatedGuides guides={DEFAULT_GUIDES} />
      </main>
    </div>
  )
}
