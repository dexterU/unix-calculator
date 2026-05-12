import type { Metadata } from 'next'
import BinaryConverterClient from './BinaryConverterClient'

export const metadata: Metadata = {
  title: 'Binary Converter — Decimal, Binary, Hex, Octal Converter',
  description:
    'Convert numbers between decimal, binary, hexadecimal, and octal instantly. Free binary converter for developers and students.',
  alternates: { canonical: 'https://www.unixcalculator.com/binary-converter' },
}

export default function Page() {
  return <BinaryConverterClient />
}
