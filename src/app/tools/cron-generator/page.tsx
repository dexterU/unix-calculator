import type { Metadata } from 'next'
import CronGeneratorClient from './CronGeneratorClient'

export const metadata: Metadata = {
  title: 'Cron Generator | Unix Calculator',
  description: 'Cron Generator — Unix Calculator',
}

export default function Page() {
  return <CronGeneratorClient />
}
