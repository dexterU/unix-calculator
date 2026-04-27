/** Shared FAQ / HowTo copy for JSON-LD + homepage accordion (single source). */

export type HomepageFaqBlock = { type: 'p' | 'code'; text: string }

export type HomepageFaqItem = {
  question: string
  /** Plain text for schema.org (no HTML) */
  answerPlain: string
  blocks: HomepageFaqBlock[]
}

export const HOMEPAGE_FAQ: HomepageFaqItem[] = [
  {
    question: 'What is a Unix timestamp and how does it work?',
    answerPlain:
      'A Unix timestamp counts seconds since the Unix epoch: January 1, 1970 00:00:00 UTC. It is timezone-agnostic at storage time; local display depends on your timezone. Systems often store epoch seconds (10 digits) or milliseconds (13 digits).',
    blocks: [
      {
        type: 'p',
        text: 'A Unix timestamp counts seconds since the Unix epoch: January 1, 1970 00:00:00 UTC. It is timezone-agnostic at storage time; local display depends on your timezone.',
      },
      {
        type: 'p',
        text: 'Systems often store epoch seconds (10 digits) or milliseconds (13 digits). Our converter auto-detects common scales.',
      },
      {
        type: 'code',
        text: '// Epoch start (UTC)\nnew Date(0).toISOString() // 1970-01-01T00:00:00.000Z',
      },
    ],
  },
  {
    question: 'How do I convert a Unix timestamp to a human-readable date?',
    answerPlain:
      'Divide milliseconds by 1000 to get seconds if needed, then multiply by 1000 for JavaScript Date. On Linux use date -d @SECONDS. Our tool formats ISO 8601, RFC 822, and locale strings in one click.',
    blocks: [
      {
        type: 'p',
        text: 'If your value has 13 digits, it is usually milliseconds—divide by 1,000 first to get seconds. In JavaScript, pass milliseconds to Date.',
      },
      {
        type: 'code',
        text: 'const d = new Date(seconds * 1000);\nd.toISOString();',
      },
      {
        type: 'p',
        text: 'On GNU/Linux: date -d @1700000000. This site runs in your browser—no server upload.',
      },
    ],
  },
  {
    question: 'What is the difference between Unix seconds and milliseconds?',
    answerPlain:
      'Unix seconds are whole seconds since 1970-01-01 UTC. Milliseconds are 1/1000 of a second; multiply seconds by 1000 to compare with JavaScript Date.now(). Microseconds are 1e-6 s; divide by 1e6 for seconds.',
    blocks: [
      {
        type: 'p',
        text: 'Seconds since epoch are typically 10 digits through year 2286. Millisecond timestamps are often 13 digits (e.g. from Date.now()).',
      },
      {
        type: 'code',
        text: 'const ms = unixSeconds * 1000;\nconst s = unixMs / 1000;',
      },
      {
        type: 'p',
        text: 'Microseconds (16+ digit integers) divide by 1,000,000 to reach seconds before converting.',
      },
    ],
  },
  {
    question: 'What is the maximum Unix timestamp value?',
    answerPlain:
      'In 32-bit signed integers the classic limit is 2,147,483,647 seconds (2038-01-19 UTC). JavaScript and 64-bit systems support far larger ranges; practical limits depend on your language and storage type.',
    blocks: [
      {
        type: 'p',
        text: 'The Year 2038 problem applies to signed 32-bit time_t: maximum 2,147,483,647 seconds after 1970-01-01 UTC.',
      },
      {
        type: 'p',
        text: 'JavaScript Date and 64-bit epoch values avoid that ceiling for realistic dates. Always use 64-bit or string dates in new systems.',
      },
      {
        type: 'code',
        text: 'console.log(new Date(2147483647000).toISOString());',
      },
    ],
  },
  {
    question: 'How do I get the current Unix timestamp?',
    answerPlain:
      'In JavaScript use Math.floor(Date.now()/1000) for seconds. In bash use date +%s. This page shows a live epoch counter in the navigation bar.',
    blocks: [
      {
        type: 'p',
        text: 'JavaScript seconds: Math.floor(Date.now() / 1000). Milliseconds: Date.now().',
      },
      {
        type: 'code',
        text: 'node -e "console.log(Math.floor(Date.now()/1000))"\ndate +%s   # GNU/BSD',
      },
      {
        type: 'p',
        text: 'The sticky header on this page updates every second for quick reference.',
      },
    ],
  },
  {
    question: 'Does this converter handle timezones and daylight saving time?',
    answerPlain:
      'Yes. We use IANA zones (e.g. America/New_York) via Intl, which applies current DST rules. Political zone changes can still shift historical interpretations—verify critical legal times against authoritative sources.',
    blocks: [
      {
        type: 'p',
        text: 'Timezone selects map to IANA identifiers. The browser formats using the IANA database, including DST transitions.',
      },
      {
        type: 'code',
        text: "new Date(ts * 1000).toLocaleString('en-US', { timeZone: 'America/New_York' })",
      },
      {
        type: 'p',
        text: 'For leap seconds and pre-1970 history, storage as epoch seconds may differ across libraries; we document POSIX-oriented behavior.',
      },
    ],
  },
]

export const HOMEPAGE_HOWTO_STEPS = [
  {
    name: 'Enter Your Timestamp',
    text: 'Paste a numeric value. We auto-detect seconds, milliseconds, or microseconds when format is set to Auto.',
  },
  {
    name: 'Select Timezone',
    text: 'Choose UTC, EST, PST, CST, GMT, CET, IST, JST, or AEST. DST is applied using the IANA database for that zone.',
  },
  {
    name: 'Click Convert',
    text: 'We compute ISO 8601, RFC 822, human-readable strings, milliseconds, and Unix seconds together.',
  },
  {
    name: 'Copy Any Format',
    text: 'Use the copy buttons beside each result row. Confirmation shows a checkmark for 1.5 seconds.',
  },
] as const

export function buildFaqPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answerPlain,
      },
    })),
  }
}

export function buildHowToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Convert a Unix Timestamp',
    description:
      'Convert a Unix epoch value to human-readable dates in multiple formats using this browser-based tool.',
    step: HOMEPAGE_HOWTO_STEPS.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}
