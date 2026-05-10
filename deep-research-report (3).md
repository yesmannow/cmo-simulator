# CMO Simulator Deep Research Audit and Phased Implementation Guide

## Current-state audit

The current CMO Simulator is already more than a simple quiz or landing-page novelty. In the codebase and documentation, it presents itself as a playable executive marketing strategy lab, an educational simulation, and a Darling MarTech lead-generation / diagnostic asset. The README frames it as an “advanced, educational marketing strategy game” with a digital-twin sandbox, while the live landing-page code positions it as a tool for “business owners and growth leaders” and explicitly says the simulator should act as a “valuable visitor experience” and a stronger follow-up artifact than a generic consultation request. In other words, the product’s present identity is dual-purpose: it is both a learning system and a business-development mechanism. fileciteturn16file0L1-L1 fileciteturn31file0L1-L1

The current user journey is structured and coherent. The simulation state machine maps `idle` to `/sim/setup`, `strategySession` to `/sim/strategy`, quarterly execution to `/sim/q1` through `/sim/q4`, and end-of-year review to `/sim/debrief`. The setup flow is a four-step wizard with scenario selection, company identity, budget philosophy, and executive briefing; it also includes profile memory, a guided demo, and “resume latest saved run” behavior. Strategy is intentionally gated on audience, positioning, and primary channel choices before the user can proceed to Q1. Quarterly pages then wrap a reusable operating console that combines tactic selection, budget status, forecast logic, executive-pressure framing, and quarter-finalization. The debrief page adds recommendations, score breakdowns, PDF export, and save behavior. This is a credible pedagogical skeleton: context first, then strategy, then execution, then retrospective. fileciteturn27file0L1-L1 fileciteturn37file0L1-L1 fileciteturn38file0L1-L1 fileciteturn39file0L1-L1 fileciteturn41file0L1-L1 fileciteturn55file3L1-L1

The front end is a modern Next.js App Router application with TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, React PDF, and XState. The root layout imports environment validation on startup, uses a theme provider, and registers PWA behavior. The `/sim` route group is protected both by middleware and an authenticated server layout that wraps the simulation with an auth provider, simulation provider, and CRM-style shell. The root repo also shows a `src/`, `public/`, `scripts/`, and `docs/design/` structure, plus a large number of root-level markdown planning and audit files, which indicates substantial exploration but also rising repo noise. fileciteturn12file0L1-L1 fileciteturn35file0L1-L1 fileciteturn22file0L1-L1 fileciteturn36file0L1-L1 citeturn0view0

State is managed through an XState machine in `src/lib/simMachine.ts`, with a React provider that hydrates from `localStorage` and re-saves context automatically to `cmo-sim-state-v2`. That means the product currently uses a hybrid persistence approach: local state for continuity plus authenticated server persistence for named runs, score breakdowns, profile memory, and event telemetry. This is a sensible pattern for resiliency, but it also creates two layers of truth that need stronger reconciliation rules. fileciteturn26file0L1-L1 fileciteturn34file0L1-L1 fileciteturn48file0L1-L1

The simulation engine is conceptually strong. Runtime quarter resolution maps tactic categories into engine channels, builds quarter market conditions, runs one engine tick, and then merges engine outputs with wildcard effects and soft KPI deltas. The engine itself uses channel-specific adstock decay, Hill-curve saturation, synergy, traffic efficiencies, industry-specific customer values and seasonality, and executive stress/flow-state logic. The current supporting docs in Drive also describe the product as a three-layer system: game orchestration, marketing-physics engine, and pedagogical presentation. This is a thoughtful foundation and already beyond the level of a superficial gamified assessment. fileciteturn26file0L1-L1 fileciteturn44file0L1-L1 fileciteturn55file0L1-L1

The biggest architectural issue is not lack of ambition; it is lack of alignment between ambition, documentation, and the operative logic actually running today. The README promises rich features like hidden metrics, share-of-voice behavior, multiple routes to success, AI board pressure, dynamic crises, and strategic depth, but the current shipping score logic is much narrower: `calculateOverallScore` is effectively total revenue scaled against a fixed denominator plus final market share, and `calculateGrade` is a simple threshold map. The debrief breakdowns also rely on heuristic bucket scores that are more about completion, tactic count, and basic KPI thresholds than about a rigorous executive evaluation model. fileciteturn16file0L1-L1 fileciteturn29file0L1-L1 fileciteturn42file0L1-L1

A second major issue is a documented logic gap around competitive dynamics. The current engine computes market conditions that include competitor spend, and the Drive engine reference explicitly notes the gap: competitor spend exists in market conditions and forecasting context, but is not used inside `runSimulationTick` to directly affect revenue generation. In the shipped engine code, traffic is driven by response, spend, channel efficiency, and economic index; competitor spend does not appear in the traffic formula. That means “crowded” markets are only partially realized, and the simulator’s market-rivalry story is stronger in language than in executed math. fileciteturn44file0L1-L1 fileciteturn55file0L1-L1

A third issue is model coherence. In `tactics.ts`, many tactics declare `expectedImpact.revenue`, but the Drive engine reference says tactic revenue does not directly flow into quarter revenue in the quarter-advance path; revenue comes from engine incremental sales derived from spend. That makes tactic data partly pedagogical copy and partly operative logic, which is a brittle boundary. If this is left unresolved, future contributors and coding agents will repeatedly misread what the system actually does. fileciteturn43file0L1-L1 fileciteturn55file0L1-L1

