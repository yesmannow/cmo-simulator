# CMO Simulator - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (Next.js 15 App Router)                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
         ┌──────────▼──────────┐   ┌─────────▼─────────┐
         │   Client Components │   │ Server Components │
         │   (Interactive UI)  │   │   (Data Fetching) │
         └──────────┬──────────┘   └─────────┬─────────┘
                    │                         │
         ┌──────────▼──────────┐   ┌─────────▼─────────┐
         │   React Hooks       │   │   Supabase Client │
         │   - useSimulation   │   │   - Auth          │
         │   - useDebrief      │   │   - Database      │
         └──────────┬──────────┘   └─────────┬─────────┘
                    │                         │
         ┌──────────▼──────────────────────────▼─────────┐
         │           BUSINESS LOGIC LAYER                 │
         │                                                │
         │  ┌─────────────────────────────────────────┐  │
         │  │      Simulation Engine                  │  │
         │  │  - initializeSimulation()               │  │
         │  │  - processQuarter()                     │  │
         │  │  - finalizeSimulation()                 │  │
         │  └─────────────────────────────────────────┘  │
         │                                                │
         │  ┌─────────────────────────────────────────┐  │
         │  │      Scoring Engine                     │  │
         │  │  - calculateMarketShare()               │  │
         │  │  - calculateSEOImpact()                 │  │
         │  │  - calculatePaidAdsImpact()             │  │
         │  │  - calculateBrandEquity()               │  │
         │  │  - calculateTeamMorale()                │  │
         │  │  - calculateFinalScore()                │  │
         │  └─────────────────────────────────────────┘  │
         │                                                │
         │  ┌─────────────────────────────────────────┐  │
         │  │      Event System                       │  │
         │  │  - generateWildcardEvent()              │  │
         │  │  - COMPETITIVE_EVENTS                   │  │
         │  │  - MARKET_SHIFT_EVENTS                  │  │
         │  │  - INTERNAL_CRISIS_EVENTS               │  │
         │  │  - OPPORTUNITY_EVENTS                   │  │
         │  └─────────────────────────────────────────┘  │
         └────────────────────────────────────────────────┘
                                 │
         ┌───────────────────────▼───────────────────────┐
         │              DATA LAYER                       │
         │            (Supabase PostgreSQL)              │
         │                                               │
         │  ┌──────────────────────────────────────┐    │
         │  │  simulations_enhanced                │    │
         │  │  - Phase 0 config                    │    │
         │  │  - Financial metrics                 │    │
         │  │  - Hidden metrics                    │    │
         │  │  - Final scores                      │    │
         │  └──────────────────────────────────────┘    │
         │                                               │
         │  ┌──────────────────────────────────────┐    │
         │  │  quarterly_results                   │    │
         │  │  decision_points                     │    │
         │  │  wildcard_events                     │    │
         │  │  tactics_used                        │    │
         │  │  talent_hires                        │    │
         │  │  big_bets                            │    │
         │  │  ab_test_results                     │    │
         │  └──────────────────────────────────────┘    │
         │                                               │
         │  ┌──────────────────────────────────────┐    │
         │  │  Views & Functions                   │    │
         │  │  - leaderboard_view                  │    │
         │  │  - industry_averages                 │    │
         │  │  - calculate_percentile()            │    │
         │  └──────────────────────────────────────┘    │
         └───────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### Simulation Lifecycle

```
┌─────────────┐
│   Phase 0   │  User defines strategic foundation
│   Setup     │  → Company name, industry, budget allocation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Strategy   │  User defines tactical approach
│  Session    │  → Target audience, positioning, channels
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     Q1      │  Foundation & Launch
│             │  → A/B test, tactics, wildcard
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     Q2      │  Optimization & Reaction
│             │  → Talent hire, wildcard, budget pivot
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     Q3      │  Scaling & Expansion
│             │  → Double down or diversify, wildcard
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     Q4      │  Final Push
│             │  → Big bet, final tactics
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Results   │  Final dashboard with scores
│  Dashboard  │  → Revenue, market share, ROI, grade
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Campaign   │  Deep analysis of decisions
│   Debrief   │  → Timeline, insights, recommendations
└─────────────┘
```

---

## 🔄 Quarter Processing Flow

```
User Submits Decisions
         │
         ▼
┌─────────────────────┐
│  Validate Decisions │
│  - Budget check     │
│  - Hours check      │
│  - Min requirements │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Calculate Results  │
│                     │
│  1. SEO Traffic     │◄─── Compounding from previous quarters
│     (Compounding)   │
│                     │
│  2. Paid Ads        │◄─── Diminishing returns curve
│     (Diminishing)   │
│                     │
│  3. Conversions     │◄─── A/B test impact (Q1)
│     (with modifiers)│
│                     │
│  4. Revenue         │◄─── Morale multiplier applied
│     (Morale-adjusted)│
│                     │
│  5. Wildcard Impact │◄─── Player's response choice
│     (Event response)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Update Metrics     │
│                     │
│  - Brand Equity     │◄─── Content quality, PR, satisfaction
│  - Team Morale      │◄─── Hours worked, training, crises
│  - Market Share     │◄─── Share of Voice model
│  - Market Saturation│◄─── Total market spend
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Save to Database   │
│  - Quarterly results│
│  - Decision points  │
│  - Tactics used     │
│  - Wildcard events  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Return New State   │
│  - Updated metrics  │
│  - Next quarter     │
└─────────────────────┘
```

