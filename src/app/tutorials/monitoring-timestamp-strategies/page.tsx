import type { Metadata } from 'next'
import MonitoringTimestampStrategiesClient from './MonitoringTimestampStrategiesClient'

export const metadata: Metadata = {
  title: 'Monitoring Timestamp Strategies | Unix Calculator',
  description: 'Monitoring Timestamp Strategies — Unix Calculator',
}

export default function Page() {
  return <MonitoringTimestampStrategiesClient />
}
