# CMO Simulator - Implementation Guide

## Overview

The CMO Simulator is a comprehensive, educational marketing strategy game that puts players in the role of a Chief Marketing Officer. This guide explains how all the enhanced features work together to create a unique, engaging experience.

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Animation**: Framer Motion for smooth transitions
- **State Management**: XState for simulation state machine
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts for data visualization

### Key Features
1. **Phase 0 Setup** - Company naming, strategic foundation
2. **Complex Scoring Engine** - Hidden metrics, compounding effects, diminishing returns
3. **A/B Test Mini-Game** - Educational creative testing
4. **Dynamic Wildcard Events** - Context-aware market events
5. **Campaign Debrief** - Post-simulation analysis with decision timeline
6. **Leaderboard** - Competitive scoring across industries

## Core Systems

### 1. Scoring Engine (`src/lib/scoringEngine.ts`)

The scoring engine implements realistic marketing math:

#### Hidden Metrics
- **Brand Equity** (0-100): Increases with quality content, PR, customer satisfaction. Decays 5% per quarter if not maintained. Provides conversion rate multiplier.
- **Team Morale** (0-100): Affected by workload, training, successes, and crises. Low morale applies steep penalties to all outputs.

#### Key Formulas

**Market Share (Share of Voice Model)**:
```typescript
shareOfVoice = yourSpend / (yourSpend + competitorSpend)
targetShare = shareOfVoice * brandMultiplier * 100
newShare = (previousShare * 0.3) + (targetShare * 0.7) // 30% inertia
```

**SEO/Content (Compounding Growth)**:
```typescript
// Each quarter's investment compounds at 15% per quarter
compoundedTraffic = baseTraffic * Math.pow(1.15, quartersActive)
```

**Paid Ads (Diminishing Returns)**:
```typescript
// Effectiveness drops with increased spend (market saturation)
spendEfficiency = Math.log10(spend + 1) / Math.log10(spend + 10000)
effectiveSpend = spend * saturationPenalty * spendEfficiency
```

**Final Strategy Score**:
```typescript
strategyScore = (finalMarketShare * 1000) + (roi * 100) + (brandEquity * 10)
```

This weighted formula ensures multiple paths to success:
- **Market Share Focus**: Aggressive growth, high spend
- **ROI Focus**: Lean efficiency, smart tactics
- **Brand Focus**: Long-term equity building

### 2. Phase 0 Setup (`src/app/sim/setup/page.tsx`)

Six-step onboarding that defines the entire simulation:

#### Step 1: Company Name
- Player names their company
- Used throughout simulation for personalization

#### Step 2: Time Horizon
- **1-Year Sprint**: $500K budget, aggressive tactics, high risk
- **3-Year Growth**: $1M budget, balanced approach, moderate risk
- **5-Year Long Game**: $2M budget, brand building, lower risk

#### Step 3: Industry
- **Healthcare**: High customer value ($5K), long sales cycle
- **Legal**: Very high value ($8K), very long cycle
- **E-commerce**: Low value ($150), short cycle, high competition

#### Step 4: Company Profile
- **Startup**: Lean, agile, limited resources
- **Enterprise**: Large budget, brand equity, slower decisions

#### Step 5: Market Landscape
- **The Disruptor**: vs. 1 large incumbent (5x budget)
- **The Crowded Field**: vs. many startups (3x total budget)
- **The Open Frontier**: New market (1.2x budget), low awareness

#### Step 6: Budget Allocation
Three strategic buckets (must sum to 100%):
- **Brand Awareness** (Top of Funnel): Content, SEO, Social Presence
- **Lead Generation** (Mid-Funnel): Google Ads, Social Ads, Webinars
- **Conversion Optimization** (Bottom of Funnel): A/B Testing, CRO, Website

### 3. A/B Test Mini-Game (`src/components/ABTestMiniGame.tsx`)

Educational component that teaches marketing principles:

#### How It Works
1. Player sees two ad variations (A and B)
2. Must choose which will perform better
3. Receives immediate feedback with explanation
4. Choice impacts campaign performance:
   - **Correct**: -25% CPA, +35% conversions
   - **Incorrect**: +15% CPA, -20% conversions