The persistence and data layer are more mature than the scoring layer. The app persists profile memory, simulation runs, simulation events, and score breakdowns; writes go through a save route that validates payload identity and calls an atomic Supabase RPC. The current Drive infrastructure doc also documents `cmo_simulation_runs`, `user_profiles`, `simulation_events`, and `simulation_score_breakdowns`, along with RLS and the `save_simulation_run_atomic` function. This is strong groundwork for future analytics, benchmarks, personalization, and admin tooling. fileciteturn46file0L1-L1 fileciteturn47file0L1-L1 fileciteturn49file0L1-L1 fileciteturn50file0L1-L1 fileciteturn57file0L1-L1

Deployment and environment assumptions are also clear. The repo validates `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`; `.env.example` includes both local and Vercel production examples, plus self-hosted Supabase / GoTrue notes. The repo supports standard Vercel deployment, but it is also configured for OpenNext Cloudflare deployment. That flexibility is useful, but it also means architecture decisions should avoid coupling future engine logic too tightly to one host-specific runtime. fileciteturn20file0L1-L1 fileciteturn21file0L1-L1 fileciteturn19file0L1-L1 fileciteturn16file0L1-L1

One notable UX / architecture inconsistency is auth behavior around the debrief. The `/sim` route group already requires a Supabase user via middleware and the simulation layout, yet the debrief includes another sign-in prompt that frames save/export as optional unlocks. That may reflect a second auth/session abstraction (`simAuth`) rather than route access itself, but from a product and code-maintenance standpoint it creates unnecessary cognitive load. This is exactly the kind of “works now, confuses later” abstraction that should be simplified before deeper feature expansion. fileciteturn22file0L1-L1 fileciteturn36file0L1-L1 fileciteturn41file0L1-L1

Direct live-deployment inspection was only partially successful. The Vercel deployment URL was provided, but direct fetch through web tooling timed out, so the runtime assessment below is based primarily on source inspection rather than reliable live interaction. That means I can validate intended routes, components, and behaviors from code, but I cannot claim full end-to-end verification of deployed behavior beyond that limitation. citeturn3view0

## Improvement research review

The improvement-research folder contains two relevant files: an improvement-plan document and a Supabase Edge Orchestrator proposal. Both are useful, but they should be treated as directional ideation rather than authoritative specifications. The improvement-plan file is clearly conversational and idea-heavy, not a finalized product brief. That matters because there are many good suggestions in it, but they are not all equally mature, feasible, or aligned with the current codebase. fileciteturn58file0L1-L1 fileciteturn58file1L1-L1

Across those improvement documents, the strongest recurring product themes are: make competition real, make scoring more executive-grade, increase pedagogical depth, improve replayability, and turn the debrief into a more valuable benchmarked artifact. Concretely, the documents repeatedly suggest share-of-voice dynamics, creative fatigue, explicit brand-equity multipliers, CLV/CAC and retention mechanics, difficulty modes, structural “big bets,” more consequential board/crisis logic, what-if analysis, percentile benchmarking, and social/shareable outputs. Those themes are coherent with the current product’s core promise and with the gaps visible in the code. fileciteturn58file0L1-L1

The Edge Orchestrator file pushes a more ambitious architectural direction: move core engine logic server-side through RPC / Edge Functions, centralize channel constants in the database, add realtime market-volatility behavior, use server-side scoring for anti-cheat and leaderboard integrity, and expose global or industry-level standing. The strategic logic is sound — especially around server authority, benchmark computation, and central engine tuning — but it is probably too large to adopt as the next move in one jump. The current product still needs stronger local model coherence before a full server-authoritative rewrite will pay off. fileciteturn58file1L1-L1

The net gap is clear. What exists today is a polished shell around a credible but still relatively simplified simulation core. What the research suggests is a more rigorous executive marketing lab with better economic realism, better benchmarking, stronger teaching models, and clearer commercial utility for Darling MarTech. The opportunity is not to replace the current simulator with something completely different. It is to tighten the product around one sharper promise: **a trustworthy, benchmarked executive decision lab that teaches and diagnoses marketing strategy quality under pressure.** fileciteturn16file0L1-L1 fileciteturn31file0L1-L1 fileciteturn58file0L1-L1 fileciteturn58file1L1-L1

## Strategic synthesis

The highest-leverage next vision is not “build more game features.” It is to make CMO Simulator into a **credible executive marketing operating lab** that produces a useful decision-quality artifact at the end of each run. The product should feel less like a portfolio demo with ambitious notes and more like a serious diagnostic system: scenario-driven, benchmarked, pedagogically rich, and commercially useful for qualifying and educating potential Darling MarTech clients. That direction is already visible in the current landing page and should become the explicit product north star. fileciteturn31file0L1-L1

The biggest opportunities are concentrated in four places. First, model credibility: align the engine, forecast, scoring, and debrief so they tell one coherent story. Second, outcome usefulness: make the debrief less generic and more diagnostic, benchmarked, and actionable. Third, UX polish: make setup, quarterly play, and post-quarter understanding feel tighter, calmer, and more executive. Fourth, admin/configurability: extract scenarios, difficulty, channels, coefficients, and rubrics into maintainable content/config systems instead of burying them in scattered logic and markdown. fileciteturn29file0L1-L1 fileciteturn40file0L1-L1 fileciteturn42file0L1-L1 fileciteturn58file1L1-L1

