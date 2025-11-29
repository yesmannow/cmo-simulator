# 🧮 Advanced Mathematical Models & Situational Variables Enhancement

## 🎯 Executive Summary

This document outlines next-level mathematical models, situational variables, and scoring enhancements to transform the CMO Simulator into a research-grade marketing simulation platform.

**Priority**: P0 (Foundation for all future enhancements)
**Estimated Effort**: 2-3 weeks
**Impact**: Transforms simulation from educational tool to professional-grade platform

---

## 📊 Part 1: Advanced Situational Variables

### 1.1 Economic Environment Variables

**Current State**: Basic market conditions
**Enhanced State**: Multi-factor economic modeling

```typescript
interface EconomicEnvironment {
  // Macroeconomic indicators
  gdpGrowthRate: number;        // -2% to +5% (recession to boom)
  inflationRate: number;        // 0% to 10% (affects ad costs)
  unemploymentRate: number;      // 3% to 15% (affects consumer spending)
  consumerConfidenceIndex: number; // 0-100 (affects conversion rates)

  // Industry-specific factors
  industryGrowthRate: number;   // -5% to +20% (sector performance)
  regulatoryEnvironment: 'favorable' | 'neutral' | 'restrictive';
  technologyAdoptionRate: number; // 0-100 (digital transformation speed)

  // Market dynamics
  marketVolatility: number;     // 0-1 (how much conditions fluctuate)
  creditAvailability: 'tight' | 'normal' | 'loose'; // Affects B2B sales
}
```

**Impact on Scoring**:
- Economic multipliers affect all revenue calculations
- Recession scenarios test crisis management
- Boom scenarios reward aggressive expansion

---

### 1.2 Dynamic Market Conditions

**Current State**: Static market landscape
**Enhanced State**: Evolving market conditions

```typescript
interface MarketConditions {
  // Seasonality (varies by industry)
  seasonalityIndex: number;     // 0.7-1.3 (Q4 boost, Q1 dip)
  seasonalFactors: {
    q1: number; // Post-holiday slump
    q2: number; // Spring growth
    q3: number; // Summer slowdown
    q4: number; // Holiday surge
  };

  // Market lifecycle stage
  marketLifecycle: 'emerging' | 'growth' | 'mature' | 'declining';
  lifecycleMultiplier: number;  // Affects growth potential

  // Competitive dynamics
  competitiveIntensity: number;  // 0-100 (how aggressive competitors are)
  marketFragmentation: number;  // 0-1 (many small players vs few large)
  entryBarriers: 'low' | 'medium' | 'high'; // New competitor threat

  // Consumer behavior shifts
  digitalAdoptionRate: number;  // 0-100 (how fast consumers go digital)
  priceSensitivity: number;     // 0-100 (how price-sensitive market is)
  brandLoyalty: number;         // 0-100 (how loyal customers are)
}
```

**Mathematical Model**:
```typescript
function calculateMarketConditionImpact(
  conditions: MarketConditions,
  quarter: number
): MarketMultiplier {
  // Seasonality effect
  const seasonal = conditions.seasonalFactors[`q${(quarter % 4) + 1}`];

  // Lifecycle effect (S-curve)
  const lifecycleFactor = calculateLifecycleFactor(conditions.marketLifecycle);

  // Competitive effect (inverse relationship)
  const competitiveFactor = 1 - (conditions.competitiveIntensity / 200);

  // Combined multiplier
  return {
    revenueMultiplier: seasonal * lifecycleFactor * competitiveFactor,
    conversionMultiplier: 1 - (conditions.priceSensitivity / 200),
    brandMultiplier: conditions.brandLoyalty / 100
  };
}
```

---

### 1.3 Customer Behavior Models

**Current State**: Simple conversion rates
**Enhanced State**: Sophisticated customer journey modeling

```typescript
interface CustomerBehaviorModel {
  // Purchase funnel stages
  awarenessRate: number;        // % of market aware of brand
  considerationRate: number;     // % aware → considering
  purchaseRate: number;         // % considering → purchasing
  retentionRate: number;        // % purchasing → repeat

  // Customer segments
  segments: {
    earlyAdopters: { size: number; conversionRate: number; clv: number };
    mainstream: { size: number; conversionRate: number; clv: number };
    laggards: { size: number; conversionRate: number; clv: number };
  };

  // Behavioral shifts
  channelPreference: Record<Channel, number>; // Where customers prefer to buy
  priceElasticity: number;      // How demand changes with price
  crossSellRate: number;        // % of customers who buy additional products
}
```

