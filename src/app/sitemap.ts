import { MetadataRoute } from 'next'

const BASE = 'https://unixcalculator.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const tools = ['timestamp-converter','batch-processor','timezone-converter','duration-calculator','cron-generator','log-parser','api-formatter','db-migration']
  const calculators = ['age-calculator','percentage-calculator','bmi-calculator','grade-calculator','calorie-calculator','binary-converter','hash-calculator','regex-tester','file-size-calculator','derivative-calculator','integral-calculator','matrix-calculator','equation-solver','temperature-converter','time-calculator','mortgage-calculator','compound-interest','loan-calculator','cm-to-inches']
  const blog = ['complete-guide-unix-timestamp-precision-2025','session-management-timestamp-expiration','caching-strategies-time-sensitive-data','graphql-subscriptions-realtime-timestamps']
  const knowledge = ['log-timestamp-analysis','rate-limiting-timestamps','graphql-timestamps','c-cpp-unix-timestamps','golang-unix-timestamps']
  const tutorials = ['javascript-timestamps','monitoring-timestamp-strategies','calendar-timestamp-components','webhook-timestamp-security','elasticsearch-timestamp-indexing','rate-limiting-timestamp-algorithms']
  const reference = ['leap-seconds','timestamp-precision','timestamp-formats']

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
    { url: `${BASE}/all-calculators`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...tools.map(t => ({ url: `${BASE}/tools/${t}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.85 })),
    ...calculators.map(c => ({ url: `${BASE}/${c}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.75 })),
    ...blog.map(s => ({ url: `${BASE}/blog/${s}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...knowledge.map(s => ({ url: `${BASE}/knowledge/${s}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...tutorials.map(s => ({ url: `${BASE}/tutorials/${s}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.65 })),
    ...reference.map(s => ({ url: `${BASE}/reference/${s}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.6 })),
  ]
}
