import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign in — Unix Calculator',
  description: 'Sign in to your Unix Calculator account.',
  alternates: { canonical: 'https://unixcalculator.com/login' },
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  return <LoginClient redirectTo={searchParams.redirect} />
}