**Mathematical Model** (Bass Diffusion + Customer Journey):
```typescript
function calculateCustomerAcquisition(
  spend: number,
  behavior: CustomerBehaviorModel,
  brandEquity: number
): number {
  // Awareness generation (adstock + brand equity)
  const awarenessGenerated = spend * 0.001 * (1 + brandEquity / 100);

  // Bass Diffusion: F(t) = (1 - e^(-(p+q)*t)) / (1 + (q/p) * e^(-(p+q)*t))
  const innovationCoeff = 0.03; // Early adopters
  const imitationCoeff = 0.38 * (awarenessGenerated / 1000); // Word of mouth
  const timeFactor = 1; // Current quarter
  const pPlusQ = innovationCoeff + imitationCoeff;

  const adoptionRate = (1 - Math.exp(-pPlusQ * timeFactor)) /
    (1 + (imitationCoeff / innovationCoeff) * Math.exp(-pPlusQ * timeFactor));

  // Journey conversion
  const aware = awarenessGenerated * adoptionRate;
  const considering = aware * behavior.considerationRate;
  const purchasing = considering * behavior.purchaseRate;

  return purchasing;
}
```

---

## 🧮 Part 2: Next-Level Mathematical Models

### 2.1 Multi-Touch Attribution Models

**Current State**: Simple last-touch attribution
**Enhanced State**: Advanced attribution modeling

```typescript
interface AttributionModel {
  type: 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based' | 'data-driven';

  // Channel interactions
  touchpoints: Array<{
    channel: Channel;
    timestamp: number; // Days before conversion
    spend: number;
    interaction: 'view' | 'click' | 'engagement';
  }>;

  // Attribution weights
  weights: Record<Channel, number>;
}

function calculateMultiTouchAttribution(
  touchpoints: Touchpoint[],
  model: AttributionModel['type']
): Record<Channel, number> {
  switch (model) {
    case 'first-touch':
      // 100% credit to first touchpoint
      return { [touchpoints[0].channel]: 1.0 };

    case 'last-touch':
      // 100% credit to last touchpoint
      return { [touchpoints[touchpoints.length - 1].channel]: 1.0 };

    case 'linear':
      // Equal credit to all touchpoints
      const equalWeight = 1 / touchpoints.length;
      return touchpoints.reduce((acc, tp) => {
        acc[tp.channel] = (acc[tp.channel] || 0) + equalWeight;
        return acc;
      }, {} as Record<Channel, number>);

    case 'time-decay':
      // More credit to recent touchpoints (exponential decay)
      const totalWeight = touchpoints.reduce((sum, tp, i) => {
        const daysAgo = tp.timestamp;
        return sum + Math.exp(-daysAgo / 7); // 7-day half-life
      }, 0);

      return touchpoints.reduce((acc, tp) => {
        const weight = Math.exp(-tp.timestamp / 7) / totalWeight;
        acc[tp.channel] = (acc[tp.channel] || 0) + weight;
        return acc;
      }, {} as Record<Channel, number>);

    case 'position-based':
      // 40% first touch, 40% last touch, 20% distributed
      const firstWeight = 0.4;
      const lastWeight = 0.4;
      const middleWeight = 0.2 / Math.max(1, touchpoints.length - 2);

      return touchpoints.reduce((acc, tp, i) => {
        let weight = 0;
        if (i === 0) weight = firstWeight;
        else if (i === touchpoints.length - 1) weight = lastWeight;
        else weight = middleWeight;

        acc[tp.channel] = (acc[tp.channel] || 0) + weight;
        return acc;
      }, {} as Record<Channel, number>);

    case 'data-driven':
      // Shapley value (game theory) - fair credit distribution
      return calculateShapleyValue(touchpoints);
  }
}
```

