CMO Simulator Master Strategy
Purpose
This document is the working master plan for evolving CMO Simulator into a top-tier 2026 strategy simulation product that feels credible to marketers, replayable as a game, and differentiated from generic business sims.
It combines:
the core ideas from the current research documents
the current repo/build audit
competitive positioning against the simulation products and executive-learning experiences already in the market
a practical roadmap for what to edit, remove, improve, and build next
This file is intended to act as the single planning source for product direction until the project is further split into dedicated docs.

---

Product Vision
CMO Simulator should become a premium executive marketing simulation where the player operates as a real Chief Marketing Officer under pressure, balancing:
board and CEO expectations
cross-functional tradeoffs
budget allocation
channel strategy
talent decisions
brand health
customer outcomes
market competition
long-term strategic positioning
The product should not feel like a quiz, calculator, or MBA slideshow. It should feel like:
a strategy game with real consequences
a high-end decision simulator
a playable CMO operating system
an educational product disguised as an obsession loop
The goal is to create something that users do not just try once, but replay to test different strategic styles and compare outcomes.

---

Competitive Context
Based on the current research set, the competitive landscape includes several different categories of products.

1. CMO / Executive-Focused Simulations
   The CMO Game — lightweight, playful, career-climb framing
   Markstrat — long-standing benchmark for strategic marketing education
   Emerging CMO / executive education programs — strong strategic framing, weak software productization
   FLIGBY — leadership and decision-density emphasis
2. Strategic Execution / General Management Sims
   CELEMI Tango — business performance, operations, and people interaction
   Advantexe strategic execution simulations — strategy implementation under organizational pressure
   Cesim Elite — broad competitive business decision modeling
   What these products do well
   They create tradeoffs instead of obvious right answers
   They make decisions compound over time
   They frame leadership as pressure management, not just channel selection
   They teach through consequences
   Where CMO Simulator can win
   CMO Simulator can differentiate by combining:
   modern UX and premium product feel
   rich debriefing and strategic analysis
   marketing-native mechanics rather than generic business-school abstractions
   stronger emotional immersion through CEO, board, finance, product, and team pressure
   better replayability through scenario packs, archetypes, industries, and strategic paths
   more satisfying feedback loops than static executive training products
   Positioning Statement
   CMO Simulator should become the most modern, replayable, and insight-rich marketing leadership simulator in the category.

---

Core Product Pillars
The build should be organized around five pillars.

1. Executive Pressure
   The player must feel that they are leading inside an organization, not just selecting channels.
   This means introducing pressure from:
   CEO expectations
   CFO budget scrutiny
   sales alignment issues
   product readiness constraints
   team morale and burnout
   board confidence and strategic patience
2. Strategic Consequences
   Every quarter should materially alter future options.
   Examples:
   overspending on paid media should reduce future efficiency
   underinvesting in brand should weaken future conversion strength
   overworking the team should reduce execution quality later
   weak positioning should make competitive attacks more damaging
   strong content and SEO investment should pay off later rather than instantly
3. Replayability
   Players should want to rerun the simulation with different strategies.
   This requires:
   multiple viable paths to success
   different scenario types
   variable competitor behavior
   wildcard events that feel contextual, not random nonsense
   strong debrief comparison between runs
4. Educational Value
   The sim should teach users why outcomes happened.
   This should come through:
   contextual explanations
   strategy commentary
   quarter recaps
   debrief insights
   side-by-side “what worked / what hurt / what to try next” breakdowns
5. Premium Product Feel
   The UI should feel polished and modern, but polish must support decision clarity.
   The product should feel:
   premium
   immersive
   confident
   data-rich
   easy to scan
   emotionally tense in the right moments
   It should not feel like a dashboard demo wrapped in blur effects.

---