---

## 🧮 Scoring Calculation Flow

```
Simulation Complete
         │
         ▼
┌─────────────────────────────────────────┐
│  Gather All Quarterly Data              │
│  - Revenue per quarter                  │
│  - Spend per quarter                    │
│  - Market share progression             │
│  - Brand equity evolution               │
│  - Team morale changes                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Calculate Final Metrics                │
│                                         │
│  Total Revenue = Σ(quarterly revenue)   │
│  Total Profit = Revenue - Budget Spent  │
│  ROI = (Profit / Budget Spent) × 100    │
│  Final Market Share = Last quarter      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Calculate Strategy Score Components    │
│                                         │
│  Market Share Score = Share × 1000      │
│  ROI Score = ROI × 100                  │
│  Brand Equity Score = Equity × 10       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Final Strategy Score                   │
│                                         │
│  Score = Market Share Score             │
│        + ROI Score                      │
│        + Brand Equity Score             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Assign Grade                           │
│  A+: 8000+                              │
│  A:  6000-7999                          │
│  B:  4000-5999                          │
│  C:  2000-3999                          │
│  D:  1000-1999                          │
│  F:  <1000                              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Generate Insights                      │
│  - Analyze strengths                    │
│  - Identify weaknesses                  │
│  - Create recommendations               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Calculate Percentile                   │
│  - Count simulations with lower scores  │
│  - Divide by total simulations          │
│  - Multiply by 100                      │
└─────────────────────────────────────────┘
```

---

## 🎯 Component Hierarchy

```
App
├── Layout
│   ├── Header (with auth)
│   └── Navigation
│
├── Landing Page (/)
│   └── Hero + Features
│
├── Auth Pages
│   ├── /login
│   └── /signup
│
├── Dashboard (/dashboard)
│   ├── Simulation List
│   ├── Stats Overview
│   └── Quick Actions
│
├── Simulation Flow (/sim)
│   │
│   ├── Setup (/sim/setup)
│   │   ├── Step 1: Company Name
│   │   ├── Step 2: Time Horizon
│   │   ├── Step 3: Industry
│   │   ├── Step 4: Company Profile
│   │   ├── Step 5: Market Landscape
│   │   └── Step 6: Budget Allocation
│   │
│   ├── Strategy (/sim/strategy)
│   │   ├── Target Audience
│   │   ├── Brand Positioning
│   │   └── Primary Channels
│   │
│   ├── Quarter 1 (/sim/q1)
│   │   ├── A/B Test Mini-Game
│   │   ├── Tactic Selection
│   │   ├── Wildcard Event
│   │   └── Results Preview
│   │
│   ├── Quarter 2 (/sim/q2)
│   │   ├── Talent Market
│   │   ├── Tactic Selection
│   │   ├── Wildcard Event
│   │   └── Budget Pivot Option
│   │
│   ├── Quarter 3 (/sim/q3)
│   │   ├── Double Down vs. Diversify
│   │   ├── Tactic Selection
│   │   ├── Wildcard Event
│   │   └── Results Preview
│   │
│   ├── Quarter 4 (/sim/q4)
│   │   ├── Big Bet Selection
│   │   ├── Final Tactics
│   │   └── Campaign Wrap-up
│   │
│   └── Debrief (/sim/debrief/[id])
│       ├── Score Overview
│       ├── Decision Timeline Tab
│       ├── Strategic Analysis Tab
│       ├── Comparison Tab
│       └── Export Options
│
└── Leaderboard (/leaderboard)
    ├── Filters (Industry, Time Horizon)
    ├── Rankings Table
    └── User Rank Highlight
```

---

## 🗄️ Database Schema Relationships