The most important product principles going forward should be straightforward. The simulation should be deterministic first and AI-enhanced second. The engine should drive the score; the narrative layer should explain the score, not invent it. Every major output should map back to explicit system state. The setup and debrief should reinforce Darling MarTech’s strategic authority. And every added mechanic should either improve realism, improve pedagogy, improve conversion utility, or reduce implementation ambiguity; if it does not do one of those, it should wait. Those principles fit both the current architecture and the research direction. fileciteturn44file0L1-L1 fileciteturn41file0L1-L1 fileciteturn58file0L1-L1

What should *not* be built yet is just as important. I would not prioritize multiplayer, fully live global competition, always-on realtime market shifts, certification programs, or a wholesale server-side engine rewrite as the immediate next step. Those ideas may be valid eventually, but they will amplify current ambiguities rather than solve them. The foundation is strong enough to evolve, but not yet tight enough to support maximal complexity safely. fileciteturn44file0L1-L1 fileciteturn29file0L1-L1 fileciteturn58file1L1-L1

## Implementation guide

**Executive summary**

Today’s CMO Simulator has a strong shell, a thoughtful four-stage journey, a modern full-stack architecture, and enough engine sophistication to justify continued investment. Its main weaknesses are coherence, not capability: important promises in positioning and documentation are ahead of what the runtime model and scoring actually guarantee. The recommended transformation path is to stabilize and clarify the core engine and scoring model first, then extract scenario/content/config systems, then upgrade executive realism and benchmarked debriefing, and only after that add harder features such as server-authoritative simulation components or richer competitive/community layers. fileciteturn16file0L1-L1 fileciteturn31file0L1-L1 fileciteturn44file0L1-L1 fileciteturn42file0L1-L1

**Improvement research summary**

The research folder pushes in the right direction: stronger market realism, stronger pedagogy, stronger benchmarking, stronger debrief outputs, and stronger server authority. The most valuable pieces of that direction are the ideas that close demonstrated current gaps: share-of-voice, retention/unit economics, structured difficulty, better board pressure, benchmarked outputs, and central model configuration. The least urgent pieces are the most infrastructurally expensive: full edge-orchestrated engine execution, realtime market volatility, and broad leaderboard gamification. fileciteturn58file0L1-L1 fileciteturn58file1L1-L1

**Gap analysis**

| Area | Current State | Desired Future State | Gap | Priority | Notes / Evidence |
|---|---|---|---|---|---|
| Product positioning | Hybrid of educational sim and lead-gen diagnostic, but still presented partly as “game” | Clear executive decision lab and diagnostic asset | Narrative not yet fully reflected in runtime/debrief quality | High | README and landing emphasize both education and lead utility. fileciteturn16file0L1-L1 fileciteturn31file0L1-L1 |
| Core engine realism | Adstock, Hill saturation, synergy, industry data exist | Competition, retention, cash flow, segment-fit, fatigue, and board economics materially affect outcomes | Important variables missing from runtime tick | High | Engine code plus engine reference highlight absent competitor impact in revenue path. fileciteturn44file0L1-L1 fileciteturn55file0L1-L1 |
| Scoring model | Revenue + final market share; heuristic breakdowns | Balanced executive rubric including efficiency, growth quality, strategic fit, unit economics, resilience | Score is too narrow for stated ambition | High | Current score and breakdown logic are simplistic. fileciteturn29file0L1-L1 fileciteturn42file0L1-L1 |
| Content/config system | Scenario/tactic data embedded in code; many markdown docs outside runtime | Typed scenario/content/rubric configuration with reusable schemas | Hard to evolve safely or delegate to coding agents | High | Setup scenarios and tactic library are hardcoded. fileciteturn37file0L1-L1 fileciteturn43file0L1-L1 |
| Debrief value | Recommendations and PDF exist, but analysis is mostly threshold-based | Benchmark-rich, what-if-aware, strategy-diagnostic, lead-worthy artifact | End artifact not yet differentiated enough | High | Debrief and recommendation generation are present but thin. fileciteturn41file0L1-L1 fileciteturn42file0L1-L1 |
| Persistence and analytics | Strong Supabase foundation with runs, profile memory, telemetry, score breakdowns | More robust reporting, cohort analytics, benchmark computation, admin tooling | Need to use existing data model more aggressively | Medium | Save route, events, profiles, and schema are already in place. fileciteturn46file0L1-L1 fileciteturn49file0L1-L1 fileciteturn50file0L1-L1 fileciteturn57file0L1-L1 |
| UX consistency | Strong shell, but some tension between auth, local persistence, and save/export behaviors | One mental model for identity, progress, and completion | Cognitive friction and hidden duplication | Medium | Sim auth overlap at debrief is a warning sign. fileciteturn34file0L1-L1 fileciteturn36file0L1-L1 fileciteturn41file0L1-L1 |
| Deployment/runtime validation | Deployment exists, but this audit could not fully validate it live | Stable prod verification and release confidence | Need testing/QA discipline to match ambition | Medium | Direct web fetch timed out. citeturn3view0 |

**Recommended product vision**

The next-level CMO Simulator should become a **scenario-based executive marketing lab** with four defining properties:

It should feel credible. That means the engine, forecast, score, board pressure, and final debrief need to reinforce each other rather than imply different models. It should feel teachable. That means users should leave not just with a grade, but with an explanation of *why* their system worked or failed. It should feel benchmarked. That means a user should understand how their choices compare with ideal baselines, peer cohorts, or scenario expectations. And it should feel commercially useful. That means the final debrief should be something Darling MarTech can actually use as a qualification, follow-up, or trust-building artifact. fileciteturn31file0L1-L1 fileciteturn41file0L1-L1 fileciteturn57file0L1-L1

**Strategic roadmap**

