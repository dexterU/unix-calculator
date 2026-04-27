import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: {
    default: 'Unix Calculator — Timestamp Converter & Developer Tools',
    template: '%s | Unix Calculator',
  },
  description: 'Free Unix timestamp converter, BC calculator, cron generator, and 20+ developer tools.',
  metadataBase: new URL('https://unixcalculator.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <nav aria-label="Skip links">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
        </nav>
        <Providers>
          <div id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
