import type { Metadata } from 'next'
import BlogNewClient from './BlogNewClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Blog — Developer Guides & Tutorials',
  description:
    'In-depth articles on Unix timestamps, timezone handling, database migrations, and production timestamp bugs. Written by senior engineers.',
  alternates: { canonical: 'https://unixcalculator.com/blog' },
}

export default function Page() {
  return <BlogNewClient />
}