```
┌─────────────────────┐
│  auth.users         │
│  (Supabase Auth)    │
└──────────┬──────────┘
           │
           │ 1:1
           │
┌──────────▼──────────┐
│  profiles           │
│  - brand_theme      │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────────────┐
│  simulations_enhanced       │
│  - Phase 0 config           │
│  - Financial metrics        │
│  - Hidden metrics           │
│  - Final scores             │
└──────────┬──────────────────┘
           │
           ├─────────────┬─────────────┬─────────────┬─────────────┐
           │             │             │             │             │
           │ 1:N         │ 1:N         │ 1:N         │ 1:N         │ 1:N
           │             │             │             │             │
┌──────────▼────┐ ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐ ┌───▼───┐
│ quarterly_    │ │ decision_ │ │ wildcard_ │ │ tactics_  │ │talent_│
│ results       │ │ points    │ │ events    │ │ used      │ │hires  │
│               │ │           │ │           │ │           │ │       │
│ - Revenue     │ │ - Type    │ │ - Event   │ │ - Tactic  │ │- Role │
│ - Profit      │ │ - Impact  │ │ - Response│ │ - Spend   │ │- Bonus│
│ - Traffic     │ │ - Reason  │ │ - Impact  │ │ - Results │ │       │
└───────────────┘ └───────────┘ └───────────┘ └───────────┘ └───────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│  Row Level Security (RLS)               │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Users can only:                │   │
│  │  - View their own simulations   │   │
│  │  - Insert their own data        │   │
│  │  - Update their own records     │   │
│  │  - Delete their own content     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Public access to:              │   │
│  │  - Leaderboard (read-only)      │   │
│  │  - Achievements (read-only)     │   │
│  │  - Industry averages (read-only)│   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Authentication Flow                    │
│                                         │
│  1. User signs up/logs in               │
│  2. Supabase creates session            │
│  3. Session stored in httpOnly cookie   │
│  4. Middleware validates on each request│
│  5. Server components access user data  │
│  6. RLS policies enforce permissions    │
└─────────────────────────────────────────┘
```

---

## 🎨 State Management

```
┌─────────────────────────────────────────┐
│  Client State (React Hooks)             │
│                                         │
│  - UI state (loading, errors)           │
│  - Form inputs                          │
│  - Modal visibility                     │
│  - Tab selection                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Simulation State (XState + Hook)       │
│                                         │
│  - Current quarter                      │
│  - Budget remaining                     │
│  - Hidden metrics                       │
│  - Quarterly results                    │
│  - Decision history                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Persistent State (localStorage)        │
│                                         │
│  - In-progress simulation               │
│  - User preferences                     │
│  - Draft decisions                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Server State (Supabase)                │
│                                         │
│  - Completed simulations                │
│  - User profile                         │
│  - Leaderboard data                     │
│  - Historical results                   │
└─────────────────────────────────────────┘
```

---

## 🚀 Performance Optimizations

```
┌─────────────────────────────────────────┐
│  Frontend Optimizations                 │
│                                         │
│  ✓ Server Components (reduce JS)        │
│  ✓ Code splitting (lazy loading)        │
│  ✓ React.memo (prevent re-renders)      │
│  ✓ useMemo/useCallback (memoization)    │
│  ✓ Image optimization (Next.js)         │
│  ✓ Font optimization (next/font)        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Backend Optimizations                  │
│                                         │
│  ✓ Database indexes (fast queries)      │
│  ✓ Views (pre-aggregated data)          │
│  ✓ Connection pooling (Supabase)        │
│  ✓ RLS policies (security + speed)      │
│  ✓ Batch operations (reduce round trips)│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Caching Strategy                       │
│                                         │
│  ✓ Leaderboard (5 min cache)            │
│  ✓ Industry averages (1 hour cache)     │
│  ✓ Static pages (ISR)                   │
│  ✓ User simulations (SWR)               │
└─────────────────────────────────────────┘
```

---

## 📱 Responsive Design Breakpoints

```
Mobile First Approach

┌─────────────────────────────────────────┐
│  Mobile (< 768px)                       │
│  - Single column layout                 │
│  - Stacked cards                        │
│  - Simplified navigation                │
│  - Touch-optimized buttons              │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Tablet (768px - 1024px)                │
│  - Two column layout                    │
│  - Side-by-side comparisons             │
│  - Expanded navigation                  │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Desktop (> 1024px)                     │
│  - Three+ column layout                 │
│  - Full dashboard views                 │
│  - Hover interactions                   │
│  - Keyboard shortcuts                   │
└─────────────────────────────────────────┘
```

---

## 🔄 Deployment Pipeline

```
Developer
    │
    │ git push
    │
    ▼
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │
       │ webhook
       │
       ▼
┌─────────────┐
│   Vercel    │
│   Build     │
│             │
│  1. Install │
│  2. Build   │
│  3. Test    │
│  4. Deploy  │
└──────┬──────┘
       │
       │ deploy
       │
       ▼
┌─────────────┐
│  Production │
│   (Edge)    │
│             │
│  - Next.js  │
│  - Assets   │
│  - API      │
└──────┬──────┘
       │
       │ connects to
       │
       ▼
┌─────────────┐
│  Supabase   │
│  (Database) │
│             │
│  - Auth     │
│  - Data     │
│  - Storage  │
└─────────────┘
```

---

This architecture provides:
- ✅ **Scalability**: Handle thousands of concurrent users
- ✅ **Performance**: Fast load times, smooth interactions
- ✅ **Security**: RLS policies, auth middleware
- ✅ **Maintainability**: Modular code, clear separation
- ✅ **Extensibility**: Easy to add new features
- ✅ **Reliability**: Error handling, validation
- ✅ **Developer Experience**: Type-safe, well-documented

Ready for production! 🚀
