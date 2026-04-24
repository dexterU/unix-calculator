import type { Metadata } from 'next'
import BinaryConverterClient from './BinaryConverterClient'

export const metadata: Metadata = {
  title: 'Binary Converter | Unix Calculator',
  description: 'Binary Converter — Unix Calculator',
}

export default function Page() {
  return <BinaryConverterClient />
}
