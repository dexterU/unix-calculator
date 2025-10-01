import { ReactNode } from 'react'

export const metadata = {
  title: 'Unix Calculator - Professional Command Line Math Toolkit',
  description: 'Advanced Unix calculator with BC command support',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