#### Educational Value
Each test includes:
- **Context**: Why this scenario matters
- **Explanation**: Why one ad wins
- **Marketing Principle**: Underlying strategic insight
- **Impact**: Real numbers showing consequences

Example principles taught:
- Benefits > Features
- Match message to intent
- Address objections directly
- Context matters (seasonal, audience)

### 4. Wildcard Events (`src/lib/advancedWildcards.ts`)

Dynamic events that force strategic response:

#### Event Types

**Competitive Events**:
- Price wars
- Viral competitor campaigns
- Market consolidation/acquisitions

**Market Shifts**:
- Privacy regulations
- Category trending
- Economic downturns

**Internal Crises**:
- Website outages
- Key employee resignations
- PR crises

**Opportunities**:
- Strategic partnerships
- Major press features
- Unexpected market openings

#### Event Structure
Each event includes:
- **3 Response Choices**: Different risk/reward profiles
- **Immediate Impact**: Revenue, market share, morale, brand equity
- **Long-term Effects**: Lasting strategic implications
- **Educational Context**: Why this matters
- **Reasoning**: Why each choice has its effects

### 5. Campaign Debrief (`src/app/sim/debrief/[simulationId]/page.tsx`)

Post-simulation analysis tool:

#### Features

**Decision Timeline**:
- Every strategic choice visualized
- Impact metrics for each decision
- Color-coded outcomes (positive/negative/neutral)
- "What if?" alternative outcomes
- Educational reasoning

**Strategic Analysis**:
- Strengths: What you did well
- Weaknesses: Areas for improvement
- Recommendations: Actionable next steps

**Comparison**:
- Your percentile vs. all players
- Industry averages
- Performance summary

**Export Options**:
- Download PDF report
- Share results
- Save to dashboard

### 6. Database Schema (`supabase-schema-enhanced.sql`)

Comprehensive data model:

#### Core Tables

**simulations_enhanced**:
- All Phase 0 variables
- Financial metrics
- Hidden metrics (brand equity, morale)
- Final KPIs and scoring

**quarterly_results**:
- Per-quarter performance
- Traffic sources breakdown
- Metric changes

**decision_points**:
- Every strategic decision
- Impact tracking
- Educational content
- For debrief analysis

**wildcard_events**:
- Event details
- Player response
- Impact metrics

**tactics_used**:
- Tactic selection
- Investment amounts
- Performance metrics (CPL, CPA, ROI)

**talent_hires**:
- Hiring decisions
- Skill bonuses
- Morale impact

**big_bets**:
- Q4 final initiative
- Risk level
- Success/failure
- Impact

**ab_test_results**:
- Test selection
- Correctness
- Campaign impact

#### Views & Functions

**leaderboard_view**:
- Aggregated simulation data
- Sortable by multiple metrics
- Industry filtering

**industry_averages**:
- Benchmark data
- Performance comparisons

**calculate_percentile()**:
- Auto-calculates ranking
- Updates on completion

## Integration Guide

### Step 1: Database Setup

```bash
# Run the enhanced schema in Supabase SQL editor
psql -h your-project.supabase.co -U postgres -d postgres < supabase-schema-enhanced.sql
```

### Step 2: Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Update Simulation Flow

The recommended flow:

1. **Landing Page** (`/`) → Marketing pitch
2. **Setup** (`/sim/setup`) → Phase 0 configuration
3. **Strategy Session** (`/sim/strategy`) → Target audience, positioning, channels
4. **Q1** (`/sim/q1`) → A/B test, tactics, wildcard
5. **Q2** (`/sim/q2`) → Talent market, wildcard, budget pivot
6. **Q3** (`/sim/q3`) → Double down or diversify, wildcard
7. **Q4** (`/sim/q4`) → Big bet, final push
8. **Results** (`/sim/results`) → Final dashboard
9. **Debrief** (`/sim/debrief/[id]`) → Deep analysis
10. **Leaderboard** (`/leaderboard`) → Compare with others

### Step 4: Integrate Scoring Engine

