import type { Metadata } from 'next'
import MonitoringTimestampStrategiesClient from './MonitoringTimestampStrategiesClient'

export const metadata: Metadata = {
  title: 'Monitoring Timestamp Strategies — Metrics, Logs & Alerts',
  description:
    'Align Prometheus, Grafana, and log pipelines on UTC; bucket boundaries, SLO windows, and incident timelines.',
  alternates: { canonical: 'https://unixcalculator.com/tutorials/monitoring-timestamp-strategies' },
}

export default function Page() {
  return <MonitoringTimestampStrategiesClient />
}
