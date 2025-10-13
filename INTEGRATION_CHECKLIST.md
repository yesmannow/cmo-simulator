# CMO Simulator - Integration Checklist

Use this checklist to integrate the enhanced features into your existing app.

## ✅ Phase 1: Database Setup

### 1.1 Run Enhanced Schema
- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `supabase-schema-enhanced.sql`
- [ ] Run the SQL script
- [ ] Verify tables created in Table Editor:
  - [ ] `simulations_enhanced`
  - [ ] `quarterly_results`
  - [ ] `decision_points`
  - [ ] `wildcard_events`
  - [ ] `tactics_used`
  - [ ] `talent_hires`
  - [ ] `big_bets`
  - [ ] `ab_test_results`
- [ ] Check views created:
  - [ ] `leaderboard_view`
  - [ ] `industry_averages`
  - [ ] `user_statistics`
- [ ] Verify RLS policies active

### 1.2 Test Database Connection
```bash
# Test query from terminal
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
supabase.from('simulations_enhanced').select('count').then(console.log);
"
```
- [ ] Query returns successfully
- [ ] No permission errors

---

## ✅ Phase 2: Core Files Integration

### 2.1 Add New Library Files
Files to add (already created):
- [ ] `src/lib/scoringEngine.ts`
- [ ] `src/lib/simulationEngine.ts`
- [ ] `src/lib/advancedWildcards.ts`

Verify imports work:
```typescript
import { calculateFinalScore } from '@/lib/scoringEngine';
import { initializeSimulation } from '@/lib/simulationEngine';
import { generateWildcardEvent } from '@/lib/advancedWildcards';
```

### 2.2 Add New Components
- [ ] `src/components/ABTestMiniGame.tsx`

Test component renders:
```typescript
import ABTestMiniGame from '@/components/ABTestMiniGame';
// Use in a page to verify
```

### 2.3 Add New Hooks
- [ ] `src/hooks/useEnhancedSimulation.ts`

Test hook works:
```typescript
import { useEnhancedSimulation } from '@/hooks/useEnhancedSimulation';
// Use in a component
```

### 2.4 Add New Pages
- [ ] `src/app/sim/setup/page.tsx` (Phase 0 setup)
- [ ] `src/app/sim/debrief/[simulationId]/page.tsx` (Campaign debrief)

