import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { getAllPublishedPosts } from '@/lib/supabase/blog'
import type { BlogPost } from '@/lib/supabase/blog'
import { Clock, ArrowRight, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Unix Timestamp Blog — Developer Guides & Tutorials',
  description:
    'In-depth articles on Unix timestamps, timezone handling, JWT, database migrations, and production timestamp bugs. Written by senior engineers.',
  alternates: {
    canonical: 'https://unixcalculator.com/blog',
  },
}

export default async function BlogPage() {
  const posts = await getAllPublishedPosts()

  const categoryColors: Record<string, string> = {
    'Deep Dive': 'text-terminal-purple border-terminal-purple/30 bg-terminal-purple/10',
    Tutorial: 'text-terminal-green border-terminal-green/30 bg-terminal-green/10',
    Guide: 'text-terminal-cyan border-terminal-cyan/30 bg-terminal-cyan/10',
    Reference: 'text-terminal-amber border-terminal-amber/30 bg-terminal-amber/10',
    Analysis: 'text-terminal-blue border-terminal-blue/30 bg-terminal-blue/10',
  }

  const featured = posts.filter((p) => p.featured)
  const regular = posts.filter((p) => !p.featured)

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-mono text-3xl font-bold text-foreground">Unix Timestamp Blog</h1>
          <p className="mx-auto max-w-xl font-mono text-sm text-muted-foreground">
            In-depth guides on timestamps, timezone handling, JWT, database migrations, and production bugs. Written by
            senior engineers.
          </p>
        </div>

        {featured.length > 0 ? (
          <section aria-label="Featured articles" className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-terminal-amber" aria-hidden="true" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-terminal-amber">Featured</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {featured.map((post) => (
                <PostCard key={post.slug} post={post} categoryColors={categoryColors} featured />
              ))}
            </div>
          </section>
        ) : null}

        {regular.length > 0 ? (
          <section aria-label="All articles">
            <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">
              All Articles ({posts.length})
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {regular.map((post) => (
                <PostCard key={post.slug} post={post} categoryColors={categoryColors} />
              ))}
            </div>
          </section>
        ) : null}

        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-mono text-muted-foreground">// articles coming soon</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}

function PostCard({
  post,
  categoryColors,
  featured = false,
}: {
  post: BlogPost
  categoryColors: Record<string, string>
  featured?: boolean
}) {
  const color =
    categoryColors[post.category] ?? 'text-terminal-green border-terminal-green/30 bg-terminal-green/10'

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block rounded-xl border border-terminal-border bg-terminal-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-terminal-green ${
        featured ? 'ring-1 ring-terminal-amber/20' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded border px-2 py-0.5 font-mono text-xs ${color}`}>{post.category}</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span className="font-mono text-xs">{post.read_time_minutes} min</span>
        </div>
      </div>

      <h3 className="mb-2 font-mono text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-terminal-green">
        {post.title}
      </h3>

      {post.excerpt ? (
        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{post.excerpt}</p>
      ) : null}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-mono text-xs text-terminal-green">
          Read article
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </div>
        {publishedDate ? <span className="font-mono text-xs text-muted-foreground">{publishedDate}</span> : null}
      </div>
    </Link>
  )
}
