import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact | Unix Calculator',
  description: 'Contact — Unix Calculator',
}

export default function Page() {
  return <ContactClient />
}
