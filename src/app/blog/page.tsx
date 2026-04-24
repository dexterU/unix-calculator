import type { Metadata } from 'next'
import BlogNewClient from './BlogNewClient'

export const metadata: Metadata = {
  title: 'Blog | Unix Calculator',
  description: 'Blog — Unix Calculator',
}

export default function Page() {
  return <BlogNewClient />
}
