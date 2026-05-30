const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const vars = {};
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) vars[key.trim()] = val.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(vars.UC_SUPABASE_URL, vars.UC_SUPABASE_SERVICE_ROLE_KEY);

const NAMECHEAP_LINK = 'https://namecheap.pxf.io/c/7355916/1632743/5618';

const DISCLOSURE = `<p class="affiliate-disclosure" style="background:#1a2a1a;border-left:3px solid #00ff00;padding:10px 16px;font-size:0.875rem;color:#a8c4a8;margin-bottom:24px;"><strong>Disclosure:</strong> This article contains affiliate links. We may earn a commission at no extra cost to you.</p>`;

// Contextual insertion — unique anchor text per article at the natural moment of need
const ARTICLES = [
  {
    slug: 'docker-container-time-sync',
    // Insert after the opening blockquote, before the first <p> — developer is deploying Docker, needs a domain for their app
    anchor: '<p>You deploy a Node.js service in Docker',
    insertion: `<p>If you're deploying a production service, you'll need a domain pointed at your server. We use and recommend <a href="${NAMECHEAP_LINK}" target="_blank" rel="noopener">Namecheap</a> — straightforward pricing, free WhoisGuard, and reliable DNS management.</p>\n\n`
  },
  {
    slug: 'cron-job-scheduling-timestamp-drift',
    // Insert after opening blockquote — developer is setting up server-side cron jobs, needs infrastructure
    anchor: '<p>Your 2 AM batch job ran at 2:47 AM',
    insertion: `<p>Running cron jobs in production means you need a server with a real domain. We use and recommend <a href="${NAMECHEAP_LINK}" target="_blank" rel="noopener">Namecheap</a> for domain registration — reliable DNS and free WhoisGuard included.</p>\n\n`
  },
  {
    slug: 'redis-ttl-unix-timestamps',
    // Insert after opening blockquote — developer running Redis in production needs infrastructure
    anchor: '<p>Your production cache just took a 40% hit',
    insertion: `<p>Running Redis in production requires a proper domain and DNS setup. We use and recommend <a href="${NAMECHEAP_LINK}" target="_blank" rel="noopener">Namecheap</a> — straightforward pricing with free WhoisGuard and solid DNS management.</p>\n\n`
  },
  {
    slug: 'api-timestamp-validation-stale-requests',
    // Insert after opening blockquote — developer building a production API needs a domain
    anchor: '<p>Your production API just accepted the same payment request twice',
    insertion: `<p>Building a production API means you need a domain your clients can trust. We use and recommend <a href="${NAMECHEAP_LINK}" target="_blank" rel="noopener">Namecheap</a> — reliable DNS, free WhoisGuard, and straightforward pricing.</p>\n\n`
  }
];

// Trailing block we appended previously — remove this exact pattern
const OLD_BLOCK_PATTERN = /\n---\n\n> \*\*Disclosure:\*\*[\s\S]*?namecheap\.pxf\.io[\s\S]*?\n\n$/;

async function fixAffiliateLinks() {
  for (const article of ARTICLES) {
    const { data, error } = await sb
      .from('blog_posts')
      .select('id, title, content')
      .eq('slug', article.slug)
      .single();

    if (error || !data) {
      console.log(`SKIP: ${article.slug} — not found`);
      continue;
    }

    let content = data.content;

    // Step 1 — Remove old appended block
    content = content.replace(OLD_BLOCK_PATTERN, '');

    // Step 2 — Remove any existing disclosure block to avoid duplicates
    content = content.replace(/<p class="affiliate-disclosure"[\s\S]*?<\/p>\n?/, '');

    // Step 3 — Add disclosure at the very top
    content = DISCLOSURE + '\n' + content;

    // Step 4 — Insert contextual link at natural moment
    if (content.includes(article.anchor)) {
      content = content.replace(article.anchor, article.insertion + article.anchor);
      console.log(`LINKED: ${article.slug} — contextual link inserted`);
    } else {
      console.log(`WARN: ${article.slug} — anchor not found, disclosure added but no contextual link`);
    }

    // Step 5 — Update Supabase
    const { error: updateError } = await sb
      .from('blog_posts')
      .update({ content })
      .eq('slug', article.slug);

    if (updateError) {
      console.log(`ERROR: ${article.slug} — ${updateError.message}`);
    } else {
      console.log(`DONE: ${article.slug} — "${data.title}"`);
    }
  }

  // Step 6 — Fix the broken session article separately
  console.log('\nChecking session-management-timestamp-expiration...');
  const { data: session } = await sb
    .from('blog_posts')
    .select('id, title, content')
    .eq('slug', 'session-management-timestamp-expiration')
    .single();

  if (session) {
    console.log(`WARN: session-management-timestamp-expiration starts with "${session.content.substring(0, 60)}" — needs real content, skipping affiliate insertion`);
  }

  console.log('\nFinished.');
}

fixAffiliateLinks();
