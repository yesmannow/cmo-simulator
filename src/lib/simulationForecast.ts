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
  scenarios: ForecastScenario[];
  comparisonRows: ForecastComparisonRow[];
  confidenceBand: ForecastBandPoint[];
  topRisk: string;
  scenarioSpread: {
    revenue: number;
    profit: number;
    marketShare: number;
  };
}

export type ForecastScenarioKey = 'downside' | 'base' | 'upside';

export interface ForecastScenario {
  key: ForecastScenarioKey;
  label: string;
  confidenceLabel: string;
  projectedKpis: SimulationForecast['projectedKpis'];
  deltaFromCurrent: ForecastMetric[];
  channelBreakdown: ChannelForecast[];
  drivers: string[];
  riskWarnings: string[];
  topRisk: string;
}

export interface ForecastComparisonRow {
  label: string;
  currentValue: string;
  plannedValue: string;
}

export interface ForecastBandPoint {
  label: string;
  lower: number;
  expected: number;
  upper: number;
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

  const exposure = calculateExposureProfile(selectedTactics, budgetSummary, context);
  const scenarios = buildForecastScenarios({
    context,
    quarter,
    selectedTactics,
    budgetSummary,
    exposure,
    baseProjection: projected,
  });
  const baseScenario = scenarios.find((scenario) => scenario.key === 'base') ?? scenarios[1];
  const riskWarnings = baseScenario.riskWarnings;
  const explanationBullets = buildExplanationBullets(
    selectedTactics,
    budgetSummary,
    channelBreakdown,
    projectedKpis.adstock,
    scenarios,
    exposure,
  );
  const comparisonRows = buildComparisonRows(context, projected, budgetSummary);
  const confidenceBand = [
    {
      label: 'Revenue',
      lower: scenarios[0]?.projectedKpis.revenue ?? 0,
      expected: baseScenario?.projectedKpis.revenue ?? 0,
      upper: scenarios[2]?.projectedKpis.revenue ?? 0,
    },
    {
      label: 'Profit',
      lower: scenarios[0]?.projectedKpis.profit ?? 0,
      expected: baseScenario?.projectedKpis.profit ?? 0,
      upper: scenarios[2]?.projectedKpis.profit ?? 0,
    },
  ];
  const scenarioSpread = {
    revenue: (scenarios[2]?.projectedKpis.revenue ?? 0) - (scenarios[0]?.projectedKpis.revenue ?? 0),
    profit: (scenarios[2]?.projectedKpis.profit ?? 0) - (scenarios[0]?.projectedKpis.profit ?? 0),
    marketShare: (scenarios[2]?.projectedKpis.marketShare ?? 0) - (scenarios[0]?.projectedKpis.marketShare ?? 0),
  };

  return {
    projectedKpis,
    deltaFromCurrent,
    channelBreakdown,
    budgetSummary,
    riskWarnings,
    explanationBullets,
    scenarios,
    comparisonRows,
    confidenceBand,
    topRisk: baseScenario?.topRisk ?? riskWarnings[0] ?? 'No major execution risk detected.',
    scenarioSpread,
  };
}

interface ExposureProfile {
  reservePressure: number;
  concentrationPressure: number;
  wildcardExposure: number;
  competitorPressure: number;
}

function calculateExposureProfile(
  selectedTactics: Tactic[],
  budget: BudgetSummary,
  context: SimulationContext,
): ExposureProfile {
  const categoryTotals = selectedTactics.reduce<Record<string, number>>((totals, tactic) => {
    totals[tactic.category] = (totals[tactic.category] || 0) + tactic.cost;
    return totals;
  }, {});
  const largestCategorySpend = Math.max(0, ...Object.values(categoryTotals));
  const concentrationPressure = budget.usedBudget > 0
    ? clampNumber(largestCategorySpend / budget.usedBudget, 0, 1)
    : 0;
  const reservePressure = budget.remainingBudget < 0
    ? 1
    : clampNumber(1 - Math.max(budget.remainingBudget, 0) / Math.max(budget.quarterBudget, 1), 0, 1);
  const competitorSpend = Object.values(context.engineState.marketConditions.competitorSpend || {}).reduce((sum, value) => sum + value, 0);
  const competitorPressure = clampNumber(competitorSpend / Math.max(budget.quarterBudget, 1), 0.25, 2.5);
  const wildcardExposure = clampNumber(
    reservePressure * 0.45 + concentrationPressure * 0.35 + Math.max(0, competitorPressure - 1) * 0.2,
    0,
    1,
  );

  return {
    reservePressure,
    concentrationPressure,
    wildcardExposure,
    competitorPressure,
  };
}

