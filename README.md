# CMO Simulator

An advanced, educational marketing strategy game built with Next.js 15. The **CMO Simulator** is a powerful, interactive Chief Marketing Officer simulation tool designed to teach advanced marketing strategy, complex systems thinking, and resource allocation. Assume the role of a CMO, navigating a 12-month campaign with realistic challenges, strategic decisions, and complex market dynamics where you're accountable to the CEO, CFO, and your team.

## 🌟 Comprehensive Overview

The CMO Simulator acts as a digital twin "sandbox" where players deploy marketing budgets across various channels, balancing growth, profitability, and team morale. It integrates realistic marketing math (diminishing returns, compounding effects, tactic synergy, and adstock/marketing carryover effects) into a gamified educational experience. Players must navigate market shifts, manage internal crises via an adaptive crisis engine, and optimize their strategy tech tree to build a resilient and highly effective marketing engine.

## 🎮 What Makes This Special

The CMO Simulator is not just another portfolio project—it's a comprehensive learning platform that demonstrates:

- **Complex Systems Thinking**: Realistic marketing math with compounding effects, diminishing returns, and hidden metrics
- **Educational Design**: Learn by doing through consequences, not lectures
- **Full-Stack Mastery**: Next.js 15, Supabase, TypeScript, advanced state management
- **Game Design**: Engaging mechanics that make learning marketing strategy fun
- **Strategic Depth**: Multiple paths to success, no single "correct" strategy

## 🛠️ Simulation Features & Tools

### 📈 Advanced Scoring & Simulation Engine
- **Hidden Metrics**: Brand Equity and Team Morale affect all outcomes.
- **Compounding Growth & Adstock**: SEO investments grow exponentially, while marketing carryover (Adstock) ensures past campaigns continue affecting the present.
- **Tactic Synergy**: Deploying complementary tactics (e.g., Performance marketing immediately following Brand Awareness flights) reveals powerful synergy multipliers.
- **Diminishing Returns**: Paid ads saturate with increased spend.
- **Share of Voice Model**: Market share is dynamically calculated based on competitive spending.
- **Multiple Success Paths**: Win through growth, efficiency, or brand building.

### 🤖 "Board of Directors" AI & Constraints
The game enforces strategic balance through three pressure meters:
- **CEO (Growth Focus)**: Demands increasing market share and bolder category creation.
- **CFO (Profit Focus)**: Demands high MROI, low CAC, and tight financial margins.
- **CMO / Team (Sanity Focus)**: Demands stable workloads and skill alignment to prevent burnout.
*Dropping any meter to zero triggers a "Board Meeting" defense event.*

### 🔮 Interactive Holographic Tooltips
- Discover deeper marketing insights and contextual information through beautifully animated, glassmorphism-styled global tooltips attached to tactical nodes and key metrics across the War Room and KPI dashboard.

### ⚡ The Crisis Engine (Adaptive Difficulty)
The simulator detects if your strategy is becoming too comfortable and unleashes randomized constraints:
- **Supply Chain Shocks**: Inventory drops, forcing a pivot in messaging.
- **Customer data incident**: Sensitive data exposure drives scrutiny; trust drops until comms, legal, and security responses align.
- **Competitor Price Wars**: Triggers a new Nash Equilibrium where total market value shrinks.
- **Dynamic Wildcard Events**: Context-aware events based on your industry, market landscape, and performance (e.g. key resignations, website outages, press features).

### 🧬 Strategy Tech Tree (MarTech Stack)
- Upgrade infrastructure (e.g., AI Personalization) via capital investments that yield permanent conversion multipliers, teaching the trade-off between operating expenses and capital investments.
- **Hiring vs. Outsourcing**: Balance fixed vs. variable costs by bringing talent in-house versus hiring agencies.

### 🧪 Digital Twin "Sandbox" & A/B Testing
- **Synthetic Personas**: Dry-run limited budgets and view localized CTR reactions before blindly spending millions (teaching Agile Marketing).
- **A/B Test Mini-Game**: Choose between ad variations, learn why one performs better, and see the real impact on campaign metrics (±25% CPA, ±35% conversions). Industry-specific tests included.

### 🏢 Phase 0: Strategic Foundation
- **Company Naming**: Personalize your venture
- **Time Horizon Selection**: 1-year sprint, 3-year growth, or 5-year long game
- **Industry Choice**: Healthcare, Legal Services, or E-commerce
- **Market Landscape**: Choose your battlefield (Disruptor, Crowded Field, or Open Frontier)
- **Budget Allocation**: Strategic distribution across Brand Awareness, Lead Generation, and Conversion Optimization

### 📊 Tactical Data & Visualizations
- **Sonar Radar (Perceptual Mapping)**: Displays your brand's position relative to the customer's "Ideal Point".
- **Risk Indicator Slider**: Adjust brand aggression vs. margin stability, which feeds directly into the Stochastic probability engine.
- **Campaign Debrief**: Post-simulation analysis with deep insights, decision timelines, and educational feedback. Includes downloadable PDF reports.
- **Leaderboards**: Global rankings by Strategy Score with percentile rankings and industry benchmarks.

### 🎨 Theme System ✅
- 5 beautiful brand themes (Aurora Tech, Heritage Serif, Clinic Clean, Forest Nature, Sunset Warm)
- CSS custom properties for dynamic theming
- Theme persistence to user profiles

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `supabase-schema-enhanced.sql` in your Supabase SQL editor
3. This will create:
   - `profiles` table for user theme preferences
   - `simulations_enhanced` table with all Phase 0 variables
   - `quarterly_results` for performance tracking
   - `decision_points` for Campaign Debrief
   - `wildcard_events`, `tactics_used`, `talent_hires`, `big_bets`, `ab_test_results`
   - Row Level Security policies
   - Views for leaderboard and analytics
   - Functions for percentile calculation

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) to see the application.

