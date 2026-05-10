# CMO Simulator: Coolify deployment and Supabase schema

This document describes how the **CMO Simulator** application connects to **Supabase** (Postgres + Auth + Row Level Security), how that fits with **Coolify** (or any host that injects env vars and reverse-proxies services), and the **exact tables, indexes, triggers, policies, and RPC** used by the simulator feature set.

For day-to-day ops (vacuum, health checks, secrets hygiene), see [`operations-coolify.md`](./operations-coolify.md).

---

## 1. Architecture at a glance

| Layer | Role |
|-------|------|
| **Next.js app** | UI, API routes under `/api/*`, Supabase clients (`@supabase/ssr`, `@supabase/supabase-js`). |
| **Supabase API** | PostgREST exposes `public.*` tables to the anon/authenticated JWT; Auth issues sessions; Postgres enforces **RLS**. |
| **PostgreSQL** | Source of truth for runs, profile memory, analytics events, and denormalized score rows. |
| **Coolify** | Typically hosts the Next.js service **and/or** a **self-hosted Supabase stack** (Kong, GoTrue, PostgREST, Postgres, etc.). Env vars on the Next.js resource point at the Supabase URL and keys. |

The app does **not** embed Coolify-specific SDKs. “Coolify setup” means: deploy the app, wire env vars, deploy Supabase (managed or self-hosted), apply migrations, configure Auth redirects / GoTrue env on self-hosted stacks.

---

## 2. Environment variables (Next.js)

Defined in [`.env.example`](../.env.example) and validated in [`src/lib/env.ts`](../src/lib/env.ts).

### 2.1 Required (browser-safe)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (e.g. `https://xxxxx.supabase.co` or self-hosted `https://supabase.example.com`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon** JWT; used by browser and server with user session. Must **not** bypass RLS. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for auth links (password reset, redirects). |

Self-hosted note: paste the **literal** anon JWT string into Coolify—Next.js does not resolve `${SERVICE_*}` placeholders unless that variable is also defined in the same env block.

### 2.2 Server-only (optional but used for specific features)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | **Service role** JWT—bypasses RLS. Used only in server code such as [`src/lib/supabase/admin.ts`](../src/lib/supabase/admin.ts) (e.g. sign-up API when pairing with Resend). **Never** expose to the client bundle. |

### 2.3 Self-hosted Supabase Auth (GoTrue)

When Studio does not expose “Authentication → URL Configuration”, redirects are driven by **environment variables** on the auth (GoTrue) service. Typical patterns (confirm names against your stack’s compose):

- `GOTRUE_SITE_URL` — production app origin.
- `GOTRUE_URI_ALLOW_LIST` — comma-separated allow list including local and prod callback URLs (e.g. `http://localhost:3002/**`, `https://your-app.example.com/**`).

