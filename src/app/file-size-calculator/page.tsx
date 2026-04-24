import type { Metadata } from 'next'
import FileSizeCalculatorClient from './FileSizeCalculatorClient'

export const metadata: Metadata = {
  title: 'File Size Calculator | Unix Calculator',
  description: 'File Size Calculator — Unix Calculator',
}

export default function Page() {
  return <FileSizeCalculatorClient />
}