function buildForecastScenarios(options: {
  context: SimulationContext;
  quarter: QuarterKey;
  selectedTactics: Tactic[];
  budgetSummary: BudgetSummary;
  exposure: ExposureProfile;
  baseProjection: ReturnType<typeof processQuarterAdvance>;
}): ForecastScenario[] {
  const { context, quarter, selectedTactics, budgetSummary, exposure, baseProjection } = options;
  const scenarioConfigs: Array<{
    key: ForecastScenarioKey;
    label: string;
    confidenceLabel: string;
    economicMultiplier: number;
    competitorMultiplier: number;
    riskBias: number;
  }> = [
    {
      key: 'downside',
      label: 'Downside',
      confidenceLabel: 'Stress case',
      economicMultiplier: 0.9,
      competitorMultiplier: 1.25 + exposure.wildcardExposure * 0.1,
      riskBias: 0.18,
    },
    {
      key: 'base',
      label: 'Base',
      confidenceLabel: 'Most likely',
      economicMultiplier: 1,
      competitorMultiplier: 1,
      riskBias: 0.08,
    },
    {
      key: 'upside',
      label: 'Upside',
      confidenceLabel: 'Stretch case',
      economicMultiplier: 1.08,
      competitorMultiplier: 0.9,
      riskBias: -0.04,
    },
  ];

  return scenarioConfigs.map((config) => {
    const scenarioProjection = config.key === 'base'
      ? baseProjection
      : processQuarterAdvance(
          buildScenarioContext(context, quarter, selectedTactics, config.economicMultiplier, config.competitorMultiplier),
          quarter,
        );

    const adjusted = adjustProjectionForScenario(
      scenarioProjection,
      context,
      budgetSummary,
      exposure,
      config,
    );

    const channelBreakdown = (Object.keys(adjusted.newEngineState.results.channelRoi) as Channel[])
      .map((channel) => ({
        channel,
        contribution: adjusted.newEngineState.results.channelContributions[channel] || 0,
        roi: adjusted.newEngineState.results.channelRoi[channel] || 0,
        adstock: adjusted.newEngineState.adstock[channel] || 0,
      }))
      .filter((entry) => entry.contribution > 0 || entry.roi > 0 || entry.adstock > 0)
      .sort((a, b) => b.contribution - a.contribution);

    const projectedKpis = {
      ...adjusted.newKpis,
      adstock: Object.values(adjusted.newEngineState.adstock).reduce((sum, value) => sum + value, 0),
    };
    const deltaFromCurrent: ForecastMetric[] = [
      { label: 'Revenue', value: adjusted.newQuarterData.results.revenue, delta: adjusted.newQuarterData.results.revenue, format: 'currency' },
      { label: 'Profit', value: adjusted.newQuarterData.results.profit, delta: adjusted.newQuarterData.results.profit, format: 'currency' },
      { label: 'Market Share', value: projectedKpis.marketShare, delta: projectedKpis.marketShare - context.kpis.marketShare, format: 'percent' },
      { label: 'Awareness', value: projectedKpis.brandAwareness, delta: projectedKpis.brandAwareness - context.kpis.brandAwareness, format: 'percent' },
      { label: 'Satisfaction', value: projectedKpis.customerSatisfaction, delta: projectedKpis.customerSatisfaction - context.kpis.customerSatisfaction, format: 'percent' },
    ];
    const riskWarnings = buildRiskWarnings(selectedTactics, budgetSummary, adjusted.newQuarterData.results.profit, channelBreakdown, config.key, exposure);

    return {
      key: config.key,
      label: config.label,
      confidenceLabel: config.confidenceLabel,
      projectedKpis,
      deltaFromCurrent,
      channelBreakdown,
      drivers: buildScenarioDrivers(config.key, exposure, budgetSummary),
      riskWarnings,
      topRisk: riskWarnings[0] ?? 'No major execution risk detected.',
    };
  });
}

