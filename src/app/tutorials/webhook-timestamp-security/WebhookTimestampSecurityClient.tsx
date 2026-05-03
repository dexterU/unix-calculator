'use client'

import Link from 'next/link'
import { ArticlePageShell } from '@/components/ArticlePageShell'
import { NewsletterCapture } from '@/components/NewsletterCapture'

export default function WebhookTimestampSecurityClient() {
  return (
    <ArticlePageShell>
      <article>
        <nav className="mb-6 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-terminal-green">
            Home
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <Link href="/tutorials" className="hover:text-terminal-green">
            Tutorials
          </Link>
          <span className="mx-2 text-terminal-border">›</span>
          <span className="text-foreground/90">Webhook security</span>
        </nav>

        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-terminal-green">Tutorial · Security</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Webhook timestamp security</h1>

        <div className="mb-10 border-l-4 border-terminal-green bg-terminal-surface/80 py-4 pl-4 pr-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Quick answer:</strong> Always verify an HMAC signature over a payload that
          includes a server-issued timestamp header. Reject events when{' '}
          <code className="font-mono text-terminal-cyan">abs(serverNow - headerTs) &gt; tolerance</code> — Stripe&apos;s
          documented pattern uses roughly five minutes. Larger windows increase replay risk; tighter windows break under
          VM suspend or mobile network delays unless you document clock sync requirements.
        </div>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Replay attacks</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          An attacker who captures a valid signed webhook can replay it until the signature scheme or timestamp expires.
          Signing only the body without time lets replays live forever. Include the timestamp in the signed bytes (e.g.
          <code className="font-mono text-terminal-cyan">t.payload</code> concatenation) so tampering one field invalidates the MAC.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Five-minute tolerance</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Cloud load balancers may buffer requests; use server time from NTP-synced nodes. Mobile gateways sometimes batch
          deliveries — measure real skew from partners before tightening tolerances below 60s.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Express middleware example</h2>
        <pre className="mb-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm text-terminal-cyan">
          {`import express from 'express';
import crypto from 'crypto';

const TOLERANCE_SEC = 300;

function verifyWebhook(req, res, next) {
  const sig = req.header('X-Signature');
  const ts = req.header('X-Timestamp');
  const body = req.rawBody; // capture in json verify middleware
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(ts)) > TOLERANCE_SEC) {
    return res.status(400).send('stale timestamp');
  }
  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
  hmac.update(\`\${ts}.\${body}\`);
  const expected = hmac.digest('hex');
  const ok = crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  if (!ok) return res.status(401).send('bad signature');
  return next();
}`}
        </pre>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Testing and skew</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Unit tests should freeze time with libraries like Sinon or move clock manually. Integration tests must send
          headers slightly in the past within tolerance. When skew exceeds tolerance, return a distinct error code so ops
          can distinguish bad clocks from bad secrets without leaking internals to attackers.
        </p>

        <h2 className="mb-3 mt-10 font-mono text-xl font-semibold text-terminal-green">Key takeaways</h2>
        <ul className="mb-10 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Timestamp + signature + constant-time compare — missing any piece fails the model.</li>
          <li>Persist processed event ids with TTL &gt; tolerance to drop duplicates.</li>
          <li>Rotate shared secrets periodically; dual-sign during migration if feasible.</li>
          <li>Document partner clock requirements in onboarding PDFs.</li>
          <li>See also{' '}
            <Link href="/blog/session-management-timestamp-expiration" className="text-terminal-green underline">
              session timestamps
            </Link>{' '}
            for related auth math.
          </li>
        </ul>

        <div className="rounded-lg border border-terminal-border bg-terminal-surface/60 p-5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Written by Unix Calculator Editorial Team</strong> — Last verified May
            2026.
          </p>
        </div>

        <NewsletterCapture source="tutorial-webhook" />
      </article>
    </ArticlePageShell>
  )
}