See comments in `.env.example` and [Supabase self-hosted Auth config](https://supabase.com/docs/guides/self-hosting/auth/config).

---

## 3. Supabase client usage in the app

| File | Role |
|------|------|
| [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts) | Browser client (`createBrowserClient`). |
| [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts) | Server client with cookies (Server Components / Route Handlers). |
| [`src/lib/supabase/middleware.ts`](../src/lib/supabase/middleware.ts) | Refreshes session on matched routes. |
| [`src/lib/supabase/admin.ts`](../src/lib/supabase/admin.ts) | Service-role client (server-only). |

[`src/middleware.ts`](../src/middleware.ts) calls `updateSession` for paths under `/sim`, `/api/simulations`, `/api/profile`, `/api/simulation-events`, and redirects unauthenticated users to `/auth/sign-in`.

---

## 4. Applying database migrations

Authoritative SQL lives in [`supabase/migrations/`](../supabase/migrations/). Apply files **in filename (timestamp) order** on each environment (Supabase SQL Editor, `supabase db push`, or `psql` against the Postgres instance behind Coolify).

**Recommended order (as of this repo):**

1. `20260502_create_cmo_simulation_runs.sql` — core runs table, `set_updated_at()`, initial RLS.
2. `20260505_create_personalized_simulation_intelligence_v1.sql` — `user_profiles`, `simulation_events`, `simulation_score_breakdowns`, RLS, `pgcrypto`.
3. `20260510_save_simulation_run_atomic.sql` — RPC `save_simulation_run_atomic`.
4. `20260511_cmo_simulation_rls_to_authenticated.sql` — tighten `cmo_simulation_runs` policies to `TO authenticated`.
5. `20260512_simulation_score_breakdowns_delete_policy.sql` — **DELETE** policy on `simulation_score_breakdowns` (required for atomic save replay).

Verification snippets (optional): [`supabase/verification/`](../supabase/verification/).

**Legacy:** Root-level `supabase-schema-enhanced.sql` and `setup-database.md` describe an older, broader schema. The **live** app expects the migrations above plus `user_profiles` for [`/api/profile`](../src/app/api/profile/route.ts). Do not mix incompatible legacy `cmo_simulation_runs` shapes (see comment in `20260502` migration).

---

## 5. PostgreSQL extensions

| Extension | Introduced in | Purpose |
|-----------|---------------|---------|
| `pgcrypto` | `20260505_create_personalized_simulation_intelligence_v1.sql` | `gen_random_uuid()` defaults (and general crypto helpers). |

---

## 6. Functions

### 6.1 `public.set_updated_at()`

- **Language:** `plpgsql`
- **Behavior:** `BEFORE UPDATE` trigger sets `NEW.updated_at = now()`.
- **Used on:** `cmo_simulation_runs`, `user_profiles` (replaced/recreated idempotently across migrations).

### 6.2 `public.save_simulation_run_atomic(p_run jsonb, p_breakdowns jsonb)`

- **Returns:** `jsonb`, e.g. `{"ok": true, "run_id": "<uuid>"}` or `{"ok": false, "error": "unauthorized"|"invalid_input"|"forbidden"}`.
- **Security:** `SECURITY INVOKER` — runs as the **authenticated user**; RLS applies to `INSERT`/`UPDATE`/`DELETE`/`SELECT` inside the function.
- **Behavior (summary):**
  1. Requires `auth.uid()` non-null and equal to `p_run->>'user_id'`.
  2. **Upserts** one row into `cmo_simulation_runs` keyed by `run_id` (`ON CONFLICT (run_id) DO UPDATE`). The Next.js save route supplies `overall_score`, `grade`, and `debrief` in `p_run` **after** recomputing them server-side from `context` (RPC itself still persists whatever keys are present in `p_run`).
  3. **Deletes** all `simulation_score_breakdowns` rows for that `run_id`.
  4. **Inserts** breakdown rows from `p_breakdowns` (JSON array of objects).
- **Grants:** `REVOKE ALL … FROM PUBLIC`; `GRANT EXECUTE … TO authenticated`.

Defined in `20260510_save_simulation_run_atomic.sql`.

---

## 7. Tables (column-level reference)

All application tables live in schema **`public`**. Foreign keys to **`auth.users`** tie rows to Supabase Auth users.

### 7.1 `public.cmo_simulation_runs`

Primary persistence for a simulation **run**: identity, status, JSON blobs for machine state and debrief.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| `run_id` | `uuid` | NO | — | **Primary key.** App generates with `crypto.randomUUID()` (see [`simulationPersistence`](../src/lib/simulationPersistence.ts)). |
| `user_id` | `uuid` | NO | — | **FK** → `auth.users(id)` `ON DELETE CASCADE`. Must match JWT `sub`. |
| `user_email` | `text` | NO | — | Denormalized email at save time. |
| `user_name` | `text` | YES | — | Optional display name. |
| `scenario_id` | `text` | NO | `'custom'` | Scenario identifier from app context. |
| `company_name` | `text` | NO | `'Untitled Company'` | From strategy setup. |
| `current_phase` | `text` | NO | `'setup'` | App-driven phase label (e.g. quarter / setup). |
| `status` | `text` | NO | — | **`CHECK`** in `('in_progress', 'completed')`. |
| `overall_score` | `numeric` | YES | — | **Server-finalized** on save: `calculateOverallScore(context)` in [`POST /api/simulations/save`](../src/app/api/simulations/save/route.ts) (same deterministic formula as the client preview). |
| `grade` | `text` | YES | — | **Server-finalized** on save: `calculateGrade(overall_score)` (not taken from client JSON for persistence). |
| `debrief` | `jsonb` | NO | `'{}'` | **Server-finalized** on save: `buildTeachingReport(context)` output (client body mirrors are ignored for DB writes). |
| `context` | `jsonb` | NO | `'{}'` | Full **`SimulationContext`** from [`simMachine`](../src/lib/simMachine.ts)—quarters, tactics, strategy, budgets, results, etc. |
| `saved_at` | `timestamptz` | NO | `now()` | Last successful save timestamp from client/API. |
| `created_at` | `timestamptz` | NO | `now()` | Row creation. |
| `updated_at` | `timestamptz` | NO | `now()` | Maintained by trigger. |

**Indexes:**

- `idx_cmo_simulation_runs_user_saved` on `(user_id, saved_at DESC)`
- `idx_cmo_simulation_runs_status` on `(status)`
- `idx_cmo_simulation_runs_current_phase` on `(current_phase)`

**RLS:** Enabled. Policies (after `20260511`): `SELECT` / `INSERT` / `UPDATE` / `DELETE` **only** for rows where `auth.uid() = user_id`, **`TO authenticated`**.

---

### 7.2 `public.user_profiles`

Onboarding / “profile memory” reused across runs (setup page, debrief context).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| `user_id` | `uuid` | NO | — | **PK**, **FK** → `auth.users(id)` `ON DELETE CASCADE`. |
| `email` | `text` | NO | — | Upserted from session email in API. |
| `full_name` | `text` | YES | — | |
| `company_name` | `text` | YES | — | |
| `role` | `text` | YES | — | |
| `marketing_maturity` | `text` | YES | — | |
| `selected_goals` | `jsonb` | NO | `'[]'` | Array of goal strings from UI. |
| `onboarding_answers` | `jsonb` | NO | `'{}'` | Arbitrary key/value answers. |
| `preferred_difficulty` | `text` | YES | — | |
| `created_at` | `timestamptz` | NO | `now()` | |
| `updated_at` | `timestamptz` | NO | `now()` | Trigger-maintained. |

**Index:** `idx_user_profiles_email` on `(email)`.

**RLS:** Enabled. `SELECT` / `INSERT` / `UPDATE` for `authenticated` when `auth.uid() = user_id`. **No DELETE policy** in migration—deletes are effectively disallowed via PostgREST unless added later.

**API:** [`GET/POST /api/profile`](../src/app/api/profile/route.ts).

---

### 7.3 `public.simulation_events`

Append-only analytics-style events tied to a run (milestones, funnel steps, etc.).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| `event_id` | `uuid` | NO | `gen_random_uuid()` | **PK**. |
| `run_id` | `uuid` | NO | — | **FK** → `cmo_simulation_runs(run_id)` `ON DELETE CASCADE`. |
| `user_id` | `uuid` | NO | — | **FK** → `auth.users(id)` `ON DELETE CASCADE`. |
| `event_type` | `text` | NO | — | App-defined string (e.g. `phase_entered`). |
| `phase` | `text` | NO | — | Simulator phase label. |
| `payload` | `jsonb` | NO | `'{}'` | Arbitrary JSON metadata. |
| `created_at` | `timestamptz` | NO | `now()` | |

**Indexes:**

- `(user_id, created_at DESC)`
- `(run_id, created_at DESC)`
- `(event_type)`

**RLS:** `SELECT` and `INSERT` for `authenticated` when `auth.uid() = user_id` **and** a matching `cmo_simulation_runs` row exists for that `run_id` and user. **No UPDATE/DELETE** policies—treat as immutable log.

**API:** [`POST /api/simulation-events`](../src/app/api/simulation-events/route.ts) validates `runId`, `eventType`, `phase`, and inserts one row.

---

### 7.4 `public.simulation_score_breakdowns`

Denormalized rows derived from `context` at save time for querying/reporting (one row per phase/category bucket after each atomic save).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| `breakdown_id` | `uuid` | NO | `gen_random_uuid()` | **PK**. App may supply UUID in RPC payload. |
| `run_id` | `uuid` | NO | — | **FK** → `cmo_simulation_runs(run_id)` `ON DELETE CASCADE`. |
| `user_id` | `uuid` | NO | — | **FK** → `auth.users(id)` `ON DELETE CASCADE`. |
| `phase` | `text` | NO | — | e.g. `setup`, `Q1` … |
| `category` | `text` | NO | — | e.g. scoring dimension name. |
| `score` | `numeric` | NO | — | |
| `max_score` | `numeric` | NO | `100` | |
| `insight` | `text` | NO | — | Human-readable line. |
| `metadata` | `jsonb` | NO | `'{}'` | Extra structured fields from [`buildSimulationScoreBreakdowns`](../src/lib/simulationIntelligence.ts). |
| `created_at` | `timestamptz` | NO | `now()` | |

**Constraints / indexes:**

- **Unique:** `uq_simulation_score_breakdowns_run_phase_category` on `(run_id, phase, category)` — ensures one row per bucket per run; requires **delete-then-insert** in RPC (hence migration `20260512` DELETE policy).
- `(user_id, created_at DESC)`, `(run_id, created_at DESC)` for listing.

**RLS:** `SELECT` / `INSERT` / `UPDATE` / **`DELETE`** for `authenticated` when `auth.uid() = user_id` and the parent run exists and belongs to the user. The DELETE policy is **critical**: without it, RPC’s `DELETE FROM simulation_score_breakdowns WHERE run_id = …` removes zero rows under RLS and the subsequent insert hits unique violations.

**Population:** Not inserted directly by most app paths—[`POST /api/simulations/save`](../src/app/api/simulations/save/route.ts) calls `save_simulation_run_atomic` with rows built by `buildSimulationScoreBreakdowns(payload.context)`.

---

## 8. API routes ↔ database mapping

| Route | Method | Tables / RPC |
|-------|--------|----------------|
| `/api/simulations/save` | POST | Recomputes `overall_score`, `grade`, `debrief` from `context`; RPC `save_simulation_run_atomic`; then `SELECT * FROM cmo_simulation_runs` for response. |
| `/api/simulations` | GET | `cmo_simulation_runs` — list recent columns for dashboard. |
| `/api/simulations/latest` | GET | `cmo_simulation_runs` — latest row for resume. |
| `/api/simulations/[runId]` | DELETE | `cmo_simulation_runs` — cascade removes events/breakdowns. |
| `/api/simulation-events` | POST | `cmo_simulation_runs` (lookup), `simulation_events` (insert). |
| `/api/profile` | GET / POST | `user_profiles` |
| `/api/auth/sign-up` | POST | May use admin client + Auth APIs (service role). |
| `/api/health` | GET | Reachability probe to Supabase REST origin (not a DB catalog query). |

---

## 9. Saved payload shapes (JSONB)

### 9.1 `PersistedRunPayload` → RPC `p_run`

The API converts the HTTP body to snake_case keys matching Postgres column names ([`toRpcRunRow`](../src/app/api/simulations/save/route.ts)). Logical TypeScript shape: [`PersistedRunPayload`](../src/lib/simulationPersistence.ts).

- **`context`:** Full **`SimulationContext`** — quarters (`Q1`–`Q4` with tactics, results, budgets), `strategy`, `simulationId`, `scenarioId`, wildcards, etc. This is the **large** JSON document and the **source of truth** for persisted scoring on the server.
- **`overall_score` / `grade` / `debrief` (in `p_run`):** The save route **recomputes** these from `context` using [`simulationInsights`](../src/lib/simulationInsights.ts) (`calculateOverallScore`, `calculateGrade`, `buildTeachingReport`) before calling the RPC. The client still sends `overallScore`, `grade`, and `debrief` on the wire for payload shape parity and local UX; those fields are **not** trusted for database persistence.

### 9.2 `p_breakdowns`

Array of objects with keys: `breakdown_id`, `run_id`, `user_id`, `phase`, `category`, `score`, `max_score`, `insight`, `metadata` (see save route mapping). The RPC also accepts partial rows and fills defaults via `jsonb_array_elements`.

---

## 10. Coolify-oriented checklist

1. Deploy **Postgres + Supabase stack** (or use Supabase Cloud).
2. Apply **`supabase/migrations/*.sql`** in order.
3. On the **Next.js** service set `NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_SITE_URL`, and optionally `SUPABASE_SERVICE_ROLE_KEY`.
4. Configure **redirect URLs** (dashboard or GoTrue env for self-hosted).
5. Point Coolify or proxy **health checks** at `GET /api/health` if desired (`dependencies.supabaseReachable`).
6. Schedule optional **maintenance** (vacuum, retention) per [`operations-coolify.md`](./operations-coolify.md).

---

## 11. Entity relationship (conceptual)

```
auth.users
    │
    ├──< cmo_simulation_runs (user_id)
    │       │
    │       ├──< simulation_events (run_id)
    │       └──< simulation_score_breakdowns (run_id)
    │
    └── user_profiles (user_id, 1:1)
```

Deleting a user in Auth cascades to all dependent rows above.

---

*This file reflects the migrations and TypeScript integration in this repository. If you add migrations, update this document in the same PR.*
