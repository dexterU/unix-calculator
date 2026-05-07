export interface Guide {
  title: string
  href: string
  category: string
  readTime: string
  description: string
}

export const GUIDES: Record<string, Guide[]> = {
  'jwt-decoder': [
    {
      title: 'Session Management with Timestamp Expiration',
      href: '/blog/session-management-timestamp-expiration',
      category: 'Tutorial',
      readTime: '8 min',
      description:
        'How JWT exp claims work with Unix timestamps for secure session management.',
    },
    {
      title: 'Webhook Timestamp Security',
      href: '/tutorials/webhook-timestamp-security',
      category: 'Security',
      readTime: '8 min',
      description: 'Validate JWT timestamps in webhook payloads to prevent replay attacks.',
    },
    {
      title: 'Unix Timestamp Precision Guide',
      href: '/blog/complete-guide-unix-timestamp-precision-2025',
      category: 'Deep Dive',
      readTime: '12 min',
      description:
        'How JWT exp and iat claims use Unix timestamps and precision implications.',
    },
  ],
  'timestamp-converter': [
    {
      title: 'Complete Guide to Unix Timestamp Precision in 2026',
      href: '/blog/complete-guide-unix-timestamp-precision-2025',
      category: 'Deep Dive',
      readTime: '12 min',
      description:
        'Everything you need to know about timestamp precision, rounding errors, and microsecond accuracy in production systems.',
    },
    {
      title: 'Unix Timestamps in JavaScript — Date.now() vs Performance.now()',
      href: '/tutorials/javascript-timestamps',
      category: 'Tutorial',
      readTime: '8 min',
      description:
        'When to use Date.now(), performance.now(), and the Temporal API for accurate time handling in JavaScript.',
    },
    {
      title: 'Session Management with Timestamp Expiration',
      href: '/blog/session-management-timestamp-expiration',
      category: 'Tutorial',
      readTime: '6 min',
      description:
        'How to implement JWT expiration, session timeouts, and token refresh using Unix timestamps correctly.',
    },
  ],
  'timezone-converter': [
    {
      title: 'Unix Timestamps in JavaScript — Timezone Handling',
      href: '/tutorials/javascript-timestamps',
      category: 'Tutorial',
      readTime: '8 min',
      description:
        'Master the Intl.DateTimeFormat API, timezone-aware date handling, and DST edge cases in JavaScript.',
    },
    {
      title: 'Monitoring Timestamp Strategies for Distributed Systems',
      href: '/tutorials/monitoring-timestamp-strategies',
      category: 'Tutorial',
      readTime: '10 min',
      description:
        'How to handle timestamps across multiple timezones in distributed monitoring and observability systems.',
    },
    {
      title: 'Caching Strategies for Time-Sensitive Data',
      href: '/blog/caching-strategies-time-sensitive-data',
      category: 'Guide',
      readTime: '7 min',
      description:
        'Cache invalidation using timestamps, TTL strategies, and timezone-aware caching patterns.',
    },
  ],
  'cron-generator': [
    {
      title: 'Rate Limiting Algorithms with Unix Timestamps',
      href: '/tutorials/rate-limiting-timestamp-algorithms',
      category: 'Tutorial',
      readTime: '9 min',
      description:
        'Implement token bucket, sliding window, and fixed window rate limiting using Unix timestamps.',
    },
    {
      title: 'Monitoring Timestamp Strategies',
      href: '/tutorials/monitoring-timestamp-strategies',
      category: 'Tutorial',
      readTime: '10 min',
      description:
        'Schedule monitoring jobs correctly using cron and timestamp-based alerting systems.',
    },
    {
      title: 'Webhook Timestamp Security',
      href: '/tutorials/webhook-timestamp-security',
      category: 'Security',
      readTime: '8 min',
      description:
        'Prevent replay attacks by validating webhook timestamps and implementing signature verification.',
    },
  ],
  'log-parser': [
    {
      title: 'Log Timestamp Analysis — Finding Patterns',
      href: '/knowledge/log-timestamp-analysis',
      category: 'Knowledge Base',
      readTime: '11 min',
      description:
        'Parse, normalize, and analyze timestamps from nginx, Apache, syslog, and application logs.',
    },
    {
      title: 'Elasticsearch Timestamp Indexing',
      href: '/tutorials/elasticsearch-timestamp-indexing',
      category: 'Tutorial',
      readTime: '9 min',
      description:
        'Index log data by timestamp in Elasticsearch for fast time-range queries and real-time analytics.',
    },
    {
      title: 'Unix Timestamp Precision Guide',
      href: '/blog/complete-guide-unix-timestamp-precision-2025',
      category: 'Deep Dive',
      readTime: '12 min',
      description:
        'Understand precision issues when parsing high-volume log data with millisecond timestamps.',
    },
  ],
  'batch-processor': [
    {
      title: 'Unix Timestamp Precision Guide',
      href: '/blog/complete-guide-unix-timestamp-precision-2025',
      category: 'Deep Dive',
      readTime: '12 min',
      description:
        'Handle precision edge cases when processing millions of timestamps in batch pipelines.',
    },
    {
      title: 'Elasticsearch Timestamp Indexing',
      href: '/tutorials/elasticsearch-timestamp-indexing',
      category: 'Tutorial',
      readTime: '9 min',
      description:
        'Efficiently index and query large batches of timestamped documents in Elasticsearch.',
    },
    {
      title: 'Caching Strategies for Time-Sensitive Data',
      href: '/blog/caching-strategies-time-sensitive-data',
      category: 'Guide',
      readTime: '7 min',
      description:
        'Cache batch processing results using timestamp-based TTL and invalidation strategies.',
    },
  ],
  'api-formatter': [
    {
      title: 'GraphQL Subscriptions with Real-Time Timestamps',
      href: '/blog/graphql-subscriptions-realtime-timestamps',
      category: 'Guide',
      readTime: '8 min',
      description:
        'Format and transmit timestamps in GraphQL APIs using subscriptions and real-time data.',
    },
    {
      title: 'Webhook Timestamp Security',
      href: '/tutorials/webhook-timestamp-security',
      category: 'Security',
      readTime: '8 min',
      description:
        'Sign and verify API timestamps to prevent replay attacks in your webhook endpoints.',
    },
    {
      title: 'Rate Limiting with Unix Timestamps',
      href: '/knowledge/rate-limiting-timestamps',
      category: 'Knowledge Base',
      readTime: '7 min',
      description:
        'Implement API rate limiting using Unix timestamps for accurate sliding window calculations.',
    },
  ],
  'duration-calculator': [
    {
      title: 'Session Management with Timestamp Expiration',
      href: '/blog/session-management-timestamp-expiration',
      category: 'Tutorial',
      readTime: '6 min',
      description:
        'Calculate session durations, token lifetimes, and expiration windows using Unix timestamps.',
    },
    {
      title: 'Calendar Timestamp Components',
      href: '/tutorials/calendar-timestamp-components',
      category: 'Tutorial',
      readTime: '7 min',
      description:
        'Build date range pickers and duration displays using Unix timestamps as the source of truth.',
    },
    {
      title: 'Caching Strategies for Time-Sensitive Data',
      href: '/blog/caching-strategies-time-sensitive-data',
      category: 'Guide',
      readTime: '7 min',
      description:
        'Use duration calculations to set intelligent cache TTLs and expiration policies.',
    },
  ],
  'db-migration': [
    {
      title: 'Unix Timestamp Precision Guide',
      href: '/blog/complete-guide-unix-timestamp-precision-2025',
      category: 'Deep Dive',
      readTime: '12 min',
      description:
        'Avoid precision loss when migrating timestamp columns between database systems.',
    },
    {
      title: 'Elasticsearch Timestamp Indexing',
      href: '/tutorials/elasticsearch-timestamp-indexing',
      category: 'Tutorial',
      readTime: '9 min',
      description:
        'Migrate time-series data to Elasticsearch with correct timestamp mapping and indexing.',
    },
    {
      title: 'GraphQL Timestamps',
      href: '/knowledge/graphql-timestamps',
      category: 'Knowledge Base',
      readTime: '6 min',
      description:
        'Expose migrated timestamp columns correctly through GraphQL APIs after database changes.',
    },
  ],
  'age-calculator': [
    {
      title: 'Unix Timestamps in JavaScript',
      href: '/tutorials/javascript-timestamps',
      category: 'Tutorial',
      readTime: '8 min',
      description:
        'Use Date.now() and timestamp arithmetic to calculate precise ages in JavaScript.',
    },
    {
      title: 'Calendar Timestamp Components',
      href: '/tutorials/calendar-timestamp-components',
      category: 'Tutorial',
      readTime: '7 min',
      description:
        'Build date pickers and age calculators using Unix timestamps as the underlying data model.',
    },
    {
      title: 'Unix Timestamp Precision Guide',
      href: '/blog/complete-guide-unix-timestamp-precision-2025',
      category: 'Deep Dive',
      readTime: '12 min',
      description:
        'Understand how timestamp precision affects date calculations and age computations.',
    },
  ],
  'binary-converter': [
    {
      title: 'C and C++ Unix Timestamps',
      href: '/knowledge/c-cpp-unix-timestamps',
      category: 'Knowledge Base',
      readTime: '9 min',
      description:
        'Use binary representations of Unix timestamps in C and C++ systems programming.',
    },
    {
      title: 'Unix Timestamp Precision Guide',
      href: '/blog/complete-guide-unix-timestamp-precision-2025',
      category: 'Deep Dive',
      readTime: '12 min',
      description:
        'How binary precision limits affect timestamp storage in 32-bit vs 64-bit systems.',
    },
    {
      title: 'Golang Unix Timestamps',
      href: '/knowledge/golang-unix-timestamps',
      category: 'Knowledge Base',
      readTime: '8 min',
      description:
        'Handle binary timestamp encoding in Go using the time package and binary marshaling.',
    },
  ],
  'hash-calculator': [
    {
      title: 'Webhook Timestamp Security',
      href: '/tutorials/webhook-timestamp-security',
      category: 'Security',
      readTime: '8 min',
      description:
        'Combine HMAC hashing with timestamps to create secure, replay-proof webhook signatures.',
    },
    {
      title: 'Session Management with Timestamp Expiration',
      href: '/blog/session-management-timestamp-expiration',
      category: 'Tutorial',
      readTime: '6 min',
      description: 'Hash session tokens with timestamp components for secure expiration handling.',
    },
    {
      title: 'Rate Limiting with Timestamps',
      href: '/knowledge/rate-limiting-timestamps',
      category: 'Knowledge Base',
      readTime: '7 min',
      description:
        'Use hashed timestamp windows for distributed rate limiting without shared state.',
    },
  ],
  'regex-tester': [
    {
      title: 'Log Timestamp Analysis',
      href: '/knowledge/log-timestamp-analysis',
      category: 'Knowledge Base',
      readTime: '11 min',
      description:
        'Use regex patterns to extract and parse timestamps from complex log file formats.',
    },
    {
      title: 'Unix Timestamp Precision Guide',
      href: '/blog/complete-guide-unix-timestamp-precision-2025',
      category: 'Deep Dive',
      readTime: '12 min',
      description:
        'Validate timestamp formats using regex before parsing to avoid precision errors.',
    },
    {
      title: 'Webhook Timestamp Security',
      href: '/tutorials/webhook-timestamp-security',
      category: 'Security',
      readTime: '8 min',
      description:
        'Parse and validate timestamp signatures in webhook payloads using regex patterns.',
    },
  ],
  'time-calculator': [
    {
      title: 'Calendar Timestamp Components',
      href: '/tutorials/calendar-timestamp-components',
      category: 'Tutorial',
      readTime: '7 min',
      description:
        'Build time calculation UIs using Unix timestamps as the precise underlying data model.',
    },
    {
      title: 'Session Management with Timestamp Expiration',
      href: '/blog/session-management-timestamp-expiration',
      category: 'Tutorial',
      readTime: '6 min',
      description:
        'Calculate time-to-expiry for sessions, tokens, and subscriptions using timestamp math.',
    },
    {
      title: 'Monitoring Timestamp Strategies',
      href: '/tutorials/monitoring-timestamp-strategies',
      category: 'Tutorial',
      readTime: '10 min',
      description:
        'Use time calculations for SLA monitoring, alerting windows, and uptime tracking.',
    },
  ],
}

export const DEFAULT_GUIDES: Guide[] = [
  {
    title: 'Complete Guide to Unix Timestamp Precision in 2026',
    href: '/blog/complete-guide-unix-timestamp-precision-2025',
    category: 'Deep Dive',
    readTime: '12 min',
    description:
      'The definitive guide to Unix timestamp precision, formats, and edge cases in production.',
  },
  {
    title: 'Unix Timestamps in JavaScript',
    href: '/tutorials/javascript-timestamps',
    category: 'Tutorial',
    readTime: '8 min',
    description:
      'Date.now(), the Temporal API, and timezone-aware timestamp handling in JavaScript.',
  },
  {
    title: 'Session Management with Timestamp Expiration',
    href: '/blog/session-management-timestamp-expiration',
    category: 'Tutorial',
    readTime: '6 min',
    description: 'JWT expiration, session timeouts, and token refresh using Unix timestamps.',
  },
]

export function getRelatedGuides(pageKey: string): Guide[] {
  return GUIDES[pageKey] ?? DEFAULT_GUIDES
}
