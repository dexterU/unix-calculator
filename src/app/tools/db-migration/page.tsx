import type { Metadata } from 'next'
import DbMigrationClient from './DbMigrationClient'

export const metadata: Metadata = {
  title: 'Db Migration | Unix Calculator',
  description: 'Db Migration — Unix Calculator',
}

export default function Page() {
  return <DbMigrationClient />
}
