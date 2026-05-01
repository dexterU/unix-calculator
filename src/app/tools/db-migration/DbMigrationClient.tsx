'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RelatedGuides } from '@/components/RelatedGuides'
import { getRelatedGuides } from '@/lib/related-guides'
import {
  TerminalReferenceSection,
  TerminalRefCodeBlock,
  TerminalRefH2,
  TerminalRefHowItWorks,
  TerminalRefIntro,
  TerminalRefLangTabs,
  TerminalRefSubH3,
} from '@/components/tools/TerminalReference'

const DB_SHELL = `# PostgreSQL: convert stored integers to timestamptz
psql -c "SELECT to_timestamp(created_at) FROM users LIMIT 5;"

# MySQL: convert Unix timestamps
mysql -e "SELECT FROM_UNIXTIME(created_at) FROM users LIMIT 5;"

# SQLite: timestamps are stored as integers
sqlite3 app.db "SELECT datetime(created_at, 'unixepoch') \\
  FROM users LIMIT 5;"

# PostgreSQL: migrate integer column to timestamptz
psql << 'EOF'
ALTER TABLE events ADD COLUMN created_ts TIMESTAMPTZ;
UPDATE events SET created_ts = to_timestamp(created_at);
ALTER TABLE events DROP COLUMN created_at;
ALTER TABLE events RENAME COLUMN created_ts TO created_at;
EOF`

const DB_PY = `# Python SQLAlchemy migration
from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text(
        "UPDATE events SET created_at = "
        "to_timestamp(created_at_unix)"
    ))`

const DB_SQL = `-- Safe migration with rollback capability
BEGIN;
ALTER TABLE events ADD COLUMN created_at_new TIMESTAMPTZ;
UPDATE events
  SET created_at_new = to_timestamp(created_at_unix);
-- Verify before committing
SELECT COUNT(*) FROM events WHERE created_at_new IS NULL;
COMMIT; -- or ROLLBACK if issues found`

export default function DbMigrationClient() {
  const [version, setVersion] = useState('20250422000000')
  const [name, setName] = useState('add_users_table')
  const [sql, setSql] = useState(
    '-- Up migration\nCREATE TABLE example (id uuid PRIMARY KEY);\n\n-- Down migration\n-- DROP TABLE example;'
  )

  const filename = `${version}_${name.replace(/[^a-z0-9_]+/gi, '_').toLowerCase()}.sql`

  function copyName() {
    void navigator.clipboard.writeText(filename)
  }

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DB migration helper
          </h1>
          <p className="text-gray-600">
            Draft timestamp-prefixed migration filenames and SQL bodies. Adapt to
            your migration runner (Flyway, Liquibase, Prisma, etc.).
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ver">Version prefix</Label>
            <Input
              id="ver"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="YYYYMMDDHHmmss"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Short name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="snake_case"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-sm font-mono bg-white border border-gray-200 rounded px-2 py-1">
            {filename}
          </code>
          <Button type="button" variant="outline" size="sm" onClick={copyName}>
            Copy filename
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sql">SQL</Label>
          <Textarea
            id="sql"
            className="min-h-[240px] font-mono text-sm"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
          />
        </div>

        <RelatedGuides guides={getRelatedGuides('db-migration')} />
        <TerminalReferenceSection>
          <TerminalRefH2 />
          <TerminalRefIntro>
            Inspect and migrate epoch columns with psql, mysql, sqlite3, and idempotent SQL patterns.
          </TerminalRefIntro>
          <TerminalRefCodeBlock label="bash" code={DB_SHELL} />
          <TerminalRefSubH3>Language Quick Reference</TerminalRefSubH3>
          <TerminalRefLangTabs
            tabs={[
              { id: 'python', label: 'Python', codeLabel: 'python', code: DB_PY },
              { id: 'sql', label: 'SQL', codeLabel: 'sql', code: DB_SQL },
            ]}
          />
          <TerminalRefSubH3>How It Works</TerminalRefSubH3>
          <TerminalRefHowItWorks>
            <p>
              Database timestamp migrations require care because data loss is irreversible. Always add a
              new column rather than modifying existing data in place. Verify row counts match before
              dropping the old column. Consider timezone: PostgreSQL&apos;s TIMESTAMPTZ stores UTC and
              converts on read. MySQL&apos;s TIMESTAMP also stores UTC but DATETIME does not. SQLite has
              no native timestamp type — integers or ISO strings are convention only.
            </p>
          </TerminalRefHowItWorks>
        </TerminalReferenceSection>
      </main>
    </div>
  )
}
