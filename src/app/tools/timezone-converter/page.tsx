import type { Metadata } from 'next'
import TimezoneConverterClient from './TimezoneConverterClient'

export const metadata: Metadata = {
  title: 'Timezone Converter | Unix Calculator',
  description: 'Timezone Converter — Unix Calculator',
}

export default function Page() {
  return <TimezoneConverterClient />
}
