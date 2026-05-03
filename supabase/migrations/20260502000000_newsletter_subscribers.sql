create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text not null default 'unknown',
  created_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Only service role can read/write (no public access)
create policy "Service role full access"
  on public.newsletter_subscribers
  using (auth.role() = 'service_role');
