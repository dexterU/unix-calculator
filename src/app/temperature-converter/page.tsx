import type { Metadata } from 'next'
import TemperatureConverterClient from './TemperatureConverterClient'

export const metadata: Metadata = {
  title: 'Temperature Converter — Celsius, Fahrenheit, Kelvin',
  description:
    'Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly. Free online temperature converter with formula explanations.',
  alternates: { canonical: 'https://unixcalculator.com/temperature-converter' },
}

export default function Page() {
  return <TemperatureConverterClient />
}
