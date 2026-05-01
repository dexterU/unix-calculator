'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'

export default function SessionManagementTimestampsClient() {
  return (
    <ArticlePageShell>
      <article>
        <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-terminal-green">
            Home
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <Link href="/blog" className="hover:text-terminal-green">
            Blog
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">Session management</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Blog · Security</p>
        <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="rounded border border-terminal-border px-2 py-0.5 text-terminal-green">Tutorial</span>
          <span>8 min read</span>
          <span>·</span>
          <span>Unix Calculator Editorial Team</span>
          <span>·</span>
          <span>Apr 18, 2026</span>
        </div>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Session Management with Timestamp Expiration
        </h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Store session expiry as a Unix timestamp (UTC
          seconds or milliseconds — pick one and document it). On each request, compare trusted server time to that
          value: if <code className="font-mono text-terminal-cyan">Math.floor(Date.now()/1000) &gt; exp</code> the
          session is expired. Always evaluate expiry using <strong className="text-foreground">server-side clocks</strong>{' '}
          synchronized with NTP; never trust the browser for security decisions.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          Why Timestamps Are the Right Tool for Session Expiry
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          A session expiry is an <em>instant</em> on the timeline, not a wall-clock label in Chicago. Unix timestamps
          move that instant into a single integer comparable across regions, languages, and storage engines. The
          arithmetic is trivial: <code className="font-mono text-terminal-cyan">exp = issued + ttl</code>. Compare to
          storing &quot;expires Thursday 5pm&quot; — you immediately inherit timezone, DST, and parsing bugs. Tokens
          and server-side session rows both benefit from the same representation; the only variation is whether your
          framework stores seconds (JWT NumericDate) or milliseconds (some cookie jars).
        </p>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          For distributed systems, timestamps let you reason about skew budgets. If two app nodes disagree by 200ms, a
          seconds-resolution expiry still behaves predictably; millisecond-sensitive policies need tighter infrastructure
          discipline. Document the maximum acceptable skew for your product and test failover scenarios where a node
          cold-starts with an unset clock — validation libraries should fail closed when wall time is unreasonable,
          rather than trusting the first packet seen.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">
          JWT Expiration with Unix Timestamps
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          JSON Web Tokens carry <code className="font-mono text-terminal-cyan">iat</code>,{' '}
          <code className="font-mono text-terminal-cyan">nbf</code>, and{' '}
          <code className="font-mono text-terminal-cyan">exp</code> as NumericDate values: seconds since 1970-01-01T00:00:00Z.
          Libraries perform the compare after signature verification — do not parse claims from unsigned tokens.
        </p>
        <pre className="mb-4 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: 123, role: 'user' },
  process.env.JWT_SECRET,
  { expiresIn: 3600 }
);

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded.exp);
} catch (err) {
  if (err instanceof jwt.TokenExpiredError) {
    /* redirect to login */
  }
}`}
        </pre>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`import jwt
import time

payload = {
    'user_id': 123,
    'exp': int(time.time()) + 3600,
    'iat': int(time.time()),
}
token = jwt.encode(payload, secret, algorithm='HS256')

try:
    data = jwt.decode(token, secret, algorithms=['HS256'])
except jwt.ExpiredSignatureError:
    pass`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Sliding Window Sessions</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Sliding windows extend idle allowance on each authenticated request. Implement by bumping a server-side{' '}
          <code className="font-mono text-terminal-cyan">expires_at</code> using the same formula each time:{' '}
          <code className="font-mono text-terminal-cyan">now + idle_budget</code>. Redis provides atomic{' '}
          <code className="font-mono text-terminal-cyan">EXPIRE</code>/<code className="font-mono text-terminal-cyan">EXPIREAT</code>{' '}
          so your TTL tracks the computed wall instant.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`async function touchSession(sessionId, ttl = 3600) {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + ttl;
  await redis.hSet(\`session:\${sessionId}\`, {
    last_active: String(now),
    expires_at: String(expiry),
  });
  await redis.expireAt(\`session:\${sessionId}\`, expiry);
  return expiry;
}

async function isSessionValid(sessionId) {
  const session = await redis.hGetAll(\`session:\${sessionId}\`);
  if (!session.expires_at) return false;
  return parseInt(session.expires_at, 10) > Math.floor(Date.now() / 1000);
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Common Timestamp Session Bugs</h2>
        <div className="mb-6 overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-surface font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Bug</th>
                <th className="px-3 py-2">Cause</th>
                <th className="px-3 py-2">Fix</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Clock skew', 'Nodes disagree on "now"', 'NTP + compare only trusted gateway time'],
                ['Timezone strings', 'Local SQL inserted into UTC columns', 'Normalize to UTC before persist'],
                ['32-bit wrap', 'Legacy INT exp in DB', 'BIGINT seconds or native timestamptz'],
                ['Race on extend', 'Two requests update session row', 'Atomic Redis scripts or CAS row updates'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-terminal-border/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Token Refresh Pattern</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Pair a short-lived access token (minutes) with a refresh token (days) stored hashed server-side. Each refresh
          rotation should mint a new refresh identifier and invalidate the old one; reuse of a retired refresh indicates
          theft. Encode only opaque IDs in cookies — not PII — and bind refresh tokens to device keys when possible.
        </p>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`// Pseudocode: rotation with explicit exp claims
function issueTokens(userId) {
  const now = Math.floor(Date.now() / 1000);
  const access = signJwt({ sub: userId, typ: 'access', exp: now + 900 }, SECRET);
  const refresh = randomBytes(32).toString('hex');
  storeRefreshHash(userId, hash(refresh), now + 60 * 60 * 24 * 30);
  return { access, refresh };
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Use integers for expiry; seconds for JWT, ms only if every layer agrees.</li>
          <li>Verify signatures before interpreting time claims.</li>
          <li>Sliding sessions belong in data stores with atomic TTL updates.</li>
          <li>Refresh token reuse detection is mandatory for rotation schemes.</li>
          <li>Test leap-second and DST days even though epoch math is UTC-first.</li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Senior Unix/Linux
            Engineers. Last verified May 2026.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/tools/timestamp-converter" className="text-terminal-green underline hover:no-underline">
            Unix timestamp converter
          </Link>
        </p>
      </article>
    </ArticlePageShell>
  )
}