**Shapley Value Calculation** (Game Theory):
```typescript
function calculateShapleyValue(touchpoints: Touchpoint[]): Record<Channel, number> {
  // Shapley value: average marginal contribution across all permutations
  const channels = [...new Set(touchpoints.map(tp => tp.channel))];
  const shapleyValues: Record<Channel, number> = {};

  channels.forEach(channel => {
    let totalContribution = 0;
    const channelTouches = touchpoints.filter(tp => tp.channel === channel);

    // Calculate marginal contribution for each permutation
    const permutations = generatePermutations(touchpoints);
    permutations.forEach(perm => {
      const withoutChannel = perm.filter(tp => tp.channel !== channel);
      const withChannel = perm;

      const valueWithout = calculateConversionValue(withoutChannel);
      const valueWith = calculateConversionValue(withChannel);

      totalContribution += valueWith - valueWithout;
    });

    shapleyValues[channel] = totalContribution / permutations.length;
  });

  // Normalize to sum to 1.0
  const total = Object.values(shapleyValues).reduce((a, b) => a + b, 0);
  Object.keys(shapleyValues).forEach(channel => {
    shapleyValues[channel] /= total;
  });

  return shapleyValues;
}
```

---

### 2.2 Network Effects & Viral Coefficients

**Current State**: No network effects
**Enhanced State**: Viral growth modeling

```typescript
interface ViralGrowthModel {
  // Viral coefficient (K-factor)
  viralCoefficient: number;     // Average users each user brings
  sharingRate: number;           // % of users who share
  conversionRate: number;        // % of shares that convert

  // Network effects
  networkValue: number;          // Value increases with network size (Metcalfe's Law)
  networkMultiplier: number;    // 1.0 = linear, 2.0 = quadratic (network effects)

  // Social proof effects
  socialProofMultiplier: number; // Conversion boost from social signals
  reviewImpact: number;          // Impact of reviews/ratings
}

function calculateViralGrowth(
  currentUsers: number,
  model: ViralGrowthModel,
  quarter: number
): number {
  // Viral coefficient: K = sharingRate * conversionRate
  const k = model.sharingRate * model.conversionRate;

  // Viral growth: N(t) = N(0) * (1 + K)^t
  const viralGrowth = currentUsers * Math.pow(1 + k, quarter);

  // Network effects (Metcalfe's Law): Value = n²
  const networkValue = Math.pow(currentUsers, model.networkMultiplier);
  const networkMultiplier = 1 + (networkValue / 10000); // Scaling factor

  // Social proof effect
  const socialProofBoost = 1 + (model.socialProofMultiplier * currentUsers / 1000);

  return viralGrowth * networkMultiplier * socialProofBoost;
}
```

---

### 2.3 Cohort Analysis & Customer Lifetime Value

**Current State**: Simple CLV calculation
**Enhanced State**: Cohort-based CLV with retention curves

```typescript
interface CohortAnalysis {
  cohorts: Array<{
    acquisitionQuarter: number;
    acquisitionChannel: Channel;
    initialSize: number;
    retentionCurve: number[]; // Retention % by quarter
    revenuePerQuarter: number[];
    avgOrderValue: number;
  }>;
}

function calculateCohortCLV(
  cohort: CohortAnalysis['cohorts'][0],
  discountRate: number = 0.1
): number {
  let totalCLV = 0;

  // Calculate CLV for each quarter
  cohort.retentionCurve.forEach((retentionRate, quarter) => {
    const activeCustomers = cohort.initialSize * retentionRate;
    const quarterlyRevenue = activeCustomers * cohort.avgOrderValue;

    // Discount future value: PV = FV / (1 + r)^t
    const presentValue = quarterlyRevenue / Math.pow(1 + discountRate, quarter);
    totalCLV += presentValue;
  });

  return totalCLV / cohort.initialSize; // Per-customer CLV
}

// Retention curve modeling (exponential decay)
function calculateRetentionCurve(
  baseRetention: number,      // Q1 retention rate
  churnRate: number,          // Quarterly churn
  quarters: number
): number[] {
  const curve: number[] = [];
  let currentRetention = baseRetention;

  for (let q = 0; q < quarters; q++) {
    curve.push(currentRetention);
    // Exponential decay: R(t) = R(0) * e^(-churn * t)
    currentRetention = baseRetention * Math.exp(-churnRate * (q + 1));
  }

  return curve;
}
```