**Phase Alpha — Foundation stabilization**  
Objective: reconcile current runtime truth, scoring truth, and persistence truth.  
Strategic rationale: before adding realism, the app needs a cleaner contract between tactics, engine outputs, score logic, and debrief logic.  
Key outcomes: engine contract document, typed simulation-result interfaces, score/domain tests, auth/session cleanup decisions, and repo cleanup around canonical docs.  
Required repo areas/files likely affected: `src/lib/simMachine.ts`, `src/lib/simulationInsights.ts`, `src/lib/simulationIntelligence.ts`, `src/components/simulation/SimulationProvider.tsx`, `src/app/sim/debrief/page.tsx`, selected root docs.  
Dependencies: none.  
Risks: low technical risk, moderate product-decision risk.  
Definition of done: code and docs agree on how outcomes are computed; unit tests protect current behavior; debrief/auth ambiguity is reduced.

**Phase Beta — Content and scenario system extraction**  
Objective: move hardcoded scenario, channel, difficulty, and rubric content into typed config modules.  
Strategic rationale: safer iteration and easier delegation to Cursor/Codex.  
Key outcomes: reusable scenario schema, difficulty schema, tactic metadata schema, board-pressure threshold config.  
Required areas: setup page, tactics library, market conditions, quarter pages, types.  
Dependencies: Alpha.  
Risks: medium refactor risk.  
Definition of done: core runtime no longer depends on scattered constants buried in page files.

**Phase Gamma — Scoring and debrief overhaul**  
Objective: replace narrow revenue/share grading with an executive scorecard.  
Strategic rationale: the debrief is the commercial and pedagogical payoff.  
Key outcomes: weighted rubric for growth quality, efficiency, strategic coherence, resilience, and finish quality; benchmark-ready score breakdowns; clearer PDF/report sections.  
Required areas: `simulationInsights`, `simulationIntelligence`, debrief/report components, save payloads, score-breakdown rows.  
Dependencies: Alpha, Beta.  
Risks: medium data-model migration risk.  
Definition of done: score output is explainable and materially more useful than current grade logic.

**Phase Delta — Engine realism expansion**  
Objective: add the highest-value missing variables without rewriting the whole engine.  
Strategic rationale: increases realism where current documentation and research are already pointing.  
Key outcomes: share-of-voice drag, segment/channel fit, retention or loyalty loop, difficulty mode, creative fatigue or repeat-tactic penalty, and board/intervention tuning.  
Required areas: `src/engine/index.ts`, `src/lib/marketConditions.ts`, tactic metadata/config, state machine, debrief calculations.  
Dependencies: Beta, Gamma.  
Risks: high balancing risk.  
Definition of done: new variables measurably alter forecast, quarter outcomes, and debrief logic in testable ways.

**Phase Epsilon — UX polish and benchmark surfaces**  
Objective: elevate the experience from strong prototype to polished product.  
Strategic rationale: perception of trust and usefulness matters for both learning and lead generation.  
Key outcomes: clearer onboarding copy, stronger quarter-completion feedback, benchmark cards, what-if surface, cleaner resume/save states, and mobile refinements.  
Required areas: landing, setup, strategy, quarter console, debrief, analytics widgets.  
Dependencies: Gamma, Delta.  
Risks: medium.  
Definition of done: user flow is calmer, more legible, and more differentiated.

**Phase Zeta — Server authority and admin controls**  
Objective: selectively move high-value simulation authority server-side.  
Strategic rationale: improves anti-cheat integrity, configuration control, and benchmark computation.  
Key outcomes: central coefficient tables, optional server-resolved scoring or finalization, leaderboard/percentile infrastructure, admin-safe tuning path.  
Required areas: Supabase migrations/functions, save/finalize endpoints, score computation pathway, admin docs.  
Dependencies: Gamma, Delta.  
Risks: high operational risk if attempted too early.  
Definition of done: server-side authority handles the most valuable pieces without destabilizing the app.

**Technical architecture plan**

The app structure should evolve toward explicit domain modules. Today the codebase has the necessary building blocks, but the boundaries between “game shell,” “content/config,” “engine,” “score/rubric,” and “reporting” are still too loose. I recommend a domain-driven split: `simulation-config`, `simulation-engine`, `simulation-scoring`, `simulation-benchmarks`, and `simulation-reporting`, with page components becoming thin composition layers. That will make future coding-agent work much safer. fileciteturn26file0L1-L1 fileciteturn44file0L1-L1 fileciteturn42file0L1-L1

State and data management should keep XState, but the machine context should rely on smaller typed sub-objects and explicit derived selectors. Keep localStorage hydration as a resilience mechanism, but make server-saved runs the canonical source for authenticated users, with clear merge rules and versioning. Right now the hydration pattern is serviceable, but it will become fragile as the model grows. fileciteturn34file0L1-L1 fileciteturn48file0L1-L1

Simulation logic should remain deterministic and local in the near term, but it should be wrapped in a stricter contract. Add an engine input/output layer that makes quarter resolution explicit: scenario factors, chosen tactics, prior engine state, market conditions, and derived executive metrics. Then let the debrief and benchmarks consume that same output object. This is the cleanest way to stop score drift and narrative drift. fileciteturn26file0L1-L1 fileciteturn44file0L1-L1

Scenario/content should move to typed configuration files or JSON-like modules, not page-level constants. The setup page currently hardcodes scenarios; the tactics library currently hardcodes extensive tactic objects; difficulty is remembered in profile but does not appear as a first-class runtime operating mode. Centralizing those will unlock safer balancing and more flexible benchmarking later. fileciteturn37file0L1-L1 fileciteturn43file0L1-L1 fileciteturn46file0L1-L1