Current Repo Audit Summary
The current repo already contains strong scaffolding and several promising systems:
Next.js 15 / React 19 / TypeScript foundation
XState-based simulation flow
advanced scoring language and multiple engine ideas
setup, strategy, quarterly flow, debrief ambitions, and leaderboard framing
polished UI direction with immersive simulation components
Current strengths in the repo
Good modern stack choice
Next.js 15, React 19, XState, Zustand, Recharts, Framer Motion, and Cloudflare/OpenNext support are already present.
The simulation concept is already visible in the product structure
setup, strategy, Q1–Q4, debrief, dashboard, and leaderboard directions are already defined.
There is already meaningful effort in the scoring layer
brand equity, team morale, adstock, market share, ROI, and competitive response systems are present conceptually.
The product already aims higher than a portfolio toy
the language and architecture clearly target an educational strategy platform.
Current structural issues in the repo
State ownership appears split
setup flow stores a simulation object to localStorage, while the gameplay flow appears to rely on XState actor context.
this creates risk that the setup choices and actual quarter logic are not sharing one consistent source of truth.
There are at least two competing simulation brains
`src/lib/simulationEngine.ts`
`src/lib/simMachine.ts`
These overlap in responsibility. That is risky for balancing, debugging, and future content work.
System taxonomies do not fully align
setup uses one set of time horizon and market landscape ideas
the XState machine uses a different vocabulary for those same ideas
this will create design drift, analytics drift, and balancing drift
Some advanced systems are still placeholders
wildcard cost and impact hooks are not fully wired into meaningful gameplay consequences
some advanced language is ahead of the actual player-facing experience
A few formulas likely need recalibration
the paid media “diminishing returns” logic should be rechecked carefully
adstock comments and actual decay semantics should be aligned and simplified
Current product risk
The project risks becoming:
over-architected under the hood
under-expressive in the actual player experience
harder to balance because there are too many partially overlapping models
That is fixable, but it needs a cleanup pass before major feature expansion.

---

What Needs to Be Edited, Removed, Changed, or Improved
A. Canonicalize the Design Language
Problem
The project currently uses overlapping terms for similar ideas across research docs and code.
Action
Create one official vocabulary for:
time horizons / play lengths
market landscapes
KPI definitions
quarter phases
difficulty tiers
industry types
wildcard categories
talent categories
big bet categories
Recommendation
Use one canonical model and refactor everything else to match it.
Suggested v1 canonical structure
Play Modes
Sprint
Operator
Legacy
Market Landscapes
Incumbent Duel
Crowded Category
Emerging Category
Volatile Market
Difficulty Levels
Guided
Standard
Executive
Win Profiles
Growth
Efficiency
Brand Power
Market Defense
Remove
extra naming variants that describe the same thing in slightly different ways
duplicate terminology across docs and code

---

B. Unify the Simulation Architecture
Problem
There are too many layers that look responsible for core logic.
Action
Adopt a clean separation of responsibilities.
Recommended architecture
XState controls flow and state transitions
Simulation Engine owns quarter calculations and consequences
Persistence Layer stores and reloads the single simulation object
UI Layer displays decisions, previews, and debriefs
Required change
There should be one official simulation state shape.
Remove
duplicated KPI calculation paths
overlapping simulation math in more than one core file
disconnected setup data paths

---

C. Make the Quarter Loop Sharper
Each quarter needs a clearer player loop.
Target quarter loop
Review current state
Receive executive pressure and market context
Make strategic choices
Handle wildcard or organizational event
Process quarter outcome
Review outcome changes
Get strategic commentary for next quarter
Improve
Each quarter should include:
what changed since last quarter
what is urgent now
what the CEO / board / team cares about
what constraints matter this quarter
what tradeoff the player is really making
Remove
any quarter screens that feel like static selection menus with thin consequences

---

D. Improve the Actual Feeling of Being a CMO
Problem
Channel math alone does not create CMO realism.
Add systems for:
board confidence
CEO pressure
CFO scrutiny
product readiness
sales feedback
team capacity and morale
reputational fragility
campaign narrative risk
Examples
“The CFO wants immediate pipeline and is threatening to freeze upper-funnel spend.”
“Sales says lead quality is falling despite volume growth.”
“The CEO wants a bigger category narrative, not just demand capture.”
“Product delays force messaging changes and frustrate launch timing.”
This turns the experience from a channel allocator into a true executive simulation.

---

E. Improve Replayability
Add
scenario packs
industry-specific tensions
strategic archetypes
different competitor personalities
quarterly surprise variation
post-run comparisons
Strategic archetype examples
Performance Maximalist
Brand Builder
Category Creator
Efficiency Operator
Crisis Stabilizer
Challenger CMO
Scenario pack examples
recession year
product launch year
acquisition integration year
brand crisis year
turnaround year
new market entry year
Remove
one-size-fits-all event logic that ignores company context

---

