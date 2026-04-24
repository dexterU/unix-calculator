import type { Metadata } from 'next'
import SitemapPageClient from './SitemapPageClient'

export const metadata: Metadata = {
  title: 'Sitemap | Unix Calculator',
  description: 'Sitemap — Unix Calculator',
}

export default function Page() {
  return <SitemapPageClient />
}