Scoring/evaluation should become a rubric engine. The core score should include growth, efficiency, strategic fit, budget quality, resilience to pressure, and finish quality. The grade should be a view over the rubric, not the rubric itself. A further “benchmark score” or “executive percentile” can then be layered on top when enough historical data exists. The current score-breakdown table structure is already a good foundation for this. fileciteturn29file0L1-L1 fileciteturn42file0L1-L1 fileciteturn57file0L1-L1

Persistence should remain in Supabase, but analytics should be used more deliberately. You already have the primitives to track run progression, profile memory, and score breakdowns. Add benchmark snapshots, debrief-export events, abandon points, and replay deltas before building anything grander. That will produce much more roadmap truth than more speculative ideation docs will. fileciteturn46file0L1-L1 fileciteturn47file0L1-L1 fileciteturn49file0L1-L1 fileciteturn50file0L1-L1

Testing should become a first-class workstream. Add unit tests for scoring and engine inputs/outputs, scenario snapshot tests, and at least a small Playwright or equivalent end-to-end flow for setup → strategy → Q1 → debrief. Without that, every future engine enhancement will be expensive and unsafe. The absence of strong verification is currently one of the biggest scaling constraints, especially because live deployment verification was not straightforward in this audit. fileciteturn19file0L1-L1 citeturn3view0

**UX and product experience plan**

Onboarding should emphasize “executive lab” over “game” and should introduce the user to what they will get at the end: a tested strategic profile, an executive-ready debrief, and a benchmarked picture of their strengths and failure modes. The current landing page moves in this direction already; the next step is to make setup and strategy pages feel like a guided diagnostic rather than a feature tour. fileciteturn31file0L1-L1 fileciteturn37file0L1-L1

Scenario selection should become more transparent about tradeoffs. Today it gives strong narrative context, which is good. Next it should preview the executive consequences of the chosen environment: competitive density, budget pressure, success criteria, and likely failure modes. That will help users understand why the same tactics fail in one environment and work in another. fileciteturn37file0L1-L1

The quarterly decision flow is already one of the strongest parts of the product. The operating console has the right pieces: budget status, forecasts, red flags, selected plan, and mentor/executive context. What it needs is stronger “why this matters” feedback at the moment of selection and a cleaner articulation of quarter objectives. Users should immediately see not just projected KPI change, but strategic mode change: “you are buying reach,” “you are protecting efficiency,” “you are risking share for brand.” fileciteturn40file0L1-L1

Feedback and results flow should become more layered. The current debrief offers score breakdowns and recommendations, but it should evolve into an ordered narrative: executive summary, strategic profile, benchmark position, quarter turning points, economic health, and next-run prescriptions. That structure will make the product feel more premium and much more useful as a Darling MarTech follow-up artifact. fileciteturn41file0L1-L1 fileciteturn42file0L1-L1

Copywriting should reinforce trust and seriousness. The best current copy is on the landing page, where the product is framed as a lab and a lead asset rather than a toy. That tone should spread across setup, quarter completion, warnings, and debrief. Error and edge states should also become more deliberate: state corruption, save failures, offline persistence, and re-entry all deserve polished UX because they are already product realities. fileciteturn31file0L1-L1 fileciteturn34file0L1-L1 fileciteturn48file0L1-L1

**AI and simulation enhancement plan**

The most valuable simulation improvements are deterministic. Add share-of-voice drag to the traffic formula, add segment/channel affinity, add retention or loyalty behavior, and add repeat-tactic fatigue. Those changes would immediately make the simulator more realistic, more replayable, and more educational, while also aligning it with the most frequent gaps called out in the improvement research. fileciteturn44file0L1-L1 fileciteturn58file0L1-L1

Scoring should incorporate unit economics and strategic resilience. A user who creates top-line growth by destroying CAC/LTV quality should not “win” the same way as a user who grows efficiently. This is one of the most important gaps between the current simulator and a true executive-grade product. The research suggestions around CLV/CAC, turnaround arcs, and big-bet structural pivots are directionally strong here, even if their specific formulas should be validated rather than copied blindly. fileciteturn29file0L1-L1 fileciteturn42file0L1-L1 fileciteturn58file0L1-L1

AI should be introduced as a narrative and coaching layer, not as the primary scoring engine. The safest near-term use is to generate executive-style commentary, alternative-play suggestions, or personalized explanation paragraphs *after* deterministic outcomes are computed. The edge-orchestrator document’s instinct to centralize authority is good, but the first production use of AI should be summarization and coaching, not undisclosed outcome generation. fileciteturn41file0L1-L1 fileciteturn58file1L1-L1

Replayability should come from meaningful strategic variation, not gimmicks. Difficulty modes, competitor archetypes, scenario-specific thresholds, benchmark comparisons, and what-if postmortems are all high-value. Randomness should support teaching and tension, but not obscure causality. The user should always be able to understand why a result changed. fileciteturn37file0L1-L1 fileciteturn40file0L1-L1 fileciteturn58file0L1-L1

**Prioritized backlog**

