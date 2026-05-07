import type { Metadata } from 'next'
import CmToInchesCalculatorClient from './CmToInchesCalculatorClient'

export const metadata: Metadata = {
  title: 'CM to Inches Converter — Centimeters to Inches Calculator',
  description:
    'Convert centimeters to inches and inches to centimeters instantly. Includes conversion formula and common conversion reference table.',
  alternates: { canonical: 'https://unixcalculator.com/cm-to-inches' },
}

export default function Page() {
  return <CmToInchesCalculatorClient />
}
