import type { Metadata } from 'next'
import SitemapPageClient from './SitemapPageClient'

export const metadata: Metadata = {
  title: 'Sitemap — Unix Calculator',
  description: 'Browse all pages, calculators, and tools on Unix Calculator.',
  alternates: { canonical: 'https://www.unixcalculator.com/sitemap' },
}

export default function Page() {
  return <SitemapPageClient />
}
