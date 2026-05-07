import type { Metadata } from 'next'
import FunctionReferenceClient from './FunctionReferenceClient'

export const metadata: Metadata = {
  title: 'Function Reference — BC & Calculator Math',
  description: 'Reference for math functions, scale, and bc-style expressions used across Unix Calculator.',
  alternates: { canonical: 'https://unixcalculator.com/function-reference' },
}

export default function Page() {
  return <FunctionReferenceClient />
}