| Epic | User story | Description | Priority | Effort | Dependencies | Acceptance criteria |
|---|---|---|---|---|---|---|
| Engine contract | As a developer, I need one clear engine I/O contract | Create typed input/output interfaces for quarter resolution, forecasts, and score consumption | P0 | M | None | Contract is documented and used in engine, forecast, and debrief paths |
| Repo canonicalization | As a contributor, I need to know which docs are authoritative | Mark canonical docs and reduce root-level markdown ambiguity | P0 | S | None | One source of truth for architecture, engine, scoring, and infra docs |
| Scoring rubric v2 | As a user, I need a grade that reflects real strategy quality | Replace narrow revenue/share formula with weighted executive rubric | P0 | M | Engine contract | Score output shows weighted categories and aligns with debrief |
| Difficulty mode system | As a user, I want easy, mid, and hard modes that actually change play | Add first-class runtime difficulty config affecting budget, saturation, pressure, and/or competition | P1 | M | Config extraction | Difficulty is selectable, persisted, and reflected in outcomes |
| Scenario/config extraction | As a product owner, I need to change scenarios without editing page code | Move scenarios, channels, and thresholds into typed config modules | P1 | M | Engine contract | Setup page and engine import config from shared modules |
| Competitive realism | As a player, I want crowded markets to feel crowded | Add SOV/competitor drag to runtime math | P1 | M | Difficulty + config extraction | Competitor spend directly impacts traffic or outcome efficiency |
| Segment/channel fit | As a player, I want target audience choices to matter later | Add segment weightings and retention traits | P1 | M | Config extraction | Audience affects channel efficiency and debrief analysis |
| Retention / unit economics | As a learner, I need to see sustainable growth | Add retention loop and CAC/LTV-derived debrief section | P1 | M | Scoring rubric v2 | Debrief can flag unsustainable growth and reward durable growth |
| What-if analysis | As a user, I want to learn from alternative plays | Add simple counterfactual comparisons in debrief | P2 | M | Scoring rubric v2 | Debrief shows at least one deterministic what-if recommendation |
| Benchmark surfaces | As a user, I want context for my result | Add percentile/benchmark cards using saved runs and score breakdowns | P2 | M | Persistence, scoring rubric | Debrief and dashboard show scenario-relative benchmark context |
| Save/auth rationalization | As a user, I want predictable save/export behavior | Unify sim-route auth and debrief save/export messaging | P2 | S | None | No duplicated/confusing auth prompts in normal sim flow |
| Server authority | As an operator, I want central control of key score logic | Move high-value score/finalization logic server-side | P3 | L | Stable rubric and engine | Finalization path can be authoritatively recomputed on server |

**Risks, unknowns, and questions**

The largest unresolved risk is calibration. The engine can easily become “more complex” without becoming more useful. Every new mechanic needs explicit teaching value and should be testable against a benchmark scenario. A second risk is architectural overreach: full edge orchestration and leaderboard ecosystems are attractive, but premature if the local model is still shifting. A third risk is product identity drift: if the simulator tries to be a training platform, viral game, CRM shell, benchmark network, and consultancy lead engine all at once, it may underperform at all of them. fileciteturn44file0L1-L1 fileciteturn58file1L1-L1

Open questions that still need human input are practical. Is the primary goal customer acquisition for Darling MarTech, user education, or both in equal measure? Which scenarios and industries actually matter commercially for the business in the next six months? Should the first benchmark layer be normative (best-practice scores) or comparative (actual player percentiles)? And how much of the simulator’s final artifact should be public/shareable versus gated? Those choices will materially affect which roadmap phases should come first. fileciteturn31file0L1-L1 fileciteturn37file0L1-L1 fileciteturn58file0L1-L1

## Cursor and Codex implementation prompts

**Phase prompt — Foundation stabilization**

```text
You are working in the CMO Simulator repo.

Your task is to complete Phase Alpha: Foundation Stabilization.

Before editing anything:
1. Inspect the current repo structure.
2. Read the relevant files listed below.
3. Summarize your understanding.
4. Identify the safest implementation approach.
5. Then implement the changes.

Relevant files/folders to inspect:
- package.json
- README.md
- src/lib/simMachine.ts
- src/lib/simulationRouting.ts
- src/lib/simulationInsights.ts
- src/lib/simulationIntelligence.ts
- src/components/simulation/SimulationProvider.tsx
- src/app/sim/layout.tsx
- src/app/sim/debrief/page.tsx
- src/lib/saveSimulationSnapshot.ts
- src/app/api/simulations/save/route.ts

Goal:
Create a cleaner, safer simulation foundation by aligning engine contracts, score contracts, and persistence expectations without changing the user-facing product direction.

Implementation requirements:
- Add a dedicated typed module for simulation result contracts and score contracts.
- Refactor existing imports to use shared types where appropriate.
- Add code comments only where logic is currently non-obvious or misleading.
- Add a short canonical architecture note in a docs file that explains which runtime files are authoritative.
- Identify and reduce one high-risk ambiguity related to save/auth/debrief flow, but do not redesign the whole auth system.

Constraints:
- Do not remove existing functionality unless explicitly instructed.
- Do not introduce unnecessary dependencies.
- Preserve the current app’s working deployment.
- Keep changes modular and easy to review.
- Add comments only where they clarify non-obvious logic.

Acceptance criteria:
- Simulation and scoring types are centralized and imported from a shared module.
- No existing route is broken.
- The codebase has one clear place that explains the authoritative runtime path.
- The debrief/save/auth flow is slightly clearer in code structure than before.

Testing:
- Run npm run lint
- Run npm run build
- Manually test /sim/setup -> /sim/strategy -> /sim/q1 -> /sim/debrief
- Manually verify that local state hydration still works

Do not break:
- Current simulation phase routing
- Existing saveSimulationSnapshot behavior
- Existing QuarterOperatingConsole usage
- Existing debrief page rendering

Expected output from Cursor/Codex:
- Summary of repo understanding
- Files modified
- What changed
- Why the approach was safest
- How to test
- Any follow-up risks
```

