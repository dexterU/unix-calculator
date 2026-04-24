import type { Metadata } from 'next'
import ApiFormatterClient from './ApiFormatterClient'

export const metadata: Metadata = {
  title: 'Api Formatter | Unix Calculator',
  description: 'Api Formatter — Unix Calculator',
}

export default function Page() {
  return <ApiFormatterClient />
}
