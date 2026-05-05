-- Migration: create_personalized_simulation_intelligence_v1
-- Additive schema for profile memory, simulation milestones, and score breakdown persistence.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text null,
  company_name text null,
  role text null,
  marketing_maturity text null,
  selected_goals jsonb not null default '[]'::jsonb,
  onboarding_answers jsonb not null default '{}'::jsonb,
  preferred_difficulty text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_profiles_email on public.user_profiles (email);

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.set_updated_at();

alter table public.user_profiles enable row level security;

drop policy if exists "user_profiles_select_own" on public.user_profiles;
drop policy if exists "user_profiles_insert_own" on public.user_profiles;
drop policy if exists "user_profiles_update_own" on public.user_profiles;

create policy "user_profiles_select_own"
  on public.user_profiles
  for select
  to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

create policy "user_profiles_insert_own"
  on public.user_profiles
  for insert
  to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "user_profiles_update_own"
  on public.user_profiles
  for update
  to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

create table if not exists public.simulation_events (
  event_id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.cmo_simulation_runs(run_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  phase text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_simulation_events_user_created
  on public.simulation_events (user_id, created_at desc);

create index if not exists idx_simulation_events_run_created
  on public.simulation_events (run_id, created_at desc);

create index if not exists idx_simulation_events_type
  on public.simulation_events (event_type);

alter table public.simulation_events enable row level security;

drop policy if exists "simulation_events_select_own" on public.simulation_events;
drop policy if exists "simulation_events_insert_own" on public.simulation_events;

create policy "simulation_events_select_own"
  on public.simulation_events
  for select
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = user_id
    and exists (
      select 1
      from public.cmo_simulation_runs r
      where r.run_id = simulation_events.run_id
        and r.user_id = auth.uid()
    )
  );

create policy "simulation_events_insert_own"
  on public.simulation_events
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and auth.uid() = user_id
    and exists (
      select 1
      from public.cmo_simulation_runs r
      where r.run_id = simulation_events.run_id
        and r.user_id = auth.uid()
    )
  );

create table if not exists public.simulation_score_breakdowns (
  breakdown_id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.cmo_simulation_runs(run_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  phase text not null,
  category text not null,
  score numeric not null,
  max_score numeric not null default 100,
  insight text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists uq_simulation_score_breakdowns_run_phase_category
  on public.simulation_score_breakdowns (run_id, phase, category);

create index if not exists idx_simulation_score_breakdowns_user_created
  on public.simulation_score_breakdowns (user_id, created_at desc);

create index if not exists idx_simulation_score_breakdowns_run_created
  on public.simulation_score_breakdowns (run_id, created_at desc);

alter table public.simulation_score_breakdowns enable row level security;

drop policy if exists "simulation_score_breakdowns_select_own" on public.simulation_score_breakdowns;
drop policy if exists "simulation_score_breakdowns_insert_own" on public.simulation_score_breakdowns;
drop policy if exists "simulation_score_breakdowns_update_own" on public.simulation_score_breakdowns;

create policy "simulation_score_breakdowns_select_own"
  on public.simulation_score_breakdowns
  for select
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = user_id
    and exists (
      select 1
      from public.cmo_simulation_runs r
      where r.run_id = simulation_score_breakdowns.run_id
        and r.user_id = auth.uid()
    )
  );

create policy "simulation_score_breakdowns_insert_own"
  on public.simulation_score_breakdowns
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and auth.uid() = user_id
    and exists (
      select 1
      from public.cmo_simulation_runs r
      where r.run_id = simulation_score_breakdowns.run_id
        and r.user_id = auth.uid()
    )
  );

create policy "simulation_score_breakdowns_update_own"
  on public.simulation_score_breakdowns
  for update
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = user_id
    and exists (
      select 1
      from public.cmo_simulation_runs r
      where r.run_id = simulation_score_breakdowns.run_id
        and r.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() is not null
    and auth.uid() = user_id
    and exists (
      select 1
      from public.cmo_simulation_runs r
      where r.run_id = simulation_score_breakdowns.run_id
        and r.user_id = auth.uid()
    )
  );
