# Operations: Coolify + Postgres maintenance

This app can run on Coolify with a self-hosted Supabase stack (for example `https://supabase.darlingmartech.com`). Use this note for **production hygiene** without adding app code paths.

## Scheduled jobs (recommended)

In Coolify, add a **cron** or lightweight **worker** container that runs on a schedule (for example nightly):

1. **Vacuum analyze** (or rely on autovacuum tuning) on `public.cmo_simulation_runs`, `public.simulation_score_breakdowns`, and `public.simulation_events` if write volume grows.
2. **Optional cleanup** of abandoned `in_progress` runs older than N days (define a policy first; do not delete without product agreement).
3. **Reindex** only if monitoring shows bloat (prefer metrics-driven maintenance).

Run SQL with `psql` against the Supabase Postgres service or use Supabase SQL editor if available.

## Database migrations

Apply new files under `supabase/migrations/` in timestamp order on each environment. After deploy, verify RPCs exist, for example:

- `supabase/verification/save_simulation_run_atomic.sql`

## Health checks

Coolify (or a reverse proxy) can call `GET /api/health` on the Next.js app. The handler reports `dependencies.supabaseReachable` and HTTP **503** when Supabase is unreachable from the app runtime.

## Secrets

Keep `SUPABASE_SERVICE_ROLE_KEY` only on the server workload that needs it (sign-up API). Do not inject it into the browser bundle.
