import type { Metadata } from 'next'
import HashCalculatorClient from './HashCalculatorClient'

export const metadata: Metadata = {
  title: 'Hash Calculator | Unix Calculator',
  description: 'Hash Calculator — Unix Calculator',
}

export default function Page() {
  return <HashCalculatorClient />
}
