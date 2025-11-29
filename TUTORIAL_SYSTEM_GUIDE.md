# Comprehensive Tutorial System Guide

## Overview

This tutorial system is designed for users with **zero marketing knowledge**. It provides:
- **Detailed explanations** of every concept
- **Tooltips with definitions** throughout the app
- **Step-by-step guidance** with expert insights
- **Contextual help** that appears when needed
- **Comprehensive glossary** of all marketing terms

## Components Created

### 1. Glossary System (`src/lib/glossary.ts`)
- 30+ marketing terms with simple explanations
- Beginner-friendly definitions
- Real-world examples
- Related terms linking
- Search functionality

### 2. Definition Tooltip (`src/components/ui/DefinitionTooltip.tsx`)
- Hover/click to see definitions
- Two variants: simple (hover) and detailed (click)
- Shows simple explanation, full definition, examples, and related terms
- Inline definition component for wrapping terms

### 3. Comprehensive Tutorial (`src/components/tutorial/ComprehensiveTutorial.tsx`)
- Step-by-step guided tour
- Rich content with examples
- Expandable expert explanations
- Key terms highlighted with definitions
- Pro tips and common mistakes
- Expert insights

### 4. Contextual Help (`src/components/help/ContextualHelp.tsx`)
- Context-aware help panel
- Searchable glossary
- Relevant terms for current section
- Tips specific to current page

## Usage Examples

### Adding Definitions to Text

```tsx
import { InlineDefinition } from '@/components/ui/DefinitionTooltip';

// Wrap any term with InlineDefinition
<p>
  Your <InlineDefinition termId="revenue">revenue</InlineDefinition> is the total
  money from sales. Compare it to your <InlineDefinition termId="roi">ROI</InlineDefinition>
  to see if marketing is profitable.
</p>
```

### Adding Tooltips to UI Elements

```tsx
import { DefinitionTooltip } from '@/components/ui/DefinitionTooltip';

<DefinitionTooltip termId="market-share" variant="simple">
  <span>Market Share: 15%</span>
</DefinitionTooltip>
```

### Using Comprehensive Tutorial

```tsx
import { ComprehensiveTutorial } from '@/components/tutorial/ComprehensiveTutorial';
import { getTutorialForPhase } from '@/lib/comprehensiveTutorialData';

function MyPage() {
  const [showTutorial, setShowTutorial] = useState(false);
  const tutorialSteps = getTutorialForPhase('welcome');

  return (
    <>
      <Button onClick={() => setShowTutorial(true)}>
        Start Tutorial
      </Button>

      <ComprehensiveTutorial
        steps={tutorialSteps}
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={() => {
          setShowTutorial(false);
          // Mark tutorial as completed
        }}
      />
    </>
  );
}
```

### Adding Contextual Help

```tsx
import { ContextualHelp } from '@/components/help/ContextualHelp';

function QuarterPage() {
  return (
    <div>
      <ContextualHelp
        context="Q4 Quarter Planning"
        termIds={['revenue', 'roi', 'budget', 'tactics']}
        tips={[
          'Q4 is your final chance to hit annual targets',
          'Consider year-end bonuses and effectiveness multipliers',
          'Review previous quarters to learn what worked'
        ]}
      />
      {/* Rest of page */}
    </div>
  );
}
```

## Integration Checklist

### For Each Page:

1. **Add Inline Definitions** to key terms
   ```tsx
   <InlineDefinition termId="revenue">Revenue</InlineDefinition>
   ```

2. **Add Contextual Help Button**
   ```tsx
   <ContextualHelp
     context="Page Name"
     termIds={['relevant', 'terms']}
     tips={['helpful', 'tips']}
   />
   ```

3. **Add Tooltips to Metrics**
   ```tsx
   <DefinitionTooltip termId="market-share">
     <MetricCard value={marketShare} />
   </DefinitionTooltip>
   ```

4. **Add Tutorial Trigger**
   ```tsx
   <Button onClick={startTutorial}>
     Take Tutorial
   </Button>
   ```

## Key Features

### 1. Simple Explanations
Every term has a "simple explanation" written for someone with no marketing background:
- Uses everyday language
- Avoids jargon
- Includes analogies
- Real-world examples

### 2. Progressive Disclosure
- Start with simple explanation
- Expand to detailed definition
- Show expert insights on demand
- Related terms for deeper learning

### 3. Contextual Learning
- Help appears when needed
- Terms defined in context
- Tips specific to current task
- Common mistakes highlighted

### 4. Visual Indicators
- Question mark icons (?) show definitions available
- Color-coded difficulty levels
- Expandable sections for more info
- Progress indicators in tutorials

## Best Practices

1. **Don't Overwhelm**: Use definitions sparingly - only on key terms
2. **Be Consistent**: Use the same term IDs throughout
3. **Update Context**: Change contextual help for each page/section
4. **Test Clarity**: Read explanations as if you know nothing about marketing
5. **Link Related Terms**: Use relatedTerms array to help users learn more

## Adding New Terms

To add a new term to the glossary:

```typescript
// In src/lib/glossary.ts
{
  id: 'new-term-id',
  term: 'New Term',
  definition: 'Full technical definition...',
  simpleExplanation: 'Simple explanation for beginners...',
  example: 'Real-world example...',
  relatedTerms: ['related-term-1', 'related-term-2'],
  category: 'strategy' | 'metrics' | 'tactics' | 'finance' | 'general',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
}
```

## Adding Tutorial Steps

To add tutorial steps:

```typescript
// In src/lib/comprehensiveTutorialData.ts
{
  id: 'step-id',
  title: 'Step Title',
  content: <div>Rich content with examples</div>,
  detailedExplanation: 'Expert-level explanation...',
  keyTerms: ['term-1', 'term-2'],
  tips: ['Tip 1', 'Tip 2'],
  commonMistakes: ['Mistake 1', 'Mistake 2'],
  expertInsight: 'Insight from marketing expert...',
  target: '.css-selector',
  position: 'top' | 'bottom' | 'left' | 'right' | 'center',
}
```

## Accessibility

- All tooltips are keyboard accessible
- Screen reader friendly
- High contrast for visibility
- Clear focus indicators
- Skip options for tutorials

## Performance

- Definitions loaded on demand
- Search results limited to 5
- Smooth animations with Framer Motion
- No performance impact when closed

