import type { Metadata } from 'next'
import JavaScriptTimestampsClient from './JavaScriptTimestampsClient'

export const metadata: Metadata = {
  title: 'Javascript Timestamps | Unix Calculator',
  description: 'Javascript Timestamps — Unix Calculator',
}

export default function Page() {
  return <JavaScriptTimestampsClient />
}
