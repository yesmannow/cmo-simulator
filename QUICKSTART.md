# CMO Simulator - Quick Start Guide

Get the enhanced CMO Simulator running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git

## Step 1: Clone & Install (2 minutes)

```bash
cd cmo-simulator
npm install
```

## Step 2: Supabase Setup (3 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database to initialize

### Run Schema
1. Open SQL Editor in Supabase dashboard
2. Copy contents of `supabase-schema-enhanced.sql`
3. Paste and run
4. Verify tables created (check Table Editor)

### Get Credentials
1. Go to Project Settings → API
2. Copy `Project URL`
3. Copy `anon public` key

## Step 3: Environment Setup (1 minute)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Run Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Flow (3 minutes)

### Quick Test Path
1. **Sign Up**: Create account at `/signup`
2. **Setup**: Go to `/sim/setup`
   - Name your company
   - Choose 1-Year Sprint
   - Pick E-commerce
   - Select Startup
   - Choose Open Frontier
   - Allocate budget (any split)
3. **Strategy**: Define audience and positioning
4. **Q1**: Run through first quarter
5. **View Results**: See your dashboard

## Key Files to Understand

### Core Logic
- `src/lib/scoringEngine.ts` - All the math
- `src/lib/simulationEngine.ts` - Orchestration
- `src/lib/advancedWildcards.ts` - Event system

### UI Components
- `src/app/sim/setup/page.tsx` - Phase 0 setup
- `src/components/ABTestMiniGame.tsx` - A/B test
- `src/app/sim/debrief/[id]/page.tsx` - Analysis

### Hooks
- `src/hooks/useEnhancedSimulation.ts` - Main simulation hook
- `src/hooks/useSimulation.ts` - Legacy hook (still used)

## Common Issues & Fixes

### Issue: "Supabase client error"
**Fix**: Check your `.env.local` file has correct credentials

### Issue: "Table does not exist"
**Fix**: Run `supabase-schema-enhanced.sql` in Supabase SQL editor

### Issue: "Auth error"
**Fix**: Make sure you're signed in. Check Supabase Auth settings allow email signups.

### Issue: "Build errors"
**Fix**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Making Changes

1. **Modify Scoring Logic**
   - Edit `src/lib/scoringEngine.ts`
   - Test with console.log in simulation
   - Verify math makes sense

2. **Add New Wildcard Event**
   - Edit `src/lib/advancedWildcards.ts`
   - Add to appropriate array (COMPETITIVE_EVENTS, etc.)
   - Test by triggering in Q2

3. **Customize UI**
   - Components use shadcn/ui
   - Styling with Tailwind CSS
   - Animations with Framer Motion

### Testing

```bash
# Run type checking
npm run lint

# Build for production
npm run build

# Test production build locally
npm run start
```

## Customization Ideas

### Easy Customizations (30 min each)

1. **Add New Industry**
   - Update `INDUSTRIES` in `setup/page.tsx`
   - Add industry-specific A/B tests
   - Adjust scoring factors

2. **New Time Horizon**
   - Add to `TIME_HORIZONS` in `setup/page.tsx`
   - Update budget map in `simulationEngine.ts`

3. **Custom Theme**
   - Add to `BrandPicker.tsx`
   - Define CSS variables in `globals.css`

### Medium Customizations (2-4 hours each)

1. **New Wildcard Event Category**
   - Create event array in `advancedWildcards.ts`
   - Add trigger logic in `simulationEngine.ts`
   - Update UI to display

2. **Advanced Analytics Dashboard**
   - Create new page in `app/analytics/`
   - Query Supabase views
   - Add charts with Recharts

3. **Achievement System**
   - Use existing achievements schema
   - Create achievement checker
   - Display badges in profile

### Advanced Customizations (1-2 days each)

1. **PDF Report Generation**
   - Set up Vercel Edge Function
   - Use Puppeteer to render HTML
   - Generate branded PDF

2. **Multiplayer Mode**
   - Real-time with Supabase Realtime
   - Shared market simulation
   - Live leaderboard updates

3. **AI Competitor**
   - Train model on player decisions
   - Dynamic difficulty adjustment
   - Realistic competitor behavior

## Deployment

### Deploy to Vercel (5 minutes)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Post-Deployment Checklist

- [ ] Test signup/login flow
- [ ] Complete one full simulation
- [ ] Check leaderboard loads
- [ ] Verify debrief page works
- [ ] Test on mobile device

## Next Steps

### Learn the System
1. Read `IMPLEMENTATION_GUIDE.md` for deep dive
2. Review `VALUE_PROPOSITION.md` for context
3. Study scoring formulas in `scoringEngine.ts`

### Enhance the Experience
1. Add tutorial/onboarding flow
2. Implement email notifications
3. Create social sharing features
4. Build mobile app version

### Scale the Platform
1. Add more industries
2. Create custom scenarios
3. Build certification program
4. Launch multiplayer tournaments

## Getting Help

### Documentation
- **Implementation Guide**: Technical deep dive
- **Value Proposition**: Why this matters
- **README**: Feature overview

### Community
- Open issues on GitHub
- Join Discord (coming soon)
- Follow development blog

### Support
- Check existing issues first
- Provide error messages
- Include browser/OS info
- Share reproduction steps

## Pro Tips

### Performance
- Use React.memo for chart components
- Lazy load debrief page
- Cache leaderboard data
- Index database queries

### User Experience
- Add loading states everywhere
- Provide helpful error messages
- Save progress automatically
- Allow resuming simulations

### Marketing
- Share on Product Hunt
- Post in marketing communities
- Create demo video
- Write case studies

## Success Metrics

Track these to measure impact:

### Engagement
- Completion rate (target: >60%)
- Average session time (target: >30 min)
- Repeat simulations (target: >2 per user)

### Learning
- Score improvement (target: +20% by 3rd sim)
- A/B test accuracy (target: >70%)
- Debrief engagement (target: >80% view)

### Growth
- New signups per week
- Social shares
- Referral rate
- Return rate (7-day, 30-day)

## Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reset node_modules
rm -rf node_modules package-lock.json && npm install

# Check TypeScript errors
npx tsc --noEmit

# Test Supabase connection
node -e "const { createClient } = require('@supabase/supabase-js'); const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); supabase.from('profiles').select('count').then(console.log);"
```

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Learning
- [XState Docs](https://xstate.js.org/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

### Inspiration
- Marketing simulation games
- Educational game design
- Gamification principles

---

**You're ready to build!** 🚀

Start with the quick test path, then dive into customizations. The codebase is well-documented and modular—perfect for learning and extending.

Questions? Open an issue or check the docs.
