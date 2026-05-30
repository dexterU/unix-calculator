const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const vars = {};
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) vars[key.trim()] = val.join('=').trim();
});
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(vars.UC_SUPABASE_URL, vars.UC_SUPABASE_SERVICE_ROLE_KEY);

const slugs = [
  'docker-container-time-sync',
  'cron-job-scheduling-timestamp-drift',
  'redis-ttl-unix-timestamps',
  'api-timestamp-validation-stale-requests'
];

async function stripFences() {
  for (const slug of slugs) {
    const { data } = await sb.from('blog_posts').select('id, content').eq('slug', slug).single();
    let content = data.content;
    content = content.replace(/```html\n?/g, '');
    content = content.replace(/\n?```$/m, '');
    content = content.replace(/```\n?/g, '');
    const { error } = await sb.from('blog_posts').update({ content }).eq('slug', slug);
    if (error) {
      console.log('ERROR:', slug, error.message);
    } else {
      console.log('DONE:', slug);
    }
  }
}
stripFences();