Test routes accessible:
- [ ] `/sim/setup` loads
- [ ] `/sim/debrief/test-id` loads (may show "not found" - that's ok)

---

## ✅ Phase 3: Update Existing Files

### 3.1 Update Simulation Flow

**File**: `src/app/sim/page.tsx`
- [ ] Add link to `/sim/setup` as entry point
- [ ] Update flow: Setup → Strategy → Q1 → Q2 → Q3 → Q4 → Debrief

**File**: `src/app/sim/q1/page.tsx`
- [ ] Integrate `ABTestMiniGame` component
- [ ] Capture A/B test result
- [ ] Pass to simulation state

Example integration:
```typescript
const [abTestComplete, setAbTestComplete] = useState(false);
const [abTestResult, setAbTestResult] = useState(null);

{!abTestComplete ? (
  <ABTestMiniGame
    industry={simulation.industry}
    onComplete={(result) => {
      setAbTestResult(result);
      setAbTestComplete(true);
    }}
  />
) : (
  // Show tactics selection
)}
```

### 3.2 Update State Management

**File**: `src/lib/simMachine.ts` (if using XState)
- [ ] Add Phase 0 setup state
- [ ] Add company name to context
- [ ] Add budget allocation to context
- [ ] Add hidden metrics (brandEquity, teamMorale)

Or use the new hook:
```typescript
// Replace existing simulation logic with:
import { useEnhancedSimulation } from '@/hooks/useEnhancedSimulation';

const {
  state,
  startSimulation,
  submitQuarterDecisions,
  completeSimulation
} = useEnhancedSimulation();
```

### 3.3 Update Dashboard

**File**: `src/app/dashboard/page.tsx`
- [ ] Query `simulations_enhanced` instead of `simulations`
- [ ] Display company name
- [ ] Show strategy score
- [ ] Link to debrief page

Example query:
```typescript
const { data: simulations } = await supabase
  .from('simulations_enhanced')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### 3.4 Update Leaderboard

**File**: `src/app/leaderboard/page.tsx`
- [ ] Query `leaderboard_view` instead of direct table
- [ ] Add filters for industry, time horizon
- [ ] Display company name
- [ ] Show strategy score

Example query:
```typescript
const { data: leaderboard } = await supabase
  .from('leaderboard_view')
  .select('*')
  .order('strategy_score', { ascending: false })
  .limit(100);
```

---

## ✅ Phase 4: Testing

### 4.1 Unit Tests
- [ ] Test scoring functions
  ```bash
  # Create test file
  # src/lib/scoringEngine.test.ts
  ```
- [ ] Test market share calculation
- [ ] Test SEO compounding
- [ ] Test paid ads diminishing returns
- [ ] Test brand equity updates
- [ ] Test morale updates

### 4.2 Integration Tests
- [ ] Test simulation initialization
- [ ] Test quarter processing
- [ ] Test wildcard event generation
- [ ] Test final score calculation
- [ ] Test database saves

### 4.3 E2E User Flow
- [ ] Sign up new account
- [ ] Complete Phase 0 setup
- [ ] Run through Q1 (with A/B test)
- [ ] Handle wildcard in Q2
- [ ] Complete Q3 and Q4
- [ ] View final results
- [ ] Access debrief page
- [ ] See entry on leaderboard
- [ ] Start second simulation

### 4.4 Edge Cases
- [ ] Budget validation (can't overspend)
- [ ] Team hours validation (can't overwork)
- [ ] Negative revenue scenarios
- [ ] Market share bounds (0-100%)
- [ ] Hidden metrics bounds (0-100)
- [ ] Browser refresh during simulation
- [ ] Network errors during save

---

## ✅ Phase 5: UI/UX Polish

### 5.1 Loading States
- [ ] Add loading spinner to setup page
- [ ] Add loading to quarter processing
- [ ] Add loading to debrief generation
- [ ] Add skeleton loaders to leaderboard

### 5.2 Error Handling
- [ ] Display validation errors clearly
- [ ] Show network error messages
- [ ] Handle auth errors gracefully
- [ ] Provide retry mechanisms

### 5.3 Animations
- [ ] Smooth transitions between steps
- [ ] Animate score reveals
- [ ] Animate chart updates
- [ ] Add confetti on completion (optional)

### 5.4 Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Fix any layout issues

---

## ✅ Phase 6: Performance Optimization

### 6.1 Code Splitting
- [ ] Lazy load debrief page
- [ ] Lazy load chart components
- [ ] Dynamic import heavy libraries

Example:
```typescript
const ABTestMiniGame = dynamic(() => import('@/components/ABTestMiniGame'), {
  loading: () => <LoadingSpinner />
});
```

### 6.2 Database Optimization
- [ ] Verify indexes exist (check schema)
- [ ] Test query performance
- [ ] Add caching for leaderboard
- [ ] Batch insert decision points

### 6.3 Bundle Size
- [ ] Check bundle size: `npm run build`
- [ ] Optimize images
- [ ] Remove unused dependencies
- [ ] Tree-shake libraries

---

## ✅ Phase 7: Documentation

### 7.1 Code Comments
- [ ] Add JSDoc comments to scoring functions
- [ ] Document complex algorithms
- [ ] Explain magic numbers
- [ ] Add usage examples

### 7.2 User Documentation
- [ ] Create in-app tutorial (optional)
- [ ] Add tooltips to complex features
- [ ] Write FAQ section
- [ ] Create video walkthrough (optional)

### 7.3 Developer Documentation
- [ ] Update README with new features
- [ ] Document API endpoints (if any)
- [ ] Create architecture diagram
- [ ] Write contribution guide

---

## ✅ Phase 8: Deployment

### 8.1 Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No ESLint errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables set in Vercel
- [ ] Database migrations run in production

### 8.2 Deploy to Vercel
- [ ] Push to GitHub
- [ ] Import project in Vercel
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deploy
- [ ] Test production URL

### 8.3 Post-Deployment Testing
- [ ] Sign up works
- [ ] Login works
- [ ] Complete full simulation
- [ ] Leaderboard loads
- [ ] Debrief accessible
- [ ] Mobile experience good

### 8.4 Monitoring
- [ ] Set up error tracking (Sentry, optional)
- [ ] Monitor Supabase usage
- [ ] Check Vercel analytics
- [ ] Track completion rates

---

## ✅ Phase 9: Launch Preparation

### 9.1 Content
- [ ] Write launch announcement
- [ ] Create demo video
- [ ] Take screenshots
- [ ] Write social media posts
- [ ] Prepare Product Hunt launch (optional)

### 9.2 SEO
- [ ] Add meta tags to pages
- [ ] Create sitemap
- [ ] Add Open Graph images
- [ ] Write compelling page titles

### 9.3 Analytics
- [ ] Set up Google Analytics (optional)
- [ ] Track key events:
  - [ ] Simulation started
  - [ ] Simulation completed
  - [ ] Debrief viewed
  - [ ] Shared on social

---

## ✅ Phase 10: Post-Launch

### 10.1 Gather Feedback
- [ ] Add feedback form
- [ ] Monitor user behavior
- [ ] Track completion rates
- [ ] Identify drop-off points

### 10.2 Iterate
- [ ] Fix critical bugs
- [ ] Improve confusing UX
- [ ] Add requested features
- [ ] Optimize performance

### 10.3 Marketing
- [ ] Share on LinkedIn
- [ ] Post in marketing communities
- [ ] Write blog post
- [ ] Create case studies

---

## 🎯 Quick Integration Path

If you want to integrate quickly, follow this minimal path:

### Minimal Integration (2-4 hours)
1. ✅ Run database schema
2. ✅ Add scoring engine file
3. ✅ Add simulation engine file
4. ✅ Add setup page
5. ✅ Update one quarter page with A/B test
6. ✅ Test end-to-end flow
7. ✅ Deploy

### Full Integration (1-2 days)
1. ✅ All minimal steps
2. ✅ Add all wildcard events
3. ✅ Add debrief page
4. ✅ Update leaderboard
5. ✅ Add all documentation
6. ✅ Polish UI/UX
7. ✅ Comprehensive testing
8. ✅ Deploy and launch

---

## 🐛 Common Issues & Solutions

### Issue: TypeScript errors in new files
**Solution**: 
```bash
npm install --save-dev @types/node
```

### Issue: Supabase types not matching
**Solution**: Regenerate types
```bash
npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

### Issue: Build fails with "Module not found"
**Solution**: Check import paths use `@/` alias correctly

### Issue: Simulation state not persisting
**Solution**: Check localStorage is enabled, verify JSON serialization

### Issue: Leaderboard not updating
**Solution**: Check RLS policies, verify view permissions

---

## 📊 Success Metrics

Track these after integration:

### Technical Metrics
- [ ] Build time < 2 minutes
- [ ] Page load time < 2 seconds
- [ ] No console errors
- [ ] Lighthouse score > 90

### User Metrics
- [ ] Completion rate > 60%
- [ ] Average session time > 30 minutes
- [ ] Repeat simulations > 2 per user
- [ ] Debrief engagement > 80%

### Business Metrics
- [ ] 100+ simulations in first week
- [ ] 1000+ simulations in first month
- [ ] Featured in 3+ communities
- [ ] 10+ positive testimonials

---

## 🎉 You're Done!

Once you've checked off all items, you have:
- ✅ A fully functional CMO Simulator
- ✅ Complex, realistic marketing math
- ✅ Educational A/B testing
- ✅ Dynamic wildcard events
- ✅ Comprehensive debrief system
- ✅ Competitive leaderboard
- ✅ Production-ready deployment

**Congratulations!** You've built an impressive portfolio piece that demonstrates:
- Full-stack development
- Complex systems thinking
- Educational design
- Product management
- Marketing expertise

Now go showcase it! 🚀
