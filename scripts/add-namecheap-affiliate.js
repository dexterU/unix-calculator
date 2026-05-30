const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load .env manually
const env = fs.readFileSync('.env', 'utf8');
const vars = {};
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) vars[key.trim()] = val.join('=').trim();
});

const sb = createClient(vars.UC_SUPABASE_URL, vars.UC_SUPABASE_SERVICE_ROLE_KEY);

const NAMECHEAP_LINK = 'https://namecheap.pxf.io/c/7355916/1632743/5618';

const AFFILIATE_BLOCK = `

---

> **Disclosure:** This article contains affiliate links. If you purchase through them, we may earn a commission at no extra cost to you.

**Need a domain for your project?** We recommend [Namecheap](${NAMECHEAP_LINK}) — reliable DNS, free WhoisGuard, and straightforward pricing. It's what we use for our own projects.

`;

const TARGET_SLUGS = [
  'docker-container-time-sync',
  'cron-job-scheduling-timestamp-drift',
  'session-management-timestamp-expiration',
  'redis-ttl-unix-timestamps',
  'api-timestamp-validation-stale-requests'
];

async function addAffiliateLinks() {
  for (const slug of TARGET_SLUGS) {
    const { data, error } = await sb
      .from('blog_posts')
      .select('id, title, content')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.log(`SKIP: ${slug} — not found`);
      continue;
    }

    // Don't double-insert
    if (data.content.includes('namecheap.pxf.io')) {
      console.log(`SKIP: ${slug} — affiliate link already present`);
      continue;
    }

    const updatedContent = data.content.trimEnd() + AFFILIATE_BLOCK;

    const { error: updateError } = await sb
      .from('blog_posts')
      .update({ content: updatedContent })
      .eq('slug', slug);

    if (updateError) {
      console.log(`ERROR: ${slug} — ${updateError.message}`);
    } else {
      console.log(`DONE: ${slug} — "${data.title}"`);
    }
  }
  console.log('\nFinished.');
}

addAffiliateLinks();
