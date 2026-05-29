create table if not exists public.api_keys (
  id uuid default gen_random_uuid() primary key,
  user_email text not null unique,
  api_key text not null unique
    default 'uc_' || replace(gen_random_uuid()::text, '-', ''),
  plan text not null default 'free'
    check (plan in ('free', 'developer', 'pro', 'enterprise')),
  requests_today integer default 0,
  requests_reset_at timestamptz default now() + interval '24 hours',
  stripe_customer_id text,
  stripe_subscription_id text,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.api_keys enable row level security;

create policy "Service role full access"
  on public.api_keys
  for all
  using (auth.role() = 'service_role');

create index if not exists api_keys_key_idx on public.api_keys(api_key);
create index if not exists api_keys_email_idx on public.api_keys(user_email);
