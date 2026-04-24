import type { Metadata } from 'next'
import BlogOldClient from './BlogOldClient'

export const metadata: Metadata = {
  title: 'Blog (archive) | Unix Calculator',
  description: 'Legacy blog listing — Unix Calculator',
}

export default function Page() {
  return <BlogOldClient />
}
