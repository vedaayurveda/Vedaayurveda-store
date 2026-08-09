-- Run anytime after veda_website_schema.sql
create table public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;
-- Public insert-only (writes go through service_role via /api/newsletter anyway,
-- but this keeps things safe if ever called from the client directly)
create policy "newsletter_insert_only" on public.newsletter_signups
  for insert with check (true);
