import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase service configuration')
  }
  return createClient(url, key)
}

function createZohoTransport() {
  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL!,
      pass: process.env.ZOHO_PASSWORD!,
    },
  })
}

const WELCOME_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Courier New', monospace; background: #0d1117; color: #e6edf3; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .logo { color: #00ff41; font-size: 20px; font-weight: bold; margin-bottom: 32px; }
    .heading { font-size: 24px; font-weight: bold; color: #ffffff; margin-bottom: 16px; }
    .body-text { color: #8b949e; line-height: 1.6; margin-bottom: 24px; }
    .code-block { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .code-line { color: #00ff41; font-size: 13px; line-height: 2; }
    .comment { color: #8b949e; }
    .btn { display: inline-block; background: #00ff41; color: #0d1117; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; margin: 16px 0; }
    .footer { border-top: 1px solid #30363d; margin-top: 40px; padding-top: 20px; color: #8b949e; font-size: 12px; }
    .cheatsheet-title { color: #58a6ff; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">>_ Unix Calculator</div>
    <div class="heading">Your Unix Timestamp Cheatsheet</div>
    <p class="body-text">
      Here's your quick reference for the most common timestamp 
      operations. Bookmark this — you'll use it more than you think.
    </p>

    <div class="code-block">
      <div class="cheatsheet-title">// JavaScript</div>
      <div class="code-line">Date.now() / 1000<span class="comment">          // current Unix seconds</span></div>
      <div class="code-line">new Date(ts * 1000)<span class="comment">         // seconds → Date</span></div>
      <div class="code-line">new Date(ts).toISOString()<span class="comment">  // ms → ISO 8601</span></div>
      <div class="code-line">Math.floor(Date.now()/1000)<span class="comment"> // safe integer ts</span></div>
    </div>

    <div class="code-block">
      <div class="cheatsheet-title">// Python</div>
      <div class="code-line">time.time()<span class="comment">                 // current Unix seconds</span></div>
      <div class="code-line">datetime.fromtimestamp(ts)<span class="comment">  // ts → datetime (local)</span></div>
      <div class="code-line">datetime.utcfromtimestamp(ts)<span class="comment">// ts → datetime (UTC)</span></div>
      <div class="code-line">int(dt.timestamp())<span class="comment">         // datetime → Unix ts</span></div>
    </div>

    <div class="code-block">
      <div class="cheatsheet-title">// Go</div>
      <div class="code-line">time.Now().Unix()<span class="comment">           // current Unix seconds</span></div>
      <div class="code-line">time.Now().UnixMilli()<span class="comment">      // current Unix ms</span></div>
      <div class="code-line">time.Unix(ts, 0)<span class="comment">            // seconds → Time</span></div>
      <div class="code-line">t.Format(time.RFC3339)<span class="comment">      // → ISO 8601</span></div>
    </div>

    <div class="code-block">
      <div class="cheatsheet-title">// Digit Count Reference</div>
      <div class="code-line">10 digits<span class="comment"> → seconds     (1733529600)</span></div>
      <div class="code-line">13 digits<span class="comment"> → milliseconds (1733529600000)</span></div>
      <div class="code-line">16 digits<span class="comment"> → microseconds (1733529600000000)</span></div>
      <div class="code-line">19 digits<span class="comment"> → nanoseconds  (1733529600000000000)</span></div>
    </div>

    <div class="code-block">
      <div class="cheatsheet-title">// Common Mistakes</div>
      <div class="code-line"><span class="comment">// ✗ passes seconds to ms function — date shows 1970</span></div>
      <div class="code-line">new Date(1733529600)</div>
      <div class="code-line"><span class="comment">// ✓ correct</span></div>
      <div class="code-line">new Date(1733529600 * 1000)</div>
      <div class="code-line">&nbsp;</div>
      <div class="code-line"><span class="comment">// ✗ month 12 = overflow (JS months 0-indexed)</span></div>
      <div class="code-line">new Date(2024, 12, 1)</div>
      <div class="code-line"><span class="comment">// ✓ December = 11</span></div>
      <div class="code-line">new Date(2024, 11, 1)</div>
    </div>

    <a href="https://unixcalculator.com/tools/timestamp-debugger" class="btn">
      Open Timestamp Debugger →
    </a>

    <div class="footer">
      <p>You signed up at unixcalculator.com</p>
      <p>Built for developers, by developers.</p>
    </div>
  </div>
</body>
</html>
`

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const supabase = getServiceSupabase()
    const normalized = email.toLowerCase().trim()

    // Store in Supabase
    const { error: dbError } = await supabase.from('newsletter_subscribers').insert({
      email: normalized,
      source: source || 'unknown',
    })

    if (dbError) {
      if (dbError.code === '23505') {
        // Duplicate — treat as success silently
        return NextResponse.json({ success: true, existing: true })
      }
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    // Send welcome email via Zoho SMTP
    try {
      const transporter = createZohoTransport()
      await transporter.sendMail({
        from: `"Unix Calculator" <${process.env.ZOHO_EMAIL}>`,
        to: normalized,
        subject: 'Your Unix Timestamp Cheatsheet',
        html: WELCOME_HTML,
      })
    } catch (emailErr) {
      // Email failed but subscriber is saved — don't fail the request
      console.error('Email send error:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
