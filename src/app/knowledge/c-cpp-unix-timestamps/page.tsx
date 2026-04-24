import type { Metadata } from 'next'
import CCppUnixTimestampsClient from './CCppUnixTimestampsClient'

export const metadata: Metadata = {
  title: 'C Cpp Unix Timestamps | Unix Calculator',
  description: 'C Cpp Unix Timestamps — Unix Calculator',
}

export default function Page() {
  return <CCppUnixTimestampsClient />
}
