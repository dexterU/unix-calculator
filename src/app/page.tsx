import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'
import { buildFaqPageSchema, buildHowToSchema } from '@/lib/homepage-seo'

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter — Epoch to Date & Time | UnixCalculator.com',
  description:
    'Convert Unix timestamps to human-readable dates instantly. Free epoch converter supports seconds, milliseconds, microseconds, and 25+ timezones. Used by 50,000+ developers.',
  alternates: { canonical: 'https://unixcalculator.com' },
  openGraph: {
    title: 'Unix Timestamp Converter — Epoch to Date & Time',
    description:
      'Free epoch converter. Seconds, milliseconds, microseconds. 25+ timezones. No login required.',
    url: 'https://unixcalculator.com',
    type: 'website',
  },
}

const softwareApplicationLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Unix Timestamp Converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free Unix timestamp converter. Convert epoch to date instantly.',
  url: 'https://unixcalculator.com',
}

const breadcrumbListLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://unixcalculator.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Tools',
      item: 'https://unixcalculator.com/tools',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Unix Timestamp Converter',
      item: 'https://unixcalculator.com',
    },
  ],
}

const jsonLdBlocks = [
  softwareApplicationLd,
  buildFaqPageSchema(),
  buildHowToSchema(),
  breadcrumbListLd,
]

export default function HomePage() {
  return (
    <>
      {jsonLdBlocks.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <HomePageClient />
    </>
  )
}