function buildScenarioContext(
  context: SimulationContext,
  quarter: QuarterKey,
  selectedTactics: Tactic[],
  economicMultiplier: number,
  competitorMultiplier: number,
): SimulationContext {
  const previousMarket = context.engineState.marketConditions;
  return {
    ...context,
    quarters: {
      ...context.quarters,
      [quarter]: {
        ...context.quarters[quarter],
        tactics: selectedTactics,
      },
    },
    engineState: {
      ...context.engineState,
      marketConditions: {
        ...previousMarket,
        economicIndex: previousMarket.economicIndex * economicMultiplier,
        competitorSpend: scaleCompetitorSpend(previousMarket.competitorSpend, competitorMultiplier),
      },
    },
  };
}

function adjustProjectionForScenario(
  projection: ReturnType<typeof processQuarterAdvance>,
  context: SimulationContext,
  budget: BudgetSummary,
  exposure: ExposureProfile,
  config: {
    key: ForecastScenarioKey;
    economicMultiplier: number;
    competitorMultiplier: number;
    riskBias: number;
  },
) {
  const baseRevenue = projection.newQuarterData.results.revenue;
  const baseProfit = projection.newQuarterData.results.profit;
  const marketShareDelta = projection.newKpis.marketShare - context.kpis.marketShare;
  const awarenessDelta = projection.newKpis.brandAwareness - context.kpis.brandAwareness;
  const satisfactionDelta = projection.newKpis.customerSatisfaction - context.kpis.customerSatisfaction;
  const competitorDrag = Math.max(0, exposure.competitorPressure * config.competitorMultiplier - 1);
  const revenueFactor = clampNumber(
    1 + (config.economicMultiplier - 1) * 1.05 - competitorDrag * 0.06 - exposure.wildcardExposure * config.riskBias,
    0.72,
    1.2,
  );
  const profitFactor = clampNumber(
    1 + (config.economicMultiplier - 1) * 1.15 - competitorDrag * 0.08 - (exposure.wildcardExposure + exposure.reservePressure * 0.25) * config.riskBias,
    0.58,
    1.22,
  );
  const marketShareFactor = clampNumber(
    1 + (config.economicMultiplier - 1) * 0.55 - competitorDrag * 0.1 - exposure.concentrationPressure * config.riskBias,
    0.68,
    1.18,
  );
  const awarenessFactor = clampNumber(
    1 + (config.key === 'upside' ? 0.06 : config.key === 'downside' ? -0.05 : 0),
    0.82,
    1.08,
  );
  const satisfactionFactor = clampNumber(
    1 + (config.key === 'downside' ? -0.06 : config.key === 'upside' ? 0.03 : 0) - exposure.reservePressure * 0.04,
    0.8,
    1.06,
  );

  const adjustedRevenue = Math.round(baseRevenue * revenueFactor);
  const adjustedProfit = Math.round(baseProfit * profitFactor);
  const adjustedMarketShare = clampNumber(
    context.kpis.marketShare + marketShareDelta * marketShareFactor,
    0,
    100,
  );
  const adjustedAwareness = clampNumber(
    context.kpis.brandAwareness + awarenessDelta * awarenessFactor,
    0,
    100,
  );
  const adjustedSatisfaction = clampNumber(
    context.kpis.customerSatisfaction + satisfactionDelta * satisfactionFactor,
    0,
    100,
  );

  return {
    ...projection,
    newQuarterData: {
      ...projection.newQuarterData,
      results: {
        ...projection.newQuarterData.results,
        revenue: adjustedRevenue,
        profit: adjustedProfit,
        marketShare: adjustedMarketShare,
        customerSatisfaction: adjustedSatisfaction,
        brandAwareness: adjustedAwareness,
      },
    },
    newKpis: {
      ...projection.newKpis,
      revenue: context.kpis.revenue + adjustedRevenue,
      profit: context.kpis.profit + adjustedProfit,
      marketShare: adjustedMarketShare,
      customerSatisfaction: adjustedSatisfaction,
      brandAwareness: adjustedAwareness,
    },
  };
}

