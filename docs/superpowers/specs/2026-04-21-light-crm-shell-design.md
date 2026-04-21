# Light CRM Shell (CMO Simulator) — Design Spec

**Date:** 2026-04-21  
**Scope:** All routes under `src/app/sim/*`  
**Goal:** Make the simulator feel like a credible marketing/CMO CRM dashboard (light, clean, professional) while preserving the simulation flow and data model.

---

## 1) Outcomes

### Must-haves
- A consistent **Light CRM shell** across all `/sim/*` pages with:
  - Left sidebar + top bar layout
  - White/gray canvas and soft cards
  - No “space/nebula” background in `/sim/*`
- Product-first branding:
  - App name remains **CMO Simulator**
  - The chosen company (and generated logo) is treated as the **workspace/account**
- Fix the current “styling is off” issue on `/sim/strategy` by eliminating mixed shells (dark outer + light inner).

### Nice-to-haves (still in-scope if low risk)
- Top bar **high-level stats** visible on all pages (Revenue, Profit, Market Share, Brand)
- A “Save/Resume” status chip (UI-only now; wire later to persisted run snapshot).

---

## 2) Non-goals (explicit)
- No new simulation rules / no rebalancing.
- No global site redesign outside `/sim/*`.
- No new auth model or data storage changes.
- No heavy “logo-wall” / generic portfolio visuals.

---

## 3) Information Architecture (Sidebar)

Sidebar navigation (route targets are existing):
- Overview → `/sim` (or keep existing `/sim/page.tsx` as overview)
- Strategy → `/sim/strategy`
- Quarter 1 → `/sim/q1`
- Quarter 2 → `/sim/q2`
- Quarter 3 → `/sim/q3`
- Quarter 4 → `/sim/q4`
- Debrief → `/sim/debrief`

Sidebar header (workspace):
- Company logo (generated) + company name
- Industry label (optional)
- If company not set yet, show “New Workspace” and a placeholder logo.

---

## 4) Layout System (Shell)

### Top-level layout
- Replace the current `/sim` layout (`src/app/sim/layout.tsx`) with a Light CRM shell:
  - `min-h-screen`
  - Neutral background (e.g. `bg-slate-50`)
  - Content area with max width and consistent padding
- Remove 3D background engine / ambient orbs from `/sim/*`.

### Top bar
- Left: breadcrumb / page title
- Center/right: Quick stats row (compact KPI tiles)
- Right: optional “Run status” chip

### Content area
- Pages render inside the shell without overriding page backgrounds.
- Component-level cards use subtle borders/shadows (soft CRM aesthetic).

---

## 5) Visual Language

### Colors / surfaces (Tailwind-first)
- Canvas: `bg-slate-50`
- Panels: `bg-white` + `border-slate-200` + `shadow-sm`
- Muted text: `text-slate-600`
- Headings: `text-slate-950`
- Accent: derived from company industry (optional), otherwise existing `primary`

### Cards
- Standard card: soft, low-contrast, consistent radius
- “Selected” states: minimal emphasis (border + subtle tint), avoid heavy glows

### Typography
- Prefer “product UI” sizing and weight:
  - Titles: `text-xl`–`text-3xl` with `font-semibold`
  - Labels: `text-xs` with `tracking-wide` and muted

---

## 6) Branding & Logo Handling

### Workspace branding
- Use the user-selected `context.strategy.companyName` as the workspace name across the shell.
- Show a logo mark:
  - Use existing `LogoGenerator` output as initial implementation.
  - Follow-on improvement: add “prebuilt” logo styles (monogram, badge, wordmark) and let the user select.

### Rules
- Keep “CMO Simulator” as the product name (header/footer optional), but primary identity inside `/sim/*` is the workspace.
- Never overwrite or rename the company; always read from simulation context.

---

## 7) Data Inputs (Source of Truth)
- Workspace name: `context.strategy.companyName`
- Industry: `context.strategy.industry` (already captured during setup)
- KPI quick stats: `context.kpis` + `context.brandEquity` + `context.morale` (where appropriate)

---

## 8) Implementation Notes (high level)
- Create a new CRM shell component (e.g. `components/simulation/CrmShell.tsx`) used by `src/app/sim/layout.tsx`.
- Update `ImmersiveLayout` so it doesn’t impose its own background or `sr-only` header if the shell already provides titles.
- Update `/sim/setup`, `/sim/strategy`, `/sim/q1–q4`, `/sim/debrief` pages to rely on shell spacing and cards.
- Keep existing shadcn components; adjust variants/classes to match the Light CRM palette.

---

## 9) QA / Acceptance Checklist
- `/sim/setup` → `/sim/strategy` → `/sim/q1` works with no visual “dark shell” bleed-through.
- Sidebar shows workspace name after setup; placeholder before.
- Top bar quick stats render on all `/sim/*` routes.
- No page sets `bg-slate-950` inside `/sim/*`.
- `npm run lint`, `npm run typecheck`, `npm test -- --runInBand` pass.

