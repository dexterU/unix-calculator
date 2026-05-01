import type { Metadata } from 'next'
import CmToInchesCalculatorClient from './CmToInchesCalculatorClient'

export const metadata: Metadata = {
  title: 'CM to Inches Converter | Unix Calculator',
  description:
    'Convert centimeters to inches using the exact 2.54 cm per inch factor. Browser-side calculator with Unix-style bc example.',
}

export default function Page() {
  return <CmToInchesCalculatorClient />
}
