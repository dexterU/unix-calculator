import type { Metadata } from 'next'
import HashCalculatorClient from './HashCalculatorClient'

export const metadata: Metadata = {
  title: 'Hash Calculator — MD5, SHA-1, SHA-256, SHA-512 Generator',
  description:
    'Generate cryptographic hashes instantly. Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text string. Free online hash calculator.',
  alternates: { canonical: 'https://www.unixcalculator.com/hash-calculator' },
}

export default function Page() {
  return <HashCalculatorClient />
}
