import type { Metadata } from 'next'
import FileSizeCalculatorClient from './FileSizeCalculatorClient'

export const metadata: Metadata = {
  title: 'File Size Calculator — Bytes, KB, MB, GB, TB Converter',
  description:
    'Convert file sizes instantly between bytes, kilobytes, megabytes, gigabytes and terabytes. Free calculator with binary (KiB, MiB) and decimal (KB, MB) conversions.',
  alternates: { canonical: 'https://unixcalculator.com/file-size-calculator' },
}

export default function Page() {
  return <FileSizeCalculatorClient />
}
