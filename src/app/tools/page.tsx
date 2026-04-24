import type { Metadata } from 'next'
import ToolsHubClient from './ToolsHubClient'

export const metadata: Metadata = {
  title: 'Tools | Unix Calculator',
  description: 'Tools — Unix Calculator',
}

export default function Page() {
  return <ToolsHubClient />
}
