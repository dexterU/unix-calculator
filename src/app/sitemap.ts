import { MetadataRoute } from 'next'
import { getAllPublishedSlugs } from '@/lib/supabase/blog'

const BASE = 'https://www.unixcalculator.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const popularTimestamps = [
    '0',
    '946684800',
    '2147483647',
    '1000000000',
    '1500000000',
    '1700000000',
    '1750000000',
    '1764581115',
    '1733529600',
    '1704067200',
    '1735689600',
    '1767225600',
  ]
  const tools = [
    'timestamp-debugger',
    'timestamp-converter',
    'timestamp-api',
    'batch-processor',
    'timezone-converter',
    'duration-calculator',
    'cron-generator',
    'cron-next-runs',
    'log-parser',
    'api-formatter',
    'db-migration',
    'jwt-decoder',
    'permissions-calculator',
  ]
  const calculators = [
    'age-calculator',
    'percentage-calculator',
    'binary-converter',
    'hash-calculator',
    'regex-tester',
    'file-size-calculator',
    'temperature-converter',
    'time-calculator',
  ]
  const blogSlugs = await getAllPublishedSlugs()
  const knowledge = [
    'log-timestamp-analysis',
    'rate-limiting-timestamps',
    'graphql-timestamps',
    'c-cpp-unix-timestamps',
    'golang-unix-timestamps',
  ]
  const tutorials = [
    'javascript-timestamps',
    'monitoring-timestamp-strategies',
    'calendar-timestamp-components',
    'webhook-timestamp-security',
    'elasticsearch-timestamp-indexing',
    'rate-limiting-timestamp-algorithms',
  ]
  const reference = ['leap-seconds', 'timestamp-precision', 'timestamp-formats']

  return [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/knowledge`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/tutorials`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/reference`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/function-reference`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/case-studies`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/challenges`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/cheatsheets`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/cheatsheets/javascript`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/cheatsheets/python`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/cheatsheets/go`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/cheatsheets/c-cpp`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/cheatsheets/postgresql`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/cheatsheets/php`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/all-calculators`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...popularTimestamps.map((ts) => ({
      url: `${BASE}/convert/${ts}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...tools.map((t) => ({
      url: `${BASE}/tools/${t}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...calculators.map((c) => ({
      url: `${BASE}/${c}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...blogSlugs.map((s) => ({
      url: `${BASE}/blog/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...knowledge.map((s) => ({
      url: `${BASE}/knowledge/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...tutorials.map((s) => ({
      url: `${BASE}/tutorials/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...reference.map((s) => ({
      url: `${BASE}/reference/${s}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
