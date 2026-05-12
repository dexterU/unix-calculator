import type { Metadata } from 'next'
import TimezoneConverterClient from './TimezoneConverterClient'

export const metadata: Metadata = {
  title: 'Timezone Converter — Convert Time Between Timezones',
  description:
    'Convert time between any two timezones instantly. Supports all IANA timezones with DST awareness. Free online timezone converter.',
  alternates: { canonical: 'https://www.unixcalculator.com/tools/timezone-converter' },
}

export default function Page() {
  return <TimezoneConverterClient />
}
