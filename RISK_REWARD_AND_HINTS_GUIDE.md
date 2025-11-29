# Risk/Reward Education & Smart Hints System

## Overview

This system provides comprehensive risk/reward education and intelligent hint guidance throughout the simulation, helping users make informed decisions without giving away answers.

## Features

### 1. Risk & Reward Education System

#### Components Created:
- **`src/lib/riskRewardEducation.ts`**: Database of risk/reward analyses for all decision types
- **`src/components/education/RiskRewardIndicator.tsx`**: UI component displaying risk/reward information

#### What It Covers:
- **Tactics**: Google Ads, Content Marketing, SEO, Events, etc.
- **Wildcard Events**: Crisis events, market opportunities
- **Hiring Options**: Marketing Director, team hires
- **Big Bets**: High-risk/high-reward strategic investments

#### Information Provided:
- **Risk Level**: Low, Medium, or High
- **Reward Level**: Low, Medium, or High
- **Detailed Risks**: Each with probability and impact ratings
- **Potential Rewards**: Each with probability and impact ratings
- **Best For**: Situations where this decision works well
- **Worst For**: Situations to avoid
- **Real-World Examples**: Concrete examples from actual companies
- **Expert Advice**: Professional marketing wisdom
- **Mitigation Strategies**: How to reduce risks

#### Integration Points:
- ✅ **Tactic Cards**: Every tactic shows risk/reward analysis
- ✅ **Wildcard Modal**: Events show risk/reward for each choice
- ✅ **Big Bet Modal**: Strategic investments show comprehensive analysis
- ⏳ **Talent Market**: Hiring options (ready to add)

### 2. Tutorial Onboarding Popup

#### Component:
- **`src/components/onboarding/TutorialOnboardingPopup.tsx`**

#### Features:
- Appears when user first starts simulation
- Offers choice: Take tutorial or jump right in
- Links to comprehensive tutorial system
- Can be dismissed and accessed later
- Remembers user's choice (localStorage)

#### Integration:
- ✅ Integrated into Strategy page (where simulation begins)
- Shows once per user (stored in localStorage)

### 3. Smart Hint System

#### Components Created:
- **`src/lib/smartHints.ts`**: Hint generation logic
- **`src/components/help/SmartHintPanel.tsx`**: UI component for displaying hints

#### How It Works:
- Analyzes current simulation context
- Generates contextual hints based on:
  - Current quarter
  - Revenue performance
  - Budget remaining
  - Market share
  - Tactics selected
  - Previous quarter results

#### Hint Characteristics:
- **Hintful, not direct**: Guides thinking without giving answers
- **Creative writing**: Uses analogies, metaphors, real-world wisdom
- **Context-aware**: Different hints for different situations
- **Real-world wisdom**: Includes marketing principles and examples

#### Example Hints:
- "Budget sitting unused generates zero returns. In marketing, money in motion creates opportunities."
- "You're at 20% of target halfway through. The question isn't 'Can we catch up?' but 'What needs to change?'"
- "Running 8+ tactics is like juggling chainsaws - impressive if you pull it off, but one mistake and..."

#### Integration:
- ✅ Integrated into Q4 page
- Ready to add to Q1, Q2, Q3 pages

## Usage Examples

### Adding Risk/Reward to New Components

```tsx
import { RiskRewardIndicator } from '@/components/education/RiskRewardIndicator';

// In your component
<RiskRewardIndicator
  decisionId="google-ads" // or "events", "big-bet", "crisis-event", etc.
  variant="detailed" // or "compact"
  showDetails={false} // Start collapsed
/>
```

### Adding Smart Hints

```tsx
import { SmartHintPanel } from '@/components/help/SmartHintPanel';

// In quarter page
<SmartHintPanel
  context={context}
  currentQuarter="Q4"
  tacticsSelected={selectedTactics.length}
/>
```

### Adding Tutorial Popup

```tsx
import { TutorialOnboardingPopup } from '@/components/onboarding/TutorialOnboardingPopup';

const [showTutorial, setShowTutorial] = useState(false);

useEffect(() => {
  const hasSeenTutorial = localStorage.getItem('cmo-sim-tutorial-offered');
  if (!hasSeenTutorial) {
    setShowTutorial(true);
    localStorage.setItem('cmo-sim-tutorial-offered', 'true');
  }
}, []);

<TutorialOnboardingPopup
  isOpen={showTutorial}
  onStartTutorial={() => {/* Start tutorial */}}
  onSkip={() => setShowTutorial(false)}
  onClose={() => setShowTutorial(false)}
/>
```

## Risk/Reward Database

### Available Analyses:

#### Tactics:
- `google-ads`: Google Ads & SEM
- `content-marketing`: Content Marketing
- `seo`: SEO
- `events`: Events & Trade Shows

#### Events:
- `crisis-event`: Crisis events
- `opportunity-event`: Market opportunities

#### Hiring:
- `hire-marketing-director`: Marketing Director hire

#### Big Bets:
- `big-bet`: Strategic big bet initiatives

### Adding New Risk/Reward Analyses:

```typescript
// In src/lib/riskRewardEducation.ts
export const riskRewardDatabase: Record<string, RiskRewardAnalysis> = {
  'new-decision-id': {
    id: 'new-decision-id',
    name: 'Decision Name',
    category: 'tactic' | 'event' | 'hiring' | 'big-bet' | 'strategy' | 'budget',
    riskLevel: 'low' | 'medium' | 'high',
    rewardLevel: 'low' | 'medium' | 'high',
    risks: [
      {
        description: 'Risk description',
        probability: 'low' | 'medium' | 'high',
        impact: 'minor' | 'moderate' | 'major',
      },
    ],
    rewards: [
      {
        description: 'Reward description',
        probability: 'low' | 'medium' | 'high',
        impact: 'minor' | 'moderate' | 'major',
      },
    ],
    bestFor: ['Situation 1', 'Situation 2'],
    worstFor: ['Situation 1', 'Situation 2'],
    realWorldExample: 'Real example...',
    expertAdvice: 'Expert advice...',
    mitigationStrategies: ['Strategy 1', 'Strategy 2'],
  },
};
```

## Smart Hint System

### Adding New Hints:

```typescript
// In src/lib/smartHints.ts
export function generateSmartHints(context: HintContext, simulationContext: SimulationContext): SmartHint[] {
  const hints: SmartHint[] = [];

  // Add your hint logic
  if (someCondition) {
    hints.push({
      id: 'hint-id',
      context: 'when-to-show',
      hint: 'Your creative, hintful guidance here...',
      category: 'strategy' | 'tactics' | 'budget' | 'timing' | 'risk',
      cleverness: 'subtle' | 'moderate' | 'direct',
      realWorldWisdom: 'Real-world marketing wisdom...',
    });
  }

  return hints;
}
```

## Best Practices

1. **Risk/Reward Indicators**:
   - Use "detailed" variant for important decisions
   - Use "compact" variant for lists/grids
   - Always show on high-stakes decisions

2. **Smart Hints**:
   - Keep hints creative and engaging
   - Use analogies and real-world examples
   - Don't give direct answers - guide thinking
   - Include real-world marketing wisdom

3. **Tutorial Popup**:
   - Show once per user
   - Make it easy to dismiss
   - Always provide access to tutorial later

## Future Enhancements

- [ ] Add risk/reward to Talent Market hiring
- [ ] Add hints to Q1, Q2, Q3 pages
- [ ] Create hint history/archive
- [ ] Add hint difficulty levels
- [ ] Create risk/reward comparison tool
- [ ] Add risk/reward to budget allocation

