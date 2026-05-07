import type { Metadata } from 'next'
import DbMigrationClient from './DbMigrationClient'

export const metadata: Metadata = {
  title: 'Database Timestamp Migration Tool — Integer to TIMESTAMPTZ',
  description:
    'Generate SQL migration scripts to convert Unix integer timestamps to proper database timestamp columns. Supports PostgreSQL, MySQL, SQLite.',
  alternates: { canonical: 'https://unixcalculator.com/tools/db-migration' },
}

export default function Page() {
  return <DbMigrationClient />
}
