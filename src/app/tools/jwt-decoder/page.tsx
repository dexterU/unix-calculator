import type { Metadata } from 'next'
import { JwtDecoderClient } from './JwtDecoderClient'

export const metadata: Metadata = {
  title: 'JWT Decoder — Decode JSON Web Tokens Instantly',
  description:
    'Decode JWT tokens instantly. View header, payload, and signature. Checks expiry, issued-at, and token validity. Free online JWT decoder — no data sent to servers.',
  alternates: { canonical: 'https://unixcalculator.com/tools/jwt-decoder' },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <JwtDecoderClient />
}
