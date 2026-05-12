import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact — Unix Calculator',
  description: 'Get in touch with the Unix Calculator team for feedback, partnerships, or support.',
  alternates: { canonical: 'https://www.unixcalculator.com/contact' },
}

export default function Page() {
  return <ContactClient />
}