---

### 2.4 Monte Carlo Simulation for Risk Modeling

**Current State**: Deterministic outcomes
**Enhanced State**: Probabilistic outcomes with confidence intervals

```typescript
interface MonteCarloSimulation {
  iterations: number;          // Number of simulations (1000-10000)
  confidenceLevel: number;     // 0.95 = 95% confidence interval
  variables: Array<{
    name: string;
    distribution: 'normal' | 'lognormal' | 'uniform' | 'beta';
    mean: number;
    stdDev?: number;
    min?: number;
    max?: number;
  }>;
}

function runMonteCarloSimulation(
  config: MonteCarloSimulation,
  revenueFunction: (vars: Record<string, number>) => number
): {
  mean: number;
  median: number;
  stdDev: number;
  confidenceInterval: [number, number];
  percentiles: Record<number, number>; // 10th, 25th, 75th, 90th
} {
  const results: number[] = [];

  // Run simulations
  for (let i = 0; i < config.iterations; i++) {
    const variables: Record<string, number> = {};

    // Sample from distributions
    config.variables.forEach(variable => {
      switch (variable.distribution) {
        case 'normal':
          variables[variable.name] = sampleNormal(variable.mean, variable.stdDev!);
          break;
        case 'lognormal':
          variables[variable.name] = sampleLognormal(variable.mean, variable.stdDev!);
          break;
        case 'uniform':
          variables[variable.name] = sampleUniform(variable.min!, variable.max!);
          break;
        case 'beta':
          variables[variable.name] = sampleBeta(variable.mean, variable.stdDev!);
          break;
      }
    });

    // Calculate revenue with sampled variables
    const revenue = revenueFunction(variables);
    results.push(revenue);
  }

  // Calculate statistics
  results.sort((a, b) => a - b);
  const mean = results.reduce((a, b) => a + b, 0) / results.length;
  const median = results[Math.floor(results.length / 2)];
  const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length;
  const stdDev = Math.sqrt(variance);

  // Confidence interval (95% = ±1.96 standard deviations)
  const zScore = 1.96; // For 95% confidence
  const margin = zScore * stdDev;
  const confidenceInterval: [number, number] = [mean - margin, mean + margin];

  // Percentiles
  const percentiles = {
    10: results[Math.floor(results.length * 0.1)],
    25: results[Math.floor(results.length * 0.25)],
    75: results[Math.floor(results.length * 0.75)],
    90: results[Math.floor(results.length * 0.9)]
  };

  return { mean, median, stdDev, confidenceInterval, percentiles };
}

// Example: Revenue simulation with uncertainty
function simulateRevenueWithUncertainty(
  baseRevenue: number,
  marketVolatility: number
): number {
  const simulation = runMonteCarloSimulation({
    iterations: 1000,
    confidenceLevel: 0.95,
    variables: [
      {
        name: 'conversionRate',
        distribution: 'normal',
        mean: 0.15,
        stdDev: 0.02 * marketVolatility
      },
      {
        name: 'customerValue',
        distribution: 'lognormal',
        mean: 1000,
        stdDev: 200 * marketVolatility
      },
      {
        name: 'traffic',
        distribution: 'normal',
        mean: 10000,
        stdDev: 1000 * marketVolatility
      }
    ]
  }, (vars) => {
    return vars.traffic * vars.conversionRate * vars.customerValue;
  });

  return simulation.mean;
}
```

---

### 2.5 Portfolio Optimization (Markowitz Model)

**Current State**: Simple budget allocation
**Enhanced State**: Risk-return optimized portfolio