function buildScenarioDrivers(
  key: ForecastScenarioKey,
  exposure: ExposureProfile,
  budget: BudgetSummary,
) {
  const drivers: string[] = [];
  if (key === 'downside') {
    drivers.push('Assumes softer demand and heavier competitive response during the quarter.');
    if (exposure.wildcardExposure > 0.55) {
      drivers.push('Thin reserve or concentrated spend leaves less room to absorb a crisis response.');
    }
  }

  if (key === 'base') {
    drivers.push('Uses the current engine forecast with moderate competitive drag.');
    if (budget.remainingBudget >= 0) {
      drivers.push('Preserves the current quarter reserve instead of assuming late reactive spend.');
    }
  }

  if (key === 'upside') {
    drivers.push('Assumes demand stays supportive and the channel mix compounds cleanly.');
    if (exposure.concentrationPressure < 0.6) {
      drivers.push('A more balanced mix allows stronger carryover and less saturation pressure.');
    }
  }

  return drivers;
}

function buildComparisonRows(
  context: SimulationContext,
  projection: ReturnType<typeof processQuarterAdvance>,
  budgetSummary: BudgetSummary,
): ForecastComparisonRow[] {
  return [
    {
      label: 'Revenue',
      currentValue: '$0',
      plannedValue: formatForecastValue(projection.newQuarterData.results.revenue, 'currency'),
    },
    {
      label: 'Profit',
      currentValue: '$0',
      plannedValue: formatForecastValue(projection.newQuarterData.results.profit, 'currency'),
    },
    {
      label: 'Market Share',
      currentValue: formatForecastValue(context.kpis.marketShare, 'percent'),
      plannedValue: formatForecastValue(projection.newKpis.marketShare, 'percent'),
    },
    {
      label: 'Reserve',
      currentValue: formatForecastValue(budgetSummary.quarterBudget, 'currency'),
      plannedValue: formatForecastValue(budgetSummary.remainingBudget, 'currency'),
    },
  ];
}

function buildRiskWarnings(
  selectedTactics: Tactic[],
  budget: BudgetSummary,
  projectedProfit: number,
  channelBreakdown: ChannelForecast[],
  scenarioKey: ForecastScenarioKey = 'base',
  exposure?: ExposureProfile,
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

  if (exposure && exposure.competitorPressure > 1.15 && scenarioKey !== 'upside') {
    warnings.push('Competitor pressure is elevated relative to the quarter budget. Protect core channels before stretching into low-conviction moves.');
  }

  if (exposure && exposure.wildcardExposure > 0.55 && scenarioKey === 'downside') {
    warnings.push('This mix is exposed to a downside shock. Keep reserve or reduce concentration before finalizing.');
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
  scenarios: ForecastScenario[],
  exposure: ExposureProfile,
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

  const spread = (scenarios[2]?.projectedKpis.revenue ?? 0) - (scenarios[0]?.projectedKpis.revenue ?? 0);
  if (spread > 0) {
    bullets.push(`The confidence band spans ${formatForecastValue(spread, 'currency')} in quarter revenue between downside and upside cases.`);
  }

  if (exposure.wildcardExposure > 0.55) {
    bullets.push('Wildcard exposure is elevated. Concentration and thin reserve matter more than raw headline revenue in this setup.');
  }

  return bullets;
}

function scaleCompetitorSpend(
  spend: Record<Channel, number>,
  multiplier: number,
): Record<Channel, number> {
  return {
    tv: spend.tv * multiplier,
    radio: spend.radio * multiplier,
    print: spend.print * multiplier,
    digital: spend.digital * multiplier,
    social: spend.social * multiplier,
    seo: spend.seo * multiplier,
    events: spend.events * multiplier,
    pr: spend.pr * multiplier,
  };
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
