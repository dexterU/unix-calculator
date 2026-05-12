import type { Metadata } from 'next'
import CronGeneratorClient from './CronGeneratorClient'

export const metadata: Metadata = {
  title: 'Cron Generator — Crontab Expression Builder & Tester',
  description:
    'Build and test cron expressions with a visual generator. Supports standard cron, AWS EventBridge, and Quartz scheduler syntax.',
  alternates: { canonical: 'https://www.unixcalculator.com/tools/cron-generator' },
}

export default function Page() {
  return <CronGeneratorClient />
}
