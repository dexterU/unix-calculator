import type { Metadata } from 'next'
import { CronNextRunsClient } from './CronNextRunsClient'

export const metadata: Metadata = {
  title: 'Cron Next 10 Runs — Cron Expression Scheduler & Tester',
  description:
    'See the next 10 scheduled run times for any cron expression. Timezone-aware, supports standard 5-field and 6-field cron. Free cron job scheduler tester.',
  alternates: {
    canonical: 'https://unixcalculator.com/tools/cron-next-runs',
  },
}

export default function Page() {
  return <CronNextRunsClient />
}
