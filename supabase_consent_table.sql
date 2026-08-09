-- Run anytime after veda_website_schema.sql
-- DPDP Act 2023 — consent records (Module 01: timestamp, version, purpose, IP/device required)

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  -- Consent can predate account creation (e.g. cookie banner for anonymous visitors),
  -- so user_id is nullable and guest_session_id covers that case.
  guest_session_id text,
  purpose text not null, -- 'account_creation' | 'marketing_emails' | 'analytics_cookies' | 'functional_cookies'
  granted boolean not null,
  policy_version text not null, -- e.g. '2026-08-09' — matches Privacy Policy "lastUpdated"
  purpose_text_shown text not null, -- exact copy shown to the user at the time — required by DPDP for evidentiary record
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index consent_records_user_id_idx on public.consent_records(user_id);
create index consent_records_guest_session_idx on public.consent_records(guest_session_id);

alter table public.consent_records enable row level security;

-- Users can read their own consent history (Right to Information — Module 04.1)
create policy "consent_records_select_own" on public.consent_records
  for select using (auth.uid() = user_id);

-- Inserts go through the server (service_role via /api routes) so IP/user-agent
-- can be captured server-side reliably — no public insert policy needed.

-- Withdrawal is modeled as a new row with granted = false, not a delete or update,
-- so the consent history itself remains an immutable audit trail.
