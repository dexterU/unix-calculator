'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
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

const API_SHELL = `# Format timestamp for API response using curl + jq
curl -s api.example.com/data | \\
  jq '.timestamp | strftime("%Y-%m-%dT%H:%M:%SZ")'

# Generate ISO 8601 timestamp for API call
date -u +"%Y-%m-%dT%H:%M:%SZ"

# RFC 3339 format (used by Google APIs)
date -u +"%Y-%m-%dT%H:%M:%S+00:00"

# Unix ms timestamp for JavaScript APIs
date +%s%3N`

const API_PY = `# Python — format for REST API
from datetime import datetime, timezone
ts = 1733569200
iso = datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
print(iso)  # 2024-12-07T04:00:00+00:00`

const API_JS = `// JavaScript — format for fetch/axios
const ts = 1733569200;
const iso = new Date(ts * 1000).toISOString();
// "2024-12-07T04:00:00.000Z"`

export default function ApiFormatterClient() {
  const [raw, setRaw] = useState('{\n  "hello": "world"\n}')

  const { pretty, error } = useMemo(() => {
    try {
      const v = JSON.parse(raw)
      return {
        pretty: JSON.stringify(v, null, 2),
        error: null as string | null,
      }
    } catch (e) {
      return {
        pretty: null as string | null,
        error: e instanceof Error ? e.message : 'Invalid JSON',
      }
    }
  }, [raw])

  function minify() {
    try {
      const v = JSON.parse(raw)
      setRaw(JSON.stringify(v))
    } catch {
      /* error surfaced via pretty/error */
    }
  }

  function prettify() {
    if (pretty !== null) setRaw(pretty)
  }

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl space-y-4 px-4 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API formatter</h1>
          <p className="text-gray-600">
            Parse and pretty-print JSON payloads. Invalid documents show an error
            below.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={prettify}>
            Prettify
          </Button>
          <Button type="button" variant="outline" onClick={minify}>
            Minify
          </Button>
        </div>
        <Textarea
          className="min-h-[320px] font-mono text-sm"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <RelatedGuides guides={getRelatedGuides('api-formatter')} />
        <TerminalReferenceSection>
          <TerminalRefH2 />
          <TerminalRefIntro>
            Produce ISO and RFC 3339 strings from the shell for headers, JWT claims, and JSON APIs.
          </TerminalRefIntro>
          <TerminalRefCodeBlock label="bash" code={API_SHELL} />
          <TerminalRefSubH3>Language Quick Reference</TerminalRefSubH3>
          <TerminalRefLangTabs
            tabs={[
              { id: 'python', label: 'Python', codeLabel: 'python', code: API_PY },
              { id: 'js', label: 'JavaScript', codeLabel: 'javascript', code: API_JS },
            ]}
          />
          <TerminalRefSubH3>How It Works</TerminalRefSubH3>
          <TerminalRefHowItWorks>
            <p>
              REST APIs commonly use ISO 8601 (2024-12-07T04:00:00Z) because it&apos;s human-readable,
              sortable as a string, and unambiguous. GraphQL typically uses Unix timestamps as integers
              for efficiency. AWS uses ISO 8601 with milliseconds. Stripe uses Unix seconds. Always
              check the API docs — sending milliseconds to an endpoint expecting seconds will produce
              dates 1000x in the future.
            </p>
          </TerminalRefHowItWorks>
        </TerminalReferenceSection>
      </main>
    </div>
  )
}
