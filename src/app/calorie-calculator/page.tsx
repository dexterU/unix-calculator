import type { Metadata } from 'next'
import CalorieCalculatorClient from './CalorieCalculatorClient'

export const metadata: Metadata = {
  title: 'Calorie Calculator — Daily Calorie Needs Calculator',
  description:
    'Calculate your daily calorie needs based on age, weight, height, and activity level. Uses Mifflin-St Jeor equation for accurate BMR calculation.',
  alternates: { canonical: 'https://www.unixcalculator.com/calorie-calculator' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CalorieCalculatorClient />
}
