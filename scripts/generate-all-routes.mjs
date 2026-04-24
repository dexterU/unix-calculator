import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd())
const appDir = path.join(root, 'src', 'app')
const lovableDir = path.join(root, 'src', '_lovable_pages')

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

function titleCase(s) {
  return s
    .split(/[-/]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** [urlPath, lovableImportPath, defaultExportName, bridgeKey?] */
const ROUTES = [
  ['tools', 'ToolsHub', 'ToolsHub', 'tools-hub'],
  ['tools/batch-processor', 'tools/BatchProcessor', 'BatchProcessor'],
  ['tools/timezone-converter', 'tools/TimezoneConverter', 'TimezoneConverter'],
  ['tools/duration-calculator', 'tools/DurationCalculator', 'DurationCalculator'],
  ['tools/cron-generator', 'tools/CronGenerator', 'CronGenerator'],
  ['tools/log-parser', 'tools/LogParser', 'LogParser'],
  ['tools/api-formatter', 'tools/ApiFormatter', 'ApiFormatter'],
  ['tools/db-migration', 'tools/DbMigration', 'DbMigration'],
  ['age-calculator', 'AgeCalculator', 'AgeCalculator', 'age-bridge'],
  [
    'percentage-calculator',
    'PercentageCalculator',
    'PercentageCalculator',
    'percentage-bridge',
  ],
  ['bmi-calculator', 'BMICalculator', 'BMICalculator'],
  ['grade-calculator', 'GradeCalculator', 'GradeCalculator'],
  ['calorie-calculator', 'CalorieCalculator', 'CalorieCalculator'],
  ['binary-converter', 'BinaryConverter', 'BinaryConverter'],
  ['hash-calculator', 'HashCalculator', 'HashCalculator'],
  ['regex-tester', 'RegexTester', 'RegexTester'],
  ['file-size-calculator', 'FileSizeCalculator', 'FileSizeCalculator'],
  ['derivative-calculator', 'DerivativeCalculator', 'DerivativeCalculator'],
  ['integral-calculator', 'IntegralCalculator', 'IntegralCalculator'],
  ['matrix-calculator', 'MatrixCalculator', 'MatrixCalculator'],
  ['equation-solver', 'EquationSolver', 'EquationSolver'],
  ['temperature-converter', 'TemperatureConverter', 'TemperatureConverter'],
  ['time-calculator', 'TimeCalculator', 'TimeCalculator'],
  ['mortgage-calculator', 'MortgageCalculator', 'MortgageCalculator'],
  [
    'compound-interest',
    'CompoundInterestCalculator',
    'CompoundInterestCalculator',
  ],
  ['loan-calculator', 'LoanCalculator', 'LoanCalculator'],
  ['blog', 'BlogNew', 'BlogNew'],
  [
    'blog/complete-guide-unix-timestamp-precision-2025',
    'blog/TimestampPrecision2025',
    'TimestampPrecision2025',
  ],
  [
    'blog/session-management-timestamp-expiration',
    'blog/SessionManagementTimestamps',
    'SessionManagementTimestamps',
  ],
  [
    'blog/caching-strategies-time-sensitive-data',
    'blog/CachingStrategiesTimestamps',
    'CachingStrategiesTimestamps',
  ],
  [
    'blog/graphql-subscriptions-realtime-timestamps',
    'blog/GraphqlTimestamps',
    'GraphqlTimestamps',
  ],
  ['knowledge', 'KnowledgeBase', 'KnowledgeBase'],
  [
    'knowledge/log-timestamp-analysis',
    'knowledge/LogTimestampAnalysis',
    'LogTimestampAnalysis',
  ],
  [
    'knowledge/rate-limiting-timestamps',
    'knowledge/RateLimitingTimestamps',
    'RateLimitingTimestamps',
  ],
  [
    'knowledge/graphql-timestamps',
    'knowledge/GraphqlTimestamps',
    'GraphqlTimestamps',
  ],
  ['knowledge/c-cpp-unix-timestamps', 'knowledge/CCppUnixTimestamps', 'CCppUnixTimestamps'],
  [
    'knowledge/golang-unix-timestamps',
    'knowledge/GolangUnixTimestamps',
    'GolangUnixTimestamps',
  ],
  ['tutorials', 'TutorialSeries', 'TutorialSeries'],
  [
    'tutorials/javascript-timestamps',
    'tutorials/JavaScriptTimestamps',
    'JavaScriptTimestamps',
  ],
  [
    'tutorials/monitoring-timestamp-strategies',
    'tutorials/MonitoringTimestampStrategies',
    'MonitoringTimestampStrategies',
  ],
  [
    'tutorials/calendar-timestamp-components',
    'tutorials/CalendarTimestampComponents',
    'CalendarTimestampComponents',
  ],
  [
    'tutorials/webhook-timestamp-security',
    'tutorials/WebhookTimestampSecurity',
    'WebhookTimestampSecurity',
  ],
  [
    'tutorials/elasticsearch-timestamp-indexing',
    'tutorials/ElasticsearchTimestampIndexing',
    'ElasticsearchTimestampIndexing',
  ],
  [
    'tutorials/rate-limiting-timestamp-algorithms',
    'tutorials/RateLimitingAlgorithms',
    'RateLimitingAlgorithms',
  ],
  ['reference', 'ReferenceHub', 'ReferenceHub'],
  ['reference/leap-seconds', 'reference/LeapSeconds', 'LeapSeconds'],
  ['reference/timestamp-precision', 'reference/TimestampPrecision', 'TimestampPrecision'],
  ['about', 'About', 'About'],
  ['contact', 'Contact', 'Contact'],
  ['privacy-policy', 'PrivacyPolicy', 'PrivacyPolicy'],
  ['terms-of-service', 'TermsOfService', 'TermsOfService'],
  ['all-calculators', 'AllCalculators', 'AllCalculators'],
  ['case-studies', 'CaseStudies', 'CaseStudies'],
  ['challenges', 'Challenges', 'Challenges'],
  ['function-reference', 'FunctionReference', 'FunctionReference'],
  ['sitemap', 'SitemapPage', 'SitemapPage'],
]

const BRIDGES = {
  'tools-hub': `'use client'

import { ToolsIndexPage } from './tools/ToolsIndexPage'

export default function ToolsHub() {
  return <ToolsIndexPage />
}
`,
  'age-bridge': `'use client'

import { AgeCalculator as AgeCalculatorUI } from '@/components/AgeCalculator'
import { Header } from '@/components/Header'

export default function AgeCalculator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <AgeCalculatorUI />
      </div>
    </div>
  )
}
`,
  'percentage-bridge': `'use client'

import { PercentageCalculator as PercentageCalculatorUI } from '@/components/PercentageCalculator'
import { Header } from '@/components/Header'

export default function PercentageCalculator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <PercentageCalculatorUI />
      </div>
    </div>
  )
}
`,
}

function stubContent(exportName) {
  return `'use client'

/** Replace with your Lovable page (this file path). */
export default function ${exportName}() {
  return null
}
`
}

for (const row of ROUTES) {
  const [urlPath, lovableImport, exportName, bridgeKey] = row
  const lovableFile = path.join(lovableDir, ...lovableImport.split('/')) + '.tsx'

  if (bridgeKey && BRIDGES[bridgeKey]) {
    writeFile(lovableFile, BRIDGES[bridgeKey])
  } else if (!fs.existsSync(lovableFile)) {
    writeFile(lovableFile, stubContent(exportName))
  }

  const segments = urlPath.split('/')
  const routeDir = path.join(appDir, ...segments)
  const clientName = `${exportName}Client`
  const clientFile = path.join(routeDir, `${clientName}.tsx`)
  const importAlias = `@/_lovable_pages/${lovableImport}`

  const pageTitle = titleCase(segments[segments.length - 1])
  const desc = `${pageTitle} — Unix Calculator`

  const clientTsx = `'use client'

import ${exportName} from '${importAlias}'

export default function ${clientName}() {
  return <${exportName} />
}
`

  const pageTsx = `import type { Metadata } from 'next'
import ${clientName} from './${clientName}'

export const metadata: Metadata = {
  title: '${pageTitle.replace(/'/g, "\\'")} | Unix Calculator',
  description: '${desc.replace(/'/g, "\\'")}',
}

export default function Page() {
  return <${clientName} />
}
`

  writeFile(clientFile, clientTsx)
  writeFile(path.join(routeDir, 'page.tsx'), pageTsx)
}

const toolsPaths = ROUTES.filter((r) => r[0].startsWith('tools')).map((r) => {
  const p = '/' + r[0]
  const title = titleCase(r[0].split('/').pop())
  return { path: p, title, description: `${title} — Unix Calculator tools` }
})

if (!toolsPaths.find((t) => t.path === '/tools/unix-timestamp-converter')) {
  toolsPaths.splice(1, 0, {
    path: '/tools/unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    description: 'Convert between Unix epoch seconds and local/UTC datetime.',
  })
}

const appTsx = `/**
 * Route registry — sync with Lovable App.tsx.
 */
export type ToolsRouteDef = {
  path: string
  title: string
  description: string
}

export const TOOLS_ROUTE_LIST: ToolsRouteDef[] = ${JSON.stringify(toolsPaths, null, 2)}
`

writeFile(path.join(root, 'src', 'App.tsx'), appTsx)

console.log('Generated', ROUTES.length, 'routes')
