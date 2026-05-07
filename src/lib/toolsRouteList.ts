/**
 * Tool routes — keep in sync with `src/App.tsx` (React Router source of truth).
 */
export type ToolsRouteDef = {
  path: string
  title: string
  description: string
}

export const TOOLS_ROUTE_LIST: ToolsRouteDef[] = [
  {
    path: '/tools',
    title: 'Tools',
    description: 'Unix Calculator tools and converters.',
  },
  {
    path: '/tools/timestamp-debugger',
    title: 'Timestamp Debugger',
    description: 'Auto-detect any timestamp format instantly.',
  },
  {
    path: '/tools/jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode JSON Web Tokens instantly',
  },
  {
    path: '/tools/permissions-calculator',
    title: 'Permissions Calculator',
    description: 'chmod calculator with visual bit toggling',
  },
  {
    path: '/tools/timestamp-converter',
    title: 'Timestamp Converter',
    description:
      'Convert between Unix epoch seconds and human-readable UTC/local datetime.',
  },
  {
    path: '/tools/timestamp-api',
    title: 'Timestamp API',
    description: 'Free JSON API — no key required',
  },
  {
    path: '/tools/batch-processor',
    title: 'Batch Processor',
    description: 'Batch timestamp and data processing.',
  },
  {
    path: '/tools/timezone-converter',
    title: 'Timezone Converter',
    description: 'Convert times across time zones.',
  },
  {
    path: '/tools/duration-calculator',
    title: 'Duration Calculator',
    description: 'Compute durations between dates and times.',
  },
  {
    path: '/tools/cron-generator',
    title: 'Cron Generator',
    description: 'Build and validate cron expressions.',
  },
  {
    path: '/tools/cron-next-runs',
    title: 'Cron Next Runs',
    description: 'See next 10 scheduled times for any cron expression',
  },
  {
    path: '/tools/log-parser',
    title: 'Log Parser',
    description: 'Parse and analyze log timestamps.',
  },
  {
    path: '/tools/api-formatter',
    title: 'API Formatter',
    description: 'Format and inspect API payloads.',
  },
  {
    path: '/tools/db-migration',
    title: 'DB Migration',
    description: 'Helpers for database migration timestamps.',
  },
]
