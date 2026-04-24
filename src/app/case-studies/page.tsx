import type { Metadata } from 'next'
import CaseStudiesClient from './CaseStudiesClient'

export const metadata: Metadata = {
  title: 'Case Studies | Unix Calculator',
  description: 'Case Studies — Unix Calculator',
}

export default function Page() {
  return <CaseStudiesClient />
}
