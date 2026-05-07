import type { Metadata } from 'next'
import BMICalculatorClient from './BMICalculatorClient'

export const metadata: Metadata = {
  title: 'BMI Calculator — Body Mass Index Calculator Free',
  description:
    'Calculate your Body Mass Index instantly. Enter height and weight in metric or imperial units. Includes BMI categories and healthy weight range.',
  alternates: { canonical: 'https://unixcalculator.com/bmi-calculator' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <BMICalculatorClient />
}