```typescript
interface MarketingPortfolio {
  channels: Array<{
    channel: Channel;
    allocation: number;        // Budget %
    expectedReturn: number;     // Expected ROI
    risk: number;              // Volatility (std dev)
    correlation: Record<Channel, number>; // Correlation with other channels
  }>;
}

function optimizePortfolio(
  channels: MarketingPortfolio['channels'],
  riskTolerance: number,      // 0-1 (0 = risk-averse, 1 = risk-seeking)
  totalBudget: number
): {
  optimalAllocation: Record<Channel, number>;
  expectedReturn: number;
  portfolioRisk: number;
  sharpeRatio: number;         // Risk-adjusted return
} {
  // Markowitz optimization: Maximize Sharpe Ratio
  // Sharpe Ratio = (Return - RiskFreeRate) / Risk

  const riskFreeRate = 0.05; // 5% risk-free rate

  // Calculate portfolio return and risk
  let portfolioReturn = 0;
  let portfolioVariance = 0;

  channels.forEach((ch1, i) => {
    portfolioReturn += ch1.allocation * ch1.expectedReturn;

    channels.forEach((ch2, j) => {
      const covariance = ch1.risk * ch2.risk * (ch1.correlation[ch2.channel] || 0);
      portfolioVariance += ch1.allocation * ch2.allocation * covariance;
    });
  });

  const portfolioRisk = Math.sqrt(portfolioVariance);
  const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioRisk;

  // Optimize allocation using gradient descent or linear programming
  const optimalAllocation = optimizeAllocation(
    channels,
    riskTolerance,
    sharpeRatio
  );

  return {
    optimalAllocation,
    expectedReturn: portfolioReturn,
    portfolioRisk,
    sharpeRatio
  };
}
```

---

### 2.6 Bayesian Inference for Learning

**Current State**: Static conversion rates
**Enhanced State**: Bayesian updating as data accumulates

```typescript
interface BayesianModel {
  // Prior beliefs
  priorAlpha: number;          // Beta distribution alpha (successes)
  priorBeta: number;           // Beta distribution beta (failures)

  // Observed data
  observedSuccesses: number;
  observedFailures: number;

  // Posterior (updated beliefs)
  posteriorAlpha: number;
  posteriorBeta: number;
}

function updateBayesianModel(
  model: BayesianModel,
  newSuccesses: number,
  newFailures: number
): BayesianModel {
  // Bayesian update: Posterior = Prior + Data
  const posteriorAlpha = model.priorAlpha + newSuccesses;
  const posteriorBeta = model.priorBeta + newFailures;

  // Calculate posterior mean (expected conversion rate)
  const expectedConversionRate = posteriorAlpha / (posteriorAlpha + posteriorBeta);

  // Calculate credible interval (Bayesian confidence interval)
  const credibleInterval = calculateBetaCredibleInterval(
    posteriorAlpha,
    posteriorBeta,
    0.95
  );

  return {
    ...model,
    observedSuccesses: model.observedSuccesses + newSuccesses,
    observedFailures: model.observedFailures + newFailures,
    posteriorAlpha,
    posteriorBeta,
    expectedConversionRate,
    credibleInterval
  };
}

// Example: A/B test with Bayesian inference
function bayesianABTest(
  variantA: { conversions: number; visitors: number },
  variantB: { conversions: number; visitors: number }
): {
  winner: 'A' | 'B' | 'inconclusive';
  probabilityAIsBetter: number;
  expectedLift: number;
} {
  // Prior: Uniform (no prior knowledge)
  const priorAlpha = 1;
  const priorBeta = 1;

  // Update with data
  const posteriorA = {
    alpha: priorAlpha + variantA.conversions,
    beta: priorBeta + (variantA.visitors - variantA.conversions)
  };

  const posteriorB = {
    alpha: priorAlpha + variantB.conversions,
    beta: priorBeta + (variantB.visitors - variantB.conversions)
  };

  // Calculate probability A > B using Monte Carlo
  let aWins = 0;
  const simulations = 10000;

  for (let i = 0; i < simulations; i++) {
    const sampleA = sampleBeta(posteriorA.alpha, posteriorA.beta);
    const sampleB = sampleBeta(posteriorB.alpha, posteriorB.beta);
    if (sampleA > sampleB) aWins++;
  }

  const probabilityAIsBetter = aWins / simulations;
  const expectedLift = (posteriorA.alpha / (posteriorA.alpha + posteriorA.beta)) /
    (posteriorB.alpha / (posteriorB.alpha + posteriorB.beta)) - 1;

  return {
    winner: probabilityAIsBetter > 0.95 ? 'A' : probabilityAIsBetter < 0.05 ? 'B' : 'inconclusive',
    probabilityAIsBetter,
    expectedLift
  };
}
```

---

## 🎯 Part 3: Enhanced Scoring System

