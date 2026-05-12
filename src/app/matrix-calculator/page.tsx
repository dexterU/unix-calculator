import type { Metadata } from 'next'
import MatrixCalculatorClient from './MatrixCalculatorClient'

export const metadata: Metadata = {
  title: 'Matrix Calculator — Matrix Operations Online',
  description:
    'Perform matrix operations including addition, multiplication, transpose, and determinant. Free online matrix calculator.',
  alternates: { canonical: 'https://www.unixcalculator.com/matrix-calculator' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MatrixCalculatorClient />
}
