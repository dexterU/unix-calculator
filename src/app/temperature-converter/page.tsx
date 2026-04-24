import type { Metadata } from 'next'
import TemperatureConverterClient from './TemperatureConverterClient'

export const metadata: Metadata = {
  title: 'Temperature Converter | Unix Calculator',
  description: 'Temperature Converter — Unix Calculator',
}

export default function Page() {
  return <TemperatureConverterClient />
}