F. Make the Debrief a Killer Feature
The debrief is one of the biggest opportunities in the product.
It should answer
what strategy did I actually run?
what made it work or fail?
when did momentum shift?
what did I overinvest in?
what signals did I ignore?
how would a stronger CMO have handled this run?
Include in the debrief
strategic summary
quarter-by-quarter turning points
KPI progression
board / leadership interpretation
strengths
weaknesses
missed opportunities
recommended alternative path
comparison against other strategic archetypes
comparison against prior runs
Add
“If you rerun this scenario, try this” section
“What your decisions say about your CMO style” section
This is where the product becomes memorable.

---

Research Areas That Need More Depth
The next research push should focus on calibration, realism, and differentiation.

1. Industry Calibration Research
   Research realistic benchmark ranges for each supported industry:
   average CAC
   average LTV / CLV
   sales cycle length
   conversion rates
   retention / churn patterns
   channel fit by industry
   typical competitive pressure
   pricing sensitivity
   category maturity
   Recommendation
   Do not launch v1 with too many industries.
   Suggested v1 industry list
   Start with 4–5:
   SaaS / B2B software
   Healthcare / HealthTech
   E-commerce / DTC
   Legal / professional services
   Consumer subscription brand
   Remove or defer for later
   ultra-niche or exotic industries until the balancing model is proven

---

2. Executive Pressure Modeling
   Research how CMOs are actually evaluated in different company contexts.
   Research questions
   What do boards care about most in different business stages?
   When do CFO expectations overpower brand strategy?
   How should sales conflict show up in the model?
   How should product delays alter marketing outcomes?
   What does “good” look like for a CMO in startup vs enterprise contexts?

---

3. Debrief and Coaching Design
   Research how executive coaching and case review products explain strategic performance.
   Focus areas
   post-run analysis format
   executive learning UX
   strategy explanation patterns
   what makes feedback actually useful instead of generic

---

4. Scenario and Narrative Design
   Research how to make scenario packs feel grounded.
   Focus areas
   realistic market events
   organizational politics
   pricing wars
   launch timing issues
   brand crises
   internal resource conflict

---

5. Difficulty Design
   Research how to create difficulty without making the sim feel unfair.
   Difficulty should alter
   signal clarity
   competitor aggression
   budget flexibility
   team resilience
   board patience
   forecast certainty
   Not just “hard mode = smaller numbers.”

---

Recommended Product Structure for v1
The smartest move is not to build everything at once.
v1 Objective
Launch a version that is deep enough to be loved and replayed, but narrow enough to balance and polish properly.
Recommended v1 scope
1 core campaign structure
4 quarters minimum
4–5 industries
20–30 tactics
12–20 wildcard events
6–9 talent choices
6–8 big bets
1 excellent debrief
3 difficulty levels
3–4 market landscapes
v1 must feel excellent at
clarity of decisions
consequence feedback
replayability
debrief value
polish
v1 does not need yet
multiplayer
massive industry library
huge tactic catalog
overcomplicated financial modeling
endless certification content

---

Recommended File and Documentation Structure
Right now, too much information is mixed together.
Create these docs in the repo

1. `docs/product/CMO_SIMULATOR_PRD.md`
   Contains:
   audience
   positioning
   product vision
   v1 scope
   success criteria
2. `docs/design/SIMULATION_DESIGN_SPEC.md`
   Contains:
   quarter loop
   difficulty system
   wildcard system
   talent system
   big bets
   debrief logic
3. `docs/design/ENGINE_MATH_SPEC.md`
   Contains:
   score model
   adstock logic
   saturation logic
   KPI update rules
   balancing assumptions
4. `docs/content/SCENARIO_LIBRARY.md`
   Contains:
   scenarios
   wildcard ideas
   executive prompts
   industry tensions
5. `docs/roadmap/BUILD_ROADMAP.md`
   Contains:
   immediate backlog
   milestone plan
   technical cleanup list
   Recommendation
   This current file can temporarily serve as the master document until those are broken out.

---

Repo Edit Plan: What to Change First
Phase 1 — Cleanup and Canon

1. Align types and naming
   Edit and align:
   `src/app/sim/setup/page.tsx`
   `src/lib/simMachine.ts`
   `src/lib/simulationEngine.ts`
   `src/types/*`
2. Define one official simulation state shape
   Make sure setup, gameplay, debrief, and persistence all read from the same structure.
3. Remove duplicate logic paths
   If a KPI or quarter outcome is calculated in more than one core place, consolidate it.
4. Recheck formulas
   Audit:
   paid ads diminishing returns
   adstock decay semantics
   synergy multipliers
   market share progression
   score weighting
