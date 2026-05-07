import type { Metadata } from 'next'
import MatrixCalculatorClient from './MatrixCalculatorClient'

export const metadata: Metadata = {
  title: 'Matrix Calculator — Matrix Operations Online',
  description:
    'Perform matrix operations including addition, multiplication, transpose, and determinant. Free online matrix calculator.',
  alternates: { canonical: 'https://unixcalculator.com/matrix-calculator' },
}

export default function Page() {
  return <MatrixCalculatorClient />
}
