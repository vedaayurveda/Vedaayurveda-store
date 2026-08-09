-- Run anytime after veda_website_schema.sql
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
create policy "contact_messages_insert_only" on public.contact_messages
  for insert with check (true);
