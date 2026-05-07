import type { Metadata } from 'next'
import BlogSlugFallbackClient from './BlogSlugFallbackClient'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  const canonical = `https://unixcalculator.com/blog/${params.slug}`
  return {
    title: `${title} | Unix Calculator`,
    description: `${title} — Unix Calculator blog`,
    alternates: { canonical },
  }
}

export default function Page() {
  return <BlogSlugFallbackClient />
}
