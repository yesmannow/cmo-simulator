import { processQuarterAdvance, type SimulationContext, type Tactic } from '@/lib/simMachine';
import type { Channel } from '@/types/engine';

export type QuarterKey = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface ForecastMetric {
  label: string;
  value: number;
  delta: number;
  format: 'currency' | 'percent' | 'number';
}

export interface ChannelForecast {
  channel: Channel;
  contribution: number;
  roi: number;
  adstock: number;
}

export interface BudgetSummary {
  quarterBudget: number;
  usedBudget: number;
  remainingBudget: number;
  utilization: number;
}

export interface TacticBusinessProfile {
  businessRole: string;
  primaryTradeoff: string;
  bestUsedWhen: string;
  watchOutFor: string;
  kpiPressure: string;
}

export interface SimulationForecast {
  projectedKpis: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
    adstock: number;
  };
  deltaFromCurrent: ForecastMetric[];
  channelBreakdown: ChannelForecast[];
  budgetSummary: BudgetSummary;
  riskWarnings: string[];
  explanationBullets: string[];
}

const CHANNEL_LABELS: Record<Channel, string> = {
  tv: 'TV',
  radio: 'Radio',
  print: 'Print',
  digital: 'Digital',
  social: 'Social',
  seo: 'SEO',
  events: 'Events',
  pr: 'PR',
};

const PROFILE_BY_CATEGORY: Record<Tactic['category'], TacticBusinessProfile> = {
  digital: {
    businessRole: 'Demand capture',
    primaryTradeoff: 'Fast feedback, but efficiency drops when spend concentrates too heavily.',
    bestUsedWhen: 'You need short-term pipeline and can watch acquisition cost closely.',
    watchOutFor: 'Audience fatigue and rising cost per lead.',
    kpiPressure: 'Revenue, market share',
  },
  content: {
    businessRole: 'Trust and organic demand',
    primaryTradeoff: 'Slower payback, but it builds carryover value for later quarters.',
    bestUsedWhen: 'You need stronger brand memory, education, and lower future dependence on paid media.',
    watchOutFor: 'Underfunding distribution; content without reach has limited effect.',
    kpiPressure: 'Awareness, satisfaction',
  },
  traditional: {
    businessRole: 'Reach and legitimacy',
    primaryTradeoff: 'Large awareness lift, but high fixed cost and weaker attribution.',
    bestUsedWhen: 'You need broad category visibility or credibility against larger competitors.',
    watchOutFor: 'Overspending before message-market fit is clear.',
    kpiPressure: 'Awareness, market share',
  },
  events: {
    businessRole: 'Relationship conversion',
    primaryTradeoff: 'High-touch trust building, but it consumes team capacity.',
    bestUsedWhen: 'You sell higher-consideration offers where relationships change close rates.',
    watchOutFor: 'Operational drag if the team is already stretched.',
    kpiPressure: 'Satisfaction, revenue',
  },
  partnerships: {
    businessRole: 'Borrowed distribution',
    primaryTradeoff: 'Efficient reach through another audience, but less control over execution.',
    bestUsedWhen: 'You need credible access to a segment you cannot reach quickly alone.',
    watchOutFor: 'Partner mismatch or unclear ownership of follow-up.',
    kpiPressure: 'Revenue, market share',
  },
};

export function getTacticBusinessProfile(tactic: Tactic): TacticBusinessProfile {
  return PROFILE_BY_CATEGORY[tactic.category];
}

export function formatForecastValue(value: number, format: ForecastMetric['format']) {
  if (format === 'currency') return `$${Math.round(value).toLocaleString()}`;
  if (format === 'percent') return `${value.toFixed(1)}%`;
  return value.toFixed(1);
}

