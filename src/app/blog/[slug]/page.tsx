import type { Metadata } from 'next'
import BlogSlugFallbackClient from './BlogSlugFallbackClient'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return {
    title: `${title} | Unix Calculator`,
    description: `${title} — Unix Calculator blog`,
  }
}

export default function Page() {
  return <BlogSlugFallbackClient />
}
