import type { Metadata } from 'next'
import FunctionReferenceClient from './FunctionReferenceClient'

export const metadata: Metadata = {
  title: 'Function Reference | Unix Calculator',
  description: 'Function Reference — Unix Calculator',
}

export default function Page() {
  return <FunctionReferenceClient />
}