## Project Structure

```
src/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── login/             # Authentication login page
│   ├── signup/            # User registration page
│   ├── globals.css        # Global styles with theme variables
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── BrandPicker.tsx    # Theme selection component
│   └── LogoutButton.tsx   # Authentication logout
├── lib/
│   └── supabase/          # Supabase client configurations
│       ├── client.ts      # Browser client
│       ├── server.ts      # Server client
│       └── middleware.ts  # Auth middleware
└── middleware.ts          # Next.js middleware for route protection
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router & Turbopack
- **Language**: TypeScript with full type safety
- **Authentication**: Supabase Auth with SSR sessions
- **Database**: Supabase PostgreSQL with Row Level Security
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animation**: Framer Motion for smooth transitions
- **State Management**: XState for simulation state machine
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── app/
│   ├── sim/
│   │   ├── setup/              # Phase 0: Company setup
│   │   ├── strategy/           # Strategy session
│   │   ├── q1/ q2/ q3/ q4/    # Quarterly gameplay
│   │   ├── debrief/[id]/      # Campaign analysis
│   │   └── page.tsx           # Simulation hub
│   ├── dashboard/             # User dashboard
│   ├── leaderboard/           # Global rankings
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── ABTestMiniGame.tsx     # A/B test component
│   ├── BrandPicker.tsx        # Theme selector
│   └── ...
├── lib/
│   ├── scoringEngine.ts       # Complex scoring math
│   ├── advancedWildcards.ts   # Dynamic events
│   ├── simMachine.ts          # XState state machine
│   ├── tactics.ts             # Marketing tactics library
│   ├── talentMarket.ts        # Hiring system
│   ├── database/              # Supabase utilities
│   └── supabase/              # Auth & client setup
└── types/                     # TypeScript definitions
```

## 🎓 Educational Philosophy

The CMO Simulator teaches marketing strategy through:

1. **Experiential Learning**: Learn by doing, see immediate consequences
2. **Strategic Trade-offs**: Every decision has pros and cons
3. **Multiple Paths**: No single "correct" strategy - win through growth, efficiency, or brand building
4. **Contextual Education**: Insights appear when relevant, not as lectures
5. **Progressive Complexity**: Start simple (Q1), build to advanced strategy (Q4)

### Key Marketing Concepts Taught

- **Share of Voice**: How spending relative to competitors determines market share
- **Compounding Growth**: Why SEO/content investments grow exponentially
- **Diminishing Returns**: How paid ads become less efficient at scale
- **Brand Equity**: The long-term value of brand building
- **Creative Testing**: Why some ads outperform others
- **Strategic Response**: How to handle competitive threats and opportunities
- **Resource Allocation**: Balancing short-term gains vs. long-term value

## 📚 Documentation

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)**: Comprehensive technical guide
- **[supabase-schema-enhanced.sql](./supabase-schema-enhanced.sql)**: Complete database schema
- **README.md** (this file): Quick start and overview

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### Cloudflare Pages Deployment

This project is configured for deployment to Cloudflare Pages using the **OpenNext adapter** (`@opennextjs/cloudflare`), NOT the default `@cloudflare/next-on-pages` package.

> ⚠️ **Important:** Do NOT use the default "Next.js" framework preset settings in Cloudflare Pages. The default preset uses `@cloudflare/next-on-pages` with a different build output directory. This project requires the OpenNext adapter settings below.

**Cloudflare Pages Dashboard Build Configuration:**

| Setting | Value |
|---------|-------|
| **Framework preset** | `None` |
| **Build command** | `npx opennextjs-cloudflare build` |
| **Build output directory** | `.open-next` |
| **Root directory** | `/` (leave default) |

**Compatibility Flags (Required):**
- Navigate to: Settings → Functions → Compatibility flags
- Add `nodejs_compat` for **both** Production and Preview environments

**Steps:**
1. Connect your GitHub repository to Cloudflare Pages
2. **Framework preset**: Select "None"
3. **Build command**: Set to `npx opennextjs-cloudflare build`
4. **Build output directory**: Set to `.open-next`
5. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. In Settings → Functions → Compatibility flags, add `nodejs_compat` for both production and preview
7. (Optional) Enable build comments in Settings → Builds & deployments to get build status and preview links on pull requests
8. Deploy!

For more information, see the [OpenNext Cloudflare documentation](https://opennext.js.org/cloudflare/get-started).

## 🎯 Roadmap

### Current Phase: Core Simulation ✅
- [x] Phase 0 setup with company naming
- [x] Advanced scoring engine
- [x] A/B test mini-game
- [x] Dynamic wildcard events
- [x] Campaign debrief
- [x] Leaderboard system

### Next Phase: Enhanced Features
- [ ] PDF report generation (Puppeteer)
- [ ] Email automation (n8n.io or Zapier)
- [ ] Social sharing with Open Graph images
- [ ] Achievement system integration
- [ ] Tutorial/onboarding flow
- [ ] Mobile optimization

### Future Phases
- [ ] Multiplayer mode (compete in real-time)
- [ ] Custom industries
- [ ] AI-powered competitors
- [ ] Advanced analytics dashboard
- [ ] Certification program
- [ ] API for data export

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Open an issue or reach out.

## 📄 License

MIT License - feel free to use this as inspiration for your own projects.

## 🙏 Acknowledgments

Built with modern web technologies and inspired by the need for practical marketing education through gamification.

---

**Built by [Your Name]** | [Portfolio](your-portfolio-url) | [LinkedIn](your-linkedin) | [Twitter](your-twitter)
