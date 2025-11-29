/**
 * Smart Hint System
 * Provides creative, hintful guidance without giving away answers
 * Uses real-world marketing wisdom to guide players
 */

import { SimulationContext } from '@/lib/simMachine';

export interface SmartHint {
  id: string;
  context: string; // When to show this hint
  hint: string; // The actual hint text
  category: 'strategy' | 'tactics' | 'budget' | 'timing' | 'risk';
  cleverness: 'subtle' | 'moderate' | 'direct';
  realWorldWisdom?: string;
}

export interface HintContext {
  currentQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  ytdRevenue: number;
  remainingBudget: number;
  currentMarketShare: number;
  tacticsSelected: number;
  previousQuarterRevenue?: number;
  isFirstQuarter?: boolean;
}

/**
 * Generate smart hints based on current context
 */
export function generateSmartHints(context: HintContext, simulationContext: SimulationContext): SmartHint[] {
  const hints: SmartHint[] = [];
  const { currentQuarter, ytdRevenue, remainingBudget, currentMarketShare, tacticsSelected, previousQuarterRevenue, isFirstQuarter } = context;

  // ============================================================================
  // BUDGET HINTS
  // ============================================================================
  if (remainingBudget > simulationContext.totalBudget * 0.6) {
    hints.push({
      id: 'budget-hoarding',
      context: 'high-budget-remaining',
      hint: '💰 Remember: Budget sitting unused generates zero returns. In marketing, money in motion creates opportunities. Consider: What would happen if you invested more aggressively now versus saving for later?',
      category: 'budget',
      cleverness: 'moderate',
      realWorldWisdom: 'Warren Buffett says: "The best time to plant a tree was 20 years ago. The second best time is now." Marketing investments compound - starting earlier often beats waiting.',
    });
  }

  if (remainingBudget < simulationContext.totalBudget * 0.2 && currentQuarter !== 'Q4') {
    hints.push({
      id: 'budget-running-low',
      context: 'low-budget-remaining',
      hint: '⚠️ You\'re running lean on budget. This is like a marathon runner who sprinted the first mile - sustainable? Maybe. Optimal? Probably not. Consider: Are you getting maximum value from each dollar, or spreading too thin?',
      category: 'budget',
      cleverness: 'moderate',
      realWorldWisdom: 'The best marketers know when to go all-in and when to conserve. Sometimes less is more - one great campaign beats ten mediocre ones.',
    });
  }

  // ============================================================================
  // REVENUE HINTS
  // ============================================================================
  if (ytdRevenue < 400000 && currentQuarter === 'Q2') {
    hints.push({
      id: 'revenue-behind-pace',
      context: 'revenue-behind-target',
      hint: '📊 You\'re at about 20% of your annual target halfway through the year. In real marketing, this is when CMOs have tough conversations. The question isn\'t "Can we catch up?" but "What needs to change?" Think: What\'s working? What\'s not? Double down or pivot?',
      category: 'strategy',
      cleverness: 'direct',
      realWorldWisdom: 'The best time to fix a marketing problem is when you first notice it, not when it\'s too late. Early course correction beats late panic.',
    });
  }

  if (previousQuarterRevenue && previousQuarterRevenue > 0) {
    const growthRate = ((ytdRevenue - previousQuarterRevenue) / previousQuarterRevenue) * 100;
    if (growthRate < 10 && growthRate > 0) {
      hints.push({
        id: 'slow-growth',
        context: 'slow-growth',
        hint: '🐢 Steady growth is good, but are you leaving money on the table? Sometimes incremental improvements come from doing more of what works, not trying new things. What generated revenue last quarter? Could you scale it?',
        category: 'strategy',
        cleverness: 'subtle',
        realWorldWisdom: 'The best growth strategy often isn\'t finding new tactics - it\'s scaling what already works. 10x a winning strategy beats 10 different experiments.',
      });
    }
  }

  // ============================================================================
  // TACTICS HINTS
  // ============================================================================
  if (tacticsSelected === 0) {
    hints.push({
      id: 'no-tactics-selected',
      context: 'no-tactics',
      hint: '🎯 You haven\'t selected any tactics yet. Here\'s a thought: In marketing, doing nothing is a decision - and it\'s usually the wrong one. Even small actions compound. What\'s the smallest thing you could do that would move the needle?',
      category: 'tactics',
      cleverness: 'direct',
      realWorldWisdom: 'Perfection is the enemy of progress. The best marketing plan is the one you actually execute, not the perfect one you never start.',
    });
  }

  if (tacticsSelected > 8) {
    hints.push({
      id: 'too-many-tactics',
      context: 'too-many-tactics',
      hint: '🎪 Running 8+ tactics is like juggling chainsaws - impressive if you pull it off, but one mistake and... well, you know. The best marketers focus. They do fewer things, better. What if you cut your tactics in half and doubled the budget on each?',
      category: 'tactics',
      cleverness: 'moderate',
      realWorldWisdom: 'Steve Jobs said: "Innovation is saying no to 1,000 things." Marketing success comes from focus, not from doing everything.',
    });
  }

  // ============================================================================
  // QUARTER-SPECIFIC HINTS
  // ============================================================================
  if (currentQuarter === 'Q1' && isFirstQuarter) {
    hints.push({
      id: 'q1-foundation',
      context: 'q1-start',
      hint: '🌱 Q1 is about planting seeds. Some tactics (like SEO and content) take months to grow, but they compound beautifully. Others (like paid ads) give immediate results but stop when you stop paying. The question: What foundation do you want to build?',
      category: 'strategy',
      cleverness: 'subtle',
      realWorldWisdom: 'The best Q1 strategy balances quick wins (momentum) with long-term investments (sustainability). It\'s like investing: some stocks pay dividends now, others appreciate over time.',
    });
  }

  if (currentQuarter === 'Q4') {
    if (ytdRevenue > 1500000) {
      hints.push({
        id: 'q4-strong-position',
        context: 'q4-strong',
        hint: '🏆 You\'re in a strong position! Q4 is your victory lap - but also your chance to set up next year. Consider: Do you go for the big win now, or invest in next year\'s foundation? The best CMOs think beyond the current year.',
        category: 'strategy',
        cleverness: 'moderate',
        realWorldWisdom: 'Success in Q4 isn\'t just hitting targets - it\'s positioning for Q1. The best companies use strong Q4s to build momentum for the next year.',
      });
    } else {
      hints.push({
        id: 'q4-catch-up',
        context: 'q4-catch-up',
        hint: '⚡ Q4 is your final chance. This is when bold moves pay off - or when desperation leads to bad decisions. The question: What\'s the difference between a "big bet" and a "Hail Mary"? One is calculated risk, the other is gambling. Which are you doing?',
        category: 'strategy',
        cleverness: 'moderate',
        realWorldWisdom: 'When behind, the worst move is to do more of what didn\'t work. The best move? Double down on what DID work, or make one calculated big bet.',
      });
    }
  }

  // ============================================================================
  // MARKET SHARE HINTS
  // ============================================================================
  if (currentMarketShare < 12 && currentQuarter !== 'Q1') {
    hints.push({
      id: 'low-market-share',
      context: 'low-market-share',
      hint: '📉 Market share below 12% means you\'re a small player. That\'s not bad - it\'s an opportunity. Small companies can move fast, try new things, and find niches big players ignore. The question: Are you trying to compete head-on, or finding your unique space?',
      category: 'strategy',
      cleverness: 'subtle',
      realWorldWisdom: 'David beat Goliath not by being bigger, but by being different. Small market share = agility advantage. Use it.',
    });
  }

  if (currentMarketShare > 20) {
    hints.push({
      id: 'high-market-share',
      context: 'high-market-share',
      hint: '👑 You\'ve built significant market share - congratulations! But here\'s the thing: maintaining share is harder than gaining it. Competitors notice. They react. The question: Are you defending your position, or continuing to grow?',
      category: 'strategy',
      cleverness: 'moderate',
      realWorldWisdom: 'The best defense is a good offense. Companies that stop innovating when they\'re ahead usually get passed.',
    });
  }

  // ============================================================================
  // TACTICAL HINTS
  // ============================================================================
  hints.push({
    id: 'tactic-diversity',
    context: 'tactic-selection',
    hint: '🎨 Think of your tactics like a portfolio. You want some safe bets (proven tactics), some growth plays (compounding investments), and maybe one moonshot (high risk, high reward). Are you balanced, or all-in on one approach?',
    category: 'tactics',
    cleverness: 'subtle',
    realWorldWisdom: 'Diversification reduces risk, but focus increases impact. The best marketers find the sweet spot between the two.',
  });

  // ============================================================================
  // TIMING HINTS
  // ============================================================================
  if (currentQuarter === 'Q3') {
    hints.push({
      id: 'q3-momentum',
      context: 'q3-momentum',
      hint: '🚀 Q3 is the momentum quarter. You\'ve learned what works (Q1-Q2), now it\'s time to scale. The best Q3 strategy? Do more of what worked, less of what didn\'t. Simple, but not easy. What\'s your winning formula?',
      category: 'timing',
      cleverness: 'moderate',
      realWorldWisdom: 'Q3 separates good marketers from great ones. Good marketers try new things. Great marketers scale what works.',
    });
  }

  return hints;
}

/**
 * Get a single, most relevant hint for current context
 */
export function getBestHint(context: HintContext, simulationContext: SimulationContext): SmartHint | null {
  const hints = generateSmartHints(context, simulationContext);
  if (hints.length === 0) return null;

  // Prioritize hints by relevance
  const priority = [
    'no-tactics',
    'budget-running-low',
    'revenue-behind-target',
    'q4-catch-up',
    'too-many-tactics',
    'q1-start',
  ];

  for (const priorityContext of priority) {
    const hint = hints.find(h => h.context === priorityContext);
    if (hint) return hint;
  }

  // Return first hint if no priority match
  return hints[0];
}

/**
 * Get hints formatted for display
 */
export function formatHintForDisplay(hint: SmartHint): {
  title: string;
  message: string;
  wisdom?: string;
} {
  return {
    title: hint.category.charAt(0).toUpperCase() + hint.category.slice(1) + ' Insight',
    message: hint.hint,
    wisdom: hint.realWorldWisdom,
  };
}

