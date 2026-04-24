import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Unix Calculator - Advanced BC Command Calculator & Math Toolkit',
  description:
    'Professional Unix calculator with BC command syntax, AWK math operations, bash arithmetic. Interactive tutorials, examples, and comprehensive reference guide for developers.',
  keywords:
    'unix calculator, bash calculator, command line math, bc command calculator, terminal calculator, linux calculate expression',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'GA_MEASUREMENT_ID'}');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
