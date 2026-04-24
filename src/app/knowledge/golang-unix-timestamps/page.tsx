import type { Metadata } from 'next'
import GolangUnixTimestampsClient from './GolangUnixTimestampsClient'

export const metadata: Metadata = {
  title: 'Golang Unix Timestamps | Unix Calculator',
  description: 'Golang Unix Timestamps — Unix Calculator',
}

export default function Page() {
  return <GolangUnixTimestampsClient />
}
