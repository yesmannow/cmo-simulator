# CMO Simulator

Educational marketing strategy simulation built with **Next.js 15** (App Router) and **TypeScript**. You run a four-quarter year as CMO: allocate budget to tactics, react to wildcard events, optionally place a strategic bet in Q3, and review outcomes against revenue, profit, market share, satisfaction, and brand awareness.

## Overview

The app combines a **game layer** (XState state machine, budgets, scenarios) with a **marketing-mix style engine**: channel spend maps into **adstock** (carryover), **Hill saturation** (diminishing returns), **synergy** across active channels, then a simple traffic → leads → conversions funnel that drives **incremental revenue**. Quarter results merge engine output with tactic expectations and wildcard impacts.

For a **fine-grained formula and variable reference** (maintained alongside the code), see **[docs/SIMULATION_ENGINE_REFERENCE.md](./docs/SIMULATION_ENGINE_REFERENCE.md)**.

## What’s in the product

- **Scenarios & setup** (`/sim/setup`): Turnaround, Hyper-Growth SaaS, and Challenger presets with budgets and starting KPIs; company identity, landscape, and strategy inputs.
- **Quarter play** (`/sim/q1` … `q4`): Add/remove tactics, triggers wildcards, complete quarters to advance the machine.
- **Forecast** (quarter UI): Projects outcomes using the same `processQuarterAdvance` path as live play, with downside/base/upside scenario adjustments.
- **Executive / board messaging**: Contextual pressure copy from KPIs and quarter (`ExecutivePressure`); engine also tracks **stress meters** and flow state on `engineState` for pipeline/analytics views.
- **Wildcards & morale**: Events with choices; impacts can affect KPIs plus **morale** and **brandEquity** on context.
- **Big bets (Q3)**: Randomized success/failure from risk-weighted probability (`talentMarket.ts`).
- **Debrief & PDF**: End-of-run summary; downloadable PDF via **@react-pdf/renderer** (`/sim/debrief`).
- **Persistence**: Authenticated users can save/load runs through Supabase (`cmo_simulation_runs` and related RPC/migrations).
- **Themes**: Brand/theme selection via user profile (`user_profiles`).

Some narrative in **[docs/design/SIMULATION_DESIGN_SPEC.md](./docs/design/SIMULATION_DESIGN_SPEC.md)** describes stretch goals (e.g. full crisis engine, tech tree, synthetic personas). Treat that doc as **design intent**; behavior is defined by the implementation and **SIMULATION_ENGINE_REFERENCE.md**.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js **15.5** (App Router) |
| UI | React **19**, Tailwind **4**, shadcn/Radix primitives |
| Simulation | **XState** (`simMachine.ts`), **Zustand** (demo store / engine playground) |
| Engine | `src/engine/` — adstock, Hill transform, synergy (`synergy`, `saturation`, `adstock`) |
| Auth & DB | **Supabase** (Auth, Postgres, RLS) |
| Charts | Recharts |
| PDF | @react-pdf/renderer |
| Deploy | Vercel-friendly; optional **Cloudflare** via OpenNext (`build:cloudflare`) |

## Getting started

### Prerequisites

- **Node.js 20+** recommended (works with modern Next.js 15 toolchains)
- **npm**
- A **Supabase** project if you use auth and saved runs

### 1. Install

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the repo root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database

Apply SQL in **`supabase/migrations/`** in order on your Supabase project (SQL Editor or CLI). This repo uses **`cmo_simulation_runs`**, save RPCs, and optional intelligence tables—see the migration filenames starting with dates.

**Legacy / optional:** Root-level **`supabase-schema-enhanced.sql`** and **`setup-database.md`** describe an older expanded schema (profiles, leaderboard views, etc.). The live app’s profile API expects **`user_profiles`**; align your database with the migrations and APIs you actually use.

Verify saved-run plumbing when wired:

```bash
npm run verify:db
```

### 4. Development server

```bash
npm run dev
```

Opens **http://localhost:3002** (see `package.json` scripts).

### Useful scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server with Turbopack on port 3002 |
| `npm run build` | Production build |
| `npm run start` | Start production server on 3002 |
| `npm run lint` | ESLint |
| `npm run test` | Jest |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build:cloudflare` | OpenNext build + Cloudflare output fix |
| `npm run verify:db` | Check simulation DB helpers |

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Root entry
│   ├── landing/                 # Marketing landing
│   ├── auth/                    # sign-in (includes signup mode), callback, update-password
│   ├── sim/
│   │   ├── setup/               # Scenario & company setup
│   │   ├── strategy/            # Strategy session
│   │   ├── q1/ … q4/            # Quarterly operating UI
│   │   ├── debrief/             # Results & PDF
│   │   ├── analytics/ pipeline/ campaigns/ credits/ simulations/
│   │   └── layout.tsx           # Sim shell
│   ├── api/
│   │   ├── simulations/         # Save, load, list runs
│   │   ├── profile/             # user_profiles
│   │   ├── auth/
│   │   └── ...
│   └── engine-demo/             # Direct engine / store playground
├── components/
│   ├── simulation/              # Quarter UI, debrief PDF, modals, KPI surfaces
│   └── ui/                      # Shared primitives
├── engine/                      # Adstock, saturation, synergy, tick
├── lib/
│   ├── simMachine.ts            # XState machine & processQuarterAdvance
│   ├── marketConditions.ts      # Quarter market inputs
│   ├── simulationForecast.ts    # Forecast & scenarios
│   ├── simulationPersistence.ts # Save payload shapes
│   ├── enhancedWildcards.ts     # Wildcard content
│   ├── talentMarket.ts        # Big bets & talent
│   ├── store.ts                 # Zustand demo store
│   └── supabase/                # Clients & middleware helpers
├── middleware.ts                # Next middleware (e.g. Supabase session refresh)
└── types/                       # Shared TS types
```

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/SIMULATION_ENGINE_REFERENCE.md](./docs/SIMULATION_ENGINE_REFERENCE.md) | Formulas, variables, and code paths for the simulation |
| [docs/SIMULATION_FLOW_AND_PEDAGOGY.md](./docs/SIMULATION_FLOW_AND_PEDAGOGY.md) | User journey by stage, actions/options per route, debrief outputs, teaching intent |
| [QUICKSTART.md](./QUICKSTART.md) | Step-by-step local setup (verify paths against this README) |
| [setup-database.md](./setup-database.md) | Legacy enhanced schema notes |
| [docs/design/SIMULATION_DESIGN_SPEC.md](./docs/design/SIMULATION_DESIGN_SPEC.md) | Product/design vision |

## Deployment

### Vercel

1. Connect the Git repo and set **environment variables** (`NEXT_PUBLIC_SUPABASE_*`).
2. Build command: `npm run build` (default).

### Cloudflare Pages (OpenNext)

Use **`npm run build:cloudflare`** (see `package.json`) and the OpenNext + **`nodejs_compat`** compatibility flag workflow described for Cloudflare; output is under **`.open-next`**.

Community reference: [OpenNext Cloudflare](https://opennext.js.org/cloudflare/get-started).

## Roadmap (ideas)

- Align **QUICKSTART.md** and **setup-database.md** fully with migrations-first DB setup
- Tutorial/onboarding pass tied to first `/sim/setup` visit
- Deeper use of engine **`competitorSpend`** in the tick (today mainly forecast/context)
- Achievements, sharing, and exports as needed for your GTM

## Contributing

Issues and PRs are welcome. Keep simulation math changes documented in **SIMULATION_ENGINE_REFERENCE.md**.

## License

MIT