export function buildSimulationForecast(
  context: SimulationContext,
  quarter: QuarterKey,
  selectedTactics: Tactic[],
): SimulationForecast {
  const quarterBudget = Math.floor((context.totalBudget || 500000) / 4);
  const usedBudget = selectedTactics.reduce((sum, tactic) => sum + (tactic.cost || 0), 0);
  const remainingBudget = quarterBudget - usedBudget;
  const budgetSummary = {
    quarterBudget,
    usedBudget,
    remainingBudget,
    utilization: quarterBudget > 0 ? usedBudget / quarterBudget : 0,
  };

  const projected = processQuarterAdvance({
    ...context,
    quarters: {
      ...context.quarters,
      [quarter]: {
        ...context.quarters[quarter],
        tactics: selectedTactics,
      },
    },
  }, quarter);

  const totalAdstock = Object.values(projected.newEngineState.adstock).reduce((sum, value) => sum + value, 0);
  const projectedKpis = {
    ...projected.newKpis,
    adstock: totalAdstock,
  };

  const deltaFromCurrent: ForecastMetric[] = [
    { label: 'Revenue', value: projected.newQuarterData.results.revenue, delta: projected.newQuarterData.results.revenue, format: 'currency' },
    { label: 'Profit', value: projected.newQuarterData.results.profit, delta: projected.newQuarterData.results.profit, format: 'currency' },
    { label: 'Market Share', value: projectedKpis.marketShare, delta: projectedKpis.marketShare - context.kpis.marketShare, format: 'percent' },
    { label: 'Awareness', value: projectedKpis.brandAwareness, delta: projectedKpis.brandAwareness - context.kpis.brandAwareness, format: 'percent' },
    { label: 'Satisfaction', value: projectedKpis.customerSatisfaction, delta: projectedKpis.customerSatisfaction - context.kpis.customerSatisfaction, format: 'percent' },
  ];

  const channelBreakdown = (Object.keys(projected.newEngineState.results.channelRoi) as Channel[])
    .map((channel) => ({
      channel,
      contribution: projected.newEngineState.results.channelContributions[channel] || 0,
      roi: projected.newEngineState.results.channelRoi[channel] || 0,
      adstock: projected.newEngineState.adstock[channel] || 0,
    }))
    .filter((entry) => entry.contribution > 0 || entry.roi > 0 || entry.adstock > 0)
    .sort((a, b) => b.contribution - a.contribution);

  const riskWarnings = buildRiskWarnings(selectedTactics, budgetSummary, projected.newQuarterData.results.profit, channelBreakdown);
  const explanationBullets = buildExplanationBullets(selectedTactics, budgetSummary, channelBreakdown, projectedKpis.adstock);

  return {
    projectedKpis,
    deltaFromCurrent,
    channelBreakdown,
    budgetSummary,
    riskWarnings,
    explanationBullets,
  };
}

function buildRiskWarnings(
  selectedTactics: Tactic[],
  budget: BudgetSummary,
  projectedProfit: number,
  channelBreakdown: ChannelForecast[],
) {
  const warnings: string[] = [];

  if (selectedTactics.length === 0) {
    warnings.push('No quarter plan selected yet. Forecasts will remain at baseline until you add at least one move.');
  }

  if (budget.remainingBudget < 0) {
    warnings.push('This plan exceeds the quarter budget. Reduce spend before finalizing.');
  } else if (budget.utilization > 0.9) {
    warnings.push('Budget reserve is thin. A wildcard or crisis response may force a tradeoff later.');
  } else if (budget.utilization < 0.35 && selectedTactics.length > 0) {
    warnings.push('The plan may be too conservative for a full quarter. Consider adding one focused move if the mandate requires growth.');
  }

  const categoryTotals = selectedTactics.reduce<Record<string, number>>((totals, tactic) => {
    totals[tactic.category] = (totals[tactic.category] || 0) + tactic.cost;
    return totals;
  }, {});
  const largestCategorySpend = Math.max(0, ...Object.values(categoryTotals));
  if (budget.usedBudget > 0 && largestCategorySpend / budget.usedBudget > 0.7 && selectedTactics.length > 1) {
    warnings.push('Spend is concentrated in one tactic family. That can work, but it raises execution and saturation risk.');
  }

  const weakRoiChannel = channelBreakdown.find((channel) => channel.roi > 0 && channel.roi < 50);
  if (weakRoiChannel) {
    warnings.push(`${CHANNEL_LABELS[weakRoiChannel.channel]} is showing low projected efficiency. Review whether that channel is serving awareness or direct demand.`);
  }

  if (projectedProfit < 0 && selectedTactics.length > 0) {
    warnings.push('Projected profit is negative this quarter. Make sure the brand or market-share gain is worth the cash burn.');
  }

  return warnings;
}

function buildExplanationBullets(
  selectedTactics: Tactic[],
  budget: BudgetSummary,
  channelBreakdown: ChannelForecast[],
  totalAdstock: number,
) {
  if (selectedTactics.length === 0) {
    return ['Choose tactics to see how budget, channel efficiency, and brand carryover change the quarter forecast.'];
  }

  const bullets: string[] = [];
  const topChannel = channelBreakdown[0];
  if (topChannel) {
    bullets.push(`${CHANNEL_LABELS[topChannel.channel]} is the largest projected contributor based on the current mix.`);
  }

  if (totalAdstock > 100000) {
    bullets.push('Prior and current brand investment is creating carryover value that can support later acquisition.');
  }

  if (budget.utilization > 0.75) {
    bullets.push('The plan is aggressive enough to create signal, but it leaves less room for reactive moves.');
  } else {
    bullets.push('The plan preserves optionality; use the remaining budget intentionally rather than letting it sit idle.');
  }

  return bullets;
}