```typescript
import { 
  calculateMarketShare, 
  calculateSEOImpact,
  calculatePaidAdsImpact,
  calculateFinalScore 
} from '@/lib/scoringEngine';

// In your simulation logic
const newMarketShare = calculateMarketShare(
  quarterlySpend,
  competitorSpend,
  previousMarketShare,
  brandEquity
);

const seoTraffic = calculateSEOImpact(
  quarterlyInvestments,
  currentQuarter,
  industryFactor
);

const finalScore = calculateFinalScore(simulationContext);
```

### Step 5: Implement Wildcard System

```typescript
import { generateWildcardEvent } from '@/lib/advancedWildcards';

// Generate event based on context
const event = generateWildcardEvent('Q2', {
  industry: 'healthcare',
  landscape: 'disruptor',
  currentMarketShare: 8.5,
  currentMorale: 70,
  budgetRemaining: 250000
});

// Present to player, capture response
// Apply impact to simulation state
```

### Step 6: Add A/B Test to Q1

```typescript
import ABTestMiniGame from '@/components/ABTestMiniGame';

// In Q1 page
<ABTestMiniGame 
  industry={simulation.industry}
  onComplete={(result) => {
    // Apply impact to campaign
    if (result.selectedCorrectly) {
      // Reduce CPA by result.impact.cpaReduction%
      // Increase conversions by result.impact.conversionBoost%
    }
  }}
/>
```

## Educational Design Principles

### 1. Learning by Doing
Players learn through consequences, not lectures. Every decision shows immediate impact with clear cause-and-effect.

### 2. Multiple Paths to Success
No single "correct" strategy. Players can win through:
- Aggressive growth
- Lean efficiency
- Brand building
- Niche domination

### 3. Realistic Trade-offs
Every decision has pros and cons:
- Price cuts gain share but damage brand
- SEO is slow but compounds
- Paid ads are fast but saturate

### 4. Contextual Learning
Educational content appears when relevant:
- A/B test teaches creative principles
- Wildcards teach strategic response
- Debrief teaches analytical thinking

### 5. Progressive Complexity
- Q1: Learn basics (tactics, A/B testing)
- Q2: Handle crises (wildcards, talent)
- Q3: Make strategic bets (scale or diversify)
- Q4: Execute big initiatives

## Performance Optimization

### Database Queries
- Use views for leaderboard (pre-aggregated)
- Index on user_id, status, score
- Batch insert decision points

### Frontend
- Lazy load debrief page
- Memoize scoring calculations
- Use React.memo for chart components

### Caching
- Cache industry averages (update hourly)
- Cache leaderboard top 100 (update every 5 min)
- Store setup data in localStorage during flow

## Testing Strategy

### Unit Tests
- Scoring engine functions
- Market share calculations
- Compounding effects
- Diminishing returns

### Integration Tests
- Simulation state machine
- Database operations
- Score calculation pipeline

### E2E Tests
- Complete simulation flow
- Wildcard event handling
- Debrief generation

## Future Enhancements

### Phase 2 Features
1. **Multiplayer Mode**: Compete in real-time
2. **Custom Industries**: User-defined markets
3. **AI Opponents**: Dynamic competitor behavior
4. **Advanced Analytics**: Cohort analysis, funnel visualization
5. **Certification**: Complete course, earn certificate
6. **API Access**: Export data for analysis

### Gamification
1. **Achievements**: Unlock badges for milestones
2. **Seasons**: Quarterly competitions
3. **Challenges**: Special scenarios with constraints
4. **Mentorship**: Top players coach newcomers

## Support & Resources

### Documentation
- This implementation guide
- API documentation (coming soon)
- Video tutorials (coming soon)

### Community
- Discord server for players
- Monthly strategy workshops
- Case study library

### Analytics
- Track completion rates
- Monitor decision patterns
- Identify pain points
- A/B test educational content

## Conclusion

The CMO Simulator combines game design, educational theory, and realistic marketing math to create a unique learning experience. By following this guide, you can implement all features and create an impressive portfolio piece that demonstrates:

1. **Technical Skill**: Full-stack development, complex state management
2. **Strategic Thinking**: Understanding of marketing principles
3. **UX Design**: Engaging, intuitive user experience
4. **Educational Design**: Effective teaching through gameplay

The result is not just a simulation, but a comprehensive marketing education platform disguised as a game.
