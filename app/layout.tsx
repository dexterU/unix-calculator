import './globals.css'

export const metadata = {
  title: 'Unix Calculator - Advanced BC Command Calculator & Math Toolkit',
  description: 'Professional Unix calculator with BC command syntax, AWK math operations, bash arithmetic. Interactive tutorials, examples, and comprehensive reference guide for developers.',
  keywords: 'unix calculator, bash calculator, command line math, bc command calculator, terminal calculator, linux calculate expression',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
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