5. Reduce v1 scope
   Trim industry list and scenario scope so balancing becomes realistic.

---

Phase 2 — Quarter Experience Upgrade
Focus
Make the quarter loop feel more like executive decision-making and less like menu picking.
Add
leadership pressure panels
clearer tradeoff framing
stronger outcome previews
better quarter recap screens
more explicit organizational consequences
Improve
Q1 onboarding into real strategy framing
quarter context and urgency
tactical explanation and educational commentary

---

Phase 3 — Debrief and Replayability
Build
powerful debrief page
strategic style summary
decision timeline
alternative path guidance
run-to-run comparison
scenario replay hooks
This is likely the highest-leverage differentiation investment.

---

Phase 4 — Content Expansion
Add only after core loop works
more scenarios
more industries
more wildcard packs
more big bets
seasonal and themed challenge modes

---

Detailed Build Recommendations

1. Setup Experience
   Improve
   make every setup choice clearly affect gameplay
   preview tradeoffs before the player confirms selections
   explain what changes when difficulty changes
   reduce excessive option sprawl if it weakens clarity
   Change
   Industry count should be reduced for v1 unless balancing is already strong.
   Add
   strategy archetype selection
   “what this means” preview cards
   recommended mode for first-time players

---

2. Strategy Session
   Improve
   The strategy session should define more than audience and channels.
   Add
   primary business goal for the year
   risk tolerance
   leadership style
   budget philosophy
   executive expectation setting
   This creates clearer identity for each run.

---

3. Tactic Selection
   Improve
   Tactics should feel meaningfully distinct.
   Each tactic should communicate
   what it is for
   what it helps immediately
   what it helps later
   what it risks
   what it synergizes with
   what company types benefit most
   Add
   synergy preview
   delayed payoff warning
   overexposure / saturation warning
   tactic fatigue or diminishing returns indicator

---

4. Wildcard Events
   Improve
   Wildcards must feel contextual, not random.
   They should be driven by
   industry
   company profile
   current KPI state
   player strategy
   market landscape
   prior quarter decisions
   Add
   executive memo framing
   richer choice rationale
   immediate and downstream impact visibility
   Remove
   flat random event behavior with generic outcomes

---

5. Talent and Big Bets
   Improve
   These systems should feel like C-level leverage points.
   Talent should influence
   execution quality
   team capacity
   morale
   functional strength
   campaign success rate
   Big bets should feel dramatic
   Examples:
   rebrand
   category education campaign
   premium repositioning
   PR offensive
   product launch blitz
   expansion into a new segment
   Add
   visible risk and confidence ranges
   contextual recommendations
   post-bet board reaction

---

6. KPI and Scoring Experience
   Improve
   The product should communicate why metrics moved.
   Add
   driver breakdowns
   leading vs lagging indicators
   confidence / uncertainty cues
   quarter-over-quarter explanations
   cause-of-change summaries
   Change
   The main score should reward different paths to success rather than a single “best” pattern.
   Strong design principle
   A clever efficiency strategy, a strong brand strategy, and a smart growth strategy should all be capable of winning if executed well.

---

Suggested Success Criteria
The app is succeeding when players say things like:
“I want to rerun this with a different strategy.”
“That felt more realistic than I expected.”
“The debrief actually taught me something.”
“I understood why I lost.”
“I want to compare my run to other people.”
Product goals for v1
users complete full runs
users replay scenarios
users share results
debrief completion rate is high
players can describe what strategic choices mattered most

---

Immediate Next Steps
Highest-priority actions
Canonicalize terminology across docs and code
Choose one official simulation engine path
Unify setup, state, and gameplay data flow
Recalibrate core formulas before expanding content
Reduce v1 scope to a balanceable set
Upgrade the quarter loop to feel more executive and less dashboard-like
Make debrief a flagship experience
Recommended first implementation target
If only one thing gets serious attention next, it should be:
state / engine unification + a much stronger quarter consequence loop
That will create the biggest downstream improvement across realism, replayability, and debrief quality.

---

Final Direction
CMO Simulator should not try to beat every competitor at their own game.
It should win by being:
more modern than academic sims
more strategic than lightweight business games
more immersive than spreadsheet simulators
more educational than flashy portfolio builds
more replayable than one-and-done executive workshops
The best version of this product is not just a marketing simulator.
It is a playable executive strategy lab for marketers.