### 3.1 Multi-Dimensional Scoring

**Current State**: Single strategy score
**Enhanced State**: Multi-dimensional performance metrics

```typescript
interface AdvancedScore {
  // Core metrics
  revenueScore: number;         // 0-5000
  roiScore: number;            // 0-3000
  marketShareScore: number;    // 0-4000
  brandEquityScore: number;    // 0-2000

  // Strategic metrics
  efficiencyScore: number;     // Budget utilization
  consistencyScore: number;    // Growth streaks
  strategicScore: number;      // Strategic thinking
  adaptabilityScore: number;   // Response to changes

  // Risk-adjusted metrics
  riskAdjustedReturn: number;  // Sharpe ratio equivalent
  volatilityPenalty: number;   // Penalty for high variance

  // Innovation metrics
  innovationScore: number;     // New tactics/channels tried
  experimentationScore: number; // A/B tests, risk-taking

  // Total score
  totalScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

  // Percentiles
  overallPercentile: number;
  categoryPercentiles: {
    revenue: number;
    efficiency: number;
    strategy: number;
    innovation: number;
  };
}
```

---

### 3.2 Dynamic Difficulty Adjustment

**Current State**: Static difficulty levels
**Enhanced State**: Adaptive difficulty based on performance

```typescript
function calculateAdaptiveDifficulty(
  playerPerformance: AdvancedScore,
  currentDifficulty: DifficultyLevel
): DifficultyLevel {
  // If player consistently scores high, increase difficulty
  if (playerPerformance.totalScore > 8000 && playerPerformance.consistencyScore > 1000) {
    return increaseDifficulty(currentDifficulty);
  }

  // If player struggling, decrease difficulty
  if (playerPerformance.totalScore < 3000 && playerPerformance.efficiencyScore < 500) {
    return decreaseDifficulty(currentDifficulty);
  }

  return currentDifficulty;
}

function adjustMarketConditions(
  difficulty: DifficultyLevel,
  baseConditions: MarketConditions
): MarketConditions {
  const multipliers = {
    beginner: { volatility: 0.5, competitiveIntensity: 0.7, marketGrowth: 1.2 },
    intermediate: { volatility: 1.0, competitiveIntensity: 1.0, marketGrowth: 1.0 },
    advanced: { volatility: 1.5, competitiveIntensity: 1.3, marketGrowth: 0.8 }
  };

  const mult = multipliers[difficulty];

  return {
    ...baseConditions,
    marketVolatility: baseConditions.marketVolatility * mult.volatility,
    competitiveIntensity: baseConditions.competitiveIntensity * mult.competitiveIntensity,
    industryGrowthRate: baseConditions.industryGrowthRate * mult.marketGrowth
  };
}
```

---

## 📋 Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Economic environment variables
- [ ] Dynamic market conditions
- [ ] Customer behavior models
- [ ] Basic Monte Carlo simulation

### Phase 2: Advanced Models (Week 2)
- [ ] Multi-touch attribution
- [ ] Viral growth models
- [ ] Cohort analysis
- [ ] Bayesian inference

### Phase 3: Optimization (Week 3)
- [ ] Portfolio optimization
- [ ] Risk-adjusted scoring
- [ ] Adaptive difficulty
- [ ] Advanced scoring system

---

## 🎓 Educational Value

These enhancements teach:
1. **Statistical Thinking**: Monte Carlo, Bayesian inference
2. **Financial Modeling**: Portfolio optimization, risk-adjusted returns
3. **Marketing Science**: Attribution, cohort analysis, viral growth
4. **Strategic Decision-Making**: Multi-dimensional optimization
5. **Data-Driven Marketing**: Evidence-based decision making

---

## 🔬 Research Basis

All models are based on:
- **Marketing Mix Modeling (MMM)**: Industry-standard attribution
- **Bass Diffusion Model**: Innovation adoption theory
- **Markowitz Portfolio Theory**: Risk-return optimization
- **Bayesian Statistics**: Modern statistical inference
- **Game Theory**: Shapley value for fair attribution

---

## 🚀 Next Steps

1. Review and prioritize models
2. Create implementation plan for selected models
3. Build test suite for mathematical accuracy
4. Integrate with existing simulation engine
5. Add UI for advanced analytics

