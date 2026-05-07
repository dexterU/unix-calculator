import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Unix Calculator — Free Developer Tools',
  description:
    'Unix Calculator is a free collection of developer tools and calculators built for engineers, sysadmins, and developers.',
  alternates: { canonical: 'https://unixcalculator.com/about' },
}

export default function Page() {
  return <AboutClient />
}
