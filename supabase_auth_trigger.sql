-- ============================================================
-- Run this AFTER veda_website_schema.sql
-- Auto-creates a public.profiles row whenever a new auth.users
-- row is created — covers email signup, phone OTP signup, and
-- any future OAuth provider.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email / profiles.phone in sync if user updates them via Supabase Auth
create or replace function public.handle_user_update()
returns trigger as $$
begin
  update public.profiles
  set email = new.email,
      phone = new.phone,
      updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_updated
  after update of email, phone on auth.users
  for each row execute function public.handle_user_update();
