import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: {
    default: 'Unix Calculator — Timestamp Converter & Developer Tools',
    template: '%s | Unix Calculator',
  },
  description: 'Free Unix timestamp converter, BC calculator, cron generator, and 20+ developer tools.',
  metadataBase: new URL('https://www.unixcalculator.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="impact-site-verification"
          content="2fe52321-ec63-43cb-b036-bedc66a1fbf1"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5643430532021522"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <div id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
