-- Run anytime after veda_website_schema.sql
create table public.franchise_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  city text not null,
  investment_capacity text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.franchise_enquiries enable row level security;
-- Public insert-only (writes go through service_role via /api/franchise-enquiry,
-- this policy is a safety net if ever called directly from the client)
create policy "franchise_enquiries_insert_only" on public.franchise_enquiries
  for insert with check (true);