**Phase prompt — Content and scenario extraction**

```text
You are working in the CMO Simulator repo.

Your task is to complete Phase Beta: Content and Scenario Extraction.

Before editing anything:
1. Inspect the current repo structure.
2. Read the relevant files listed below.
3. Summarize your understanding.
4. Identify the safest implementation approach.
5. Then implement the changes.

Relevant files/folders to inspect:
- src/app/sim/setup/page.tsx
- src/app/sim/strategy/page.tsx
- src/lib/tactics.ts
- src/lib/marketConditions.ts
- src/types
- any existing simulation config or constants files

Goal:
Move hardcoded scenarios, difficulty options, and tactic metadata into typed config modules so the simulation can be iterated more safely.

Implementation requirements:
- Create typed config modules for scenarios, difficulty modes, and tactic catalog metadata.
- Refactor setup and tactic consumption to import from config.
- Preserve existing visible behavior unless needed for the refactor.
- Add explicit types for scenario fields like industry, market landscape, budget, starting KPIs, and executive mandate.
- If a value is currently duplicated across files, reduce duplication.

Constraints:
- Do not change the overall user journey.
- Do not redesign the UI.
- Do not introduce CMS dependencies or remote data fetching.
- Keep this as an internal code-organization improvement with minimal user-facing change.

Acceptance criteria:
- Setup page no longer owns the primary scenario definitions inline.
- Tactics no longer rely on one large unstructured constant block without typed export boundaries.
- Difficulty mode config exists even if the UI for full difficulty handling is not fully wired yet.
- App still builds and runs.

Testing:
- Run npm run lint
- Run npm run build
- Manually test scenario selection in /sim/setup
- Manually confirm tactic selection still works in Q1

Do not break:
- Existing scenario IDs
- Existing tactic IDs
- Existing save payload structure unless absolutely necessary
- Existing route navigation

Expected output from Cursor/Codex:
- Summary of extracted config systems
- Files modified
- Refactor notes
- What remains for later phases
- How to test
```

**Phase prompt — Scoring and debrief overhaul**

```text
You are working in the CMO Simulator repo.

Your task is to complete Phase Gamma: Scoring and Debrief Overhaul.

Before editing anything:
1. Inspect the current repo structure.
2. Read the relevant files listed below.
3. Summarize your understanding.
4. Identify the safest implementation approach.
5. Then implement the changes.

Relevant files/folders to inspect:
- src/lib/simulationInsights.ts
- src/lib/simulationIntelligence.ts
- src/app/sim/debrief/page.tsx
- src/components/simulation/EnhancedDebrief*
- src/components/simulation/SimulationDebriefPdf*
- src/lib/simulationPersistence.ts
- src/app/api/simulations/save/route.ts

Goal:
Replace the current narrow score model with a more executive-grade rubric and make the debrief materially more diagnostic.

Implementation requirements:
- Introduce a weighted score rubric that includes at least:
  - growth quality
  - efficiency
  - strategic coherence
  - resilience / execution quality
  - finish quality
- Preserve backward compatibility where feasible for saved runs.
- Update the debrief so the user sees category-level explanations, not just a final grade.
- Improve recommendation generation so it references the new categories.
- Keep calculations deterministic.

Constraints:
- Do not add AI-generated scoring.
- Do not remove PDF export support.
- Do not add server-side migrations in this phase unless required for compatibility.
- Keep the implementation reviewable.

Acceptance criteria:
- Overall score is no longer just revenue + final market share.
- Debrief shows a clearer rubric-oriented breakdown.
- Recommendation logic references the new rubric categories.
- Save path still works with completed runs.

Testing:
- Run npm run lint
- Run npm run build
- Complete a sample run and inspect debrief
- Verify existing save endpoint still returns score breakdowns

Do not break:
- Simulation completion flow
- Debrief page rendering
- Existing save/export hooks
- Existing report generation components unless intentionally updated

Expected output from Cursor/Codex:
- Explanation of the new rubric
- Files modified
- Migration/backward-compatibility notes
- Test instructions
- Remaining future opportunities
```

**Phase prompt — Engine realism enhancements**

```text
You are working in the CMO Simulator repo.

Your task is to complete Phase Delta: Engine Realism Enhancements.

Before editing anything:
1. Inspect the current repo structure.
2. Read the relevant files listed below.
3. Summarize your understanding.
4. Identify the safest implementation approach.
5. Then implement the changes.

Relevant files/folders to inspect:
- src/engine/index.ts
- src/lib/simMachine.ts
- src/lib/marketConditions.ts
- src/lib/tactics.ts
- scenario/difficulty config modules added in earlier phases
- debrief/scoring modules that consume runtime metrics

Goal:
Add the highest-leverage missing simulation variables without rewriting the whole engine.

Implementation requirements:
- Add first-class difficulty mode support to runtime simulation.
- Add a competitive-drag / share-of-voice mechanic that influences traffic or efficiency.
- Add one audience/segment-fit mechanic that makes strategy choices matter downstream.
- Add one repeat-tactic fatigue or saturation-pressure mechanic.
- Expose enough runtime metrics so later debrief/reporting can reference these new dynamics.

Constraints:
- Keep the engine deterministic.
- Do not add remote APIs or LLM calls.
- Do not make balancing changes that are impossible to tune later.
- Use typed config/constants so future balancing is easy.

Acceptance criteria:
- Difficulty affects simulation outcomes in a measurable way.
- Competitor conditions now materially affect runtime outcomes.
- Audience or segment choice has downstream impact.
- Engine changes are covered by tests or deterministic fixtures.

Testing:
- Run npm run lint
- Run npm run build
- Add and run focused tests for engine/output calculations
- Manually compare at least two difficulty modes or two segment choices on the same scenario

Do not break:
- Existing quarter completion transitions
- Existing local state hydration
- Existing save payload compatibility unless documented
- Existing UI assumptions about context shape without updating them safely

Expected output from Cursor/Codex:
- Summary of new engine mechanics
- Files modified
- Any new types/config added
- How balancing was kept safe
- How to test
```

