'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12 max-w-3xl space-y-6">
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
      </main>
    </div>
  )
}
