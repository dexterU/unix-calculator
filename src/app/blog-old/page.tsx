import type { Metadata } from 'next'
import BlogOldClient from './BlogOldClient'

export const metadata: Metadata = {
  title: 'Blog Archive — Unix Calculator',
  description: 'Legacy blog listing and archived posts on Unix Calculator.',
  alternates: { canonical: 'https://www.unixcalculator.com/blog-old' },
}

export default function Page() {
  return <BlogOldClient />
}