**Phase prompt — UX polish and benchmark surfaces**

```text
You are working in the CMO Simulator repo.

Your task is to complete Phase Epsilon: UX Polish and Benchmark Surfaces.

Before editing anything:
1. Inspect the current repo structure.
2. Read the relevant files listed below.
3. Summarize your understanding.
4. Identify the safest implementation approach.
5. Then implement the changes.

Relevant files/folders to inspect:
- src/app/landing/page.tsx
- src/app/sim/setup/page.tsx
- src/app/sim/strategy/page.tsx
- src/components/simulation/QuarterOperatingConsole.tsx
- src/app/sim/debrief/page.tsx
- any analytics / leaderboard / benchmark components
- save/profile/event routes as needed

Goal:
Make the simulator feel more polished, more useful, and more differentiated as an executive decision lab.

Implementation requirements:
- Improve copy and visual hierarchy for setup, strategy, and debrief.
- Add clearer quarter objectives and stronger explanation of projected plan consequences.
- Add at least one benchmark or percentile-style surface using available saved data or deterministic placeholders if real aggregation is not ready.
- Add one “what-if” or “next run” recommendation card in the debrief.
- Improve save/export/re-entry messaging consistency.

Constraints:
- Do not redesign the entire visual identity.
- Do not add heavy new UI dependencies.
- Keep mobile behavior intact.
- Keep changes modular.

Acceptance criteria:
- Setup and strategy feel more explicitly diagnostic and executive-oriented.
- Debrief has at least one benchmark-style context surface.
- Quarter flow gives clearer guidance on why a plan is strong or weak.
- Save/export/re-entry states are clearer to the user.

Testing:
- Run npm run lint
- Run npm run build
- Manually test mobile and desktop widths
- Complete a run and inspect debrief improvements

Do not break:
- Existing route structure
- Existing quarter console interactions
- Existing debrief export behavior
- Existing setup progression rules

Expected output from Cursor/Codex:
- UX summary
- Files modified
- Before/after rationale
- How to test
- Follow-up opportunities
```

**Phase prompt — Selective server authority**

```text
You are working in the CMO Simulator repo.

Your task is to complete Phase Zeta: Selective Server Authority.

Before editing anything:
1. Inspect the current repo structure.
2. Read the relevant files listed below.
3. Summarize your understanding.
4. Identify the safest implementation approach.
5. Then implement the changes.

Relevant files/folders to inspect:
- src/app/api/simulations/save/route.ts
- src/lib/simulationPersistence.ts
- src/lib/saveSimulationSnapshot.ts
- Supabase migration files
- documented database schema / RPC references
- any server-only Supabase clients and admin helpers

Goal:
Move the highest-value scoring/finalization logic toward server authority without destabilizing the product.

Implementation requirements:
- Keep core UX intact.
- Add or extend a server-side path for authoritative score finalization and/or benchmark calculation.
- If needed, add migrations or RPC changes conservatively and document them.
- Ensure client-submitted identity is still validated.
- Keep deterministic scoring logic shared or mirrored cleanly so drift is minimized.

Constraints:
- Do not attempt a full server-side engine rewrite in this phase.
- Do not weaken RLS or security posture.
- Do not add unnecessary cloud complexity.
- Keep local/product behavior functional if server-side authority is unavailable.

Acceptance criteria:
- One high-value scoring or finalization step is now server-authoritative.
- Relevant schema or RPC documentation is updated.
- Save/finalization flow still works end to end.
- Security checks remain explicit.

Testing:
- Run npm run lint
- Run npm run build
- Test save/finalization flow manually
- Verify relevant Supabase route/RPC behavior in a safe environment
- Confirm rollback or fallback behavior if server action fails

Do not break:
- Existing run saving
- Existing score breakdown storage
- Existing user profile behavior
- Existing auth boundaries

Expected output from Cursor/Codex:
- Summary of what became server-authoritative
- Files and migrations modified
- Security notes
- How to test
- Remaining risks and follow-up work
```

## Open questions and limitations

A few important items could not be fully verified in this audit. The live Vercel deployment could not be reliably inspected through web tooling because direct fetch timed out, so runtime observations are based mainly on source inspection rather than live behavioral confirmation. citeturn3view0

Several Drive-based current-state and improvement documents were accessible and useful, but the improvement materials appear to be conversational ideation rather than finalized internal requirements. I therefore treated them as directional research, not binding product spec. Where current code and research suggestions conflict, I prioritized the executable code and the current route/runtime behavior. fileciteturn58file0L1-L1 fileciteturn58file1L1-L1

The most important human decisions still needed are not technical. They are: whether the simulator is primarily a lead-gen qualifier or a learning product, which industries/scenarios matter most commercially, how much of the debrief should be gated, and whether benchmark comparisons should be percentile-based, normative, or both. Those decisions should be made before deeper roadmap phases are assigned to coding agents. fileciteturn31file0L1-L1