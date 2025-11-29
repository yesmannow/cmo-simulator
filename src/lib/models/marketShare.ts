/**
 * Advanced Market Share Model using Bass Diffusion
 * More realistic than simple share-of-voice
 *
 * Priority: P1 (Week 2)
 */

export interface MarketShareContext {
  currentShare: number;
  yourSpend: number;
  competitorSpend: number;
  brandEquity: number;
  marketMaturity: number; // 0-1, how mature is the market
  quartersElapsed: number;
  previousShares: number[]; // Historical shares for trend
}

/**
 * Calculate market share using Bass Diffusion Model
 * Models how innovations (new products/marketing) diffuse through market
 */
export function calculateMarketShareBass(
  context: MarketShareContext
): number {
  const {
    currentShare,
    yourSpend,
    competitorSpend,
    brandEquity,
    marketMaturity,
    quartersElapsed
  } = context;

  // Innovation coefficient (p) - early adopters
  // Higher brand equity = more innovation adoption
  const innovationCoeff = 0.03 * (brandEquity / 100);

  // Imitation coefficient (q) - word of mouth
  // Higher current share = more word of mouth
  const imitationCoeff = 0.38 * (currentShare / 100);

  // Market potential (m) - total addressable market
  const marketPotential = 100 - currentShare;

  // Bass model: F(t) = (1 - e^(-(p+q)*t)) / (1 + (q/p) * e^(-(p+q)*t))
  const timeFactor = Math.min(4, quartersElapsed); // 4 quarters = 1 year
  const pPlusQ = innovationCoeff + imitationCoeff;
  const pValue = Math.max(innovationCoeff, 0.001); // Avoid division by zero

  const bassFactor = (1 - Math.exp(-pPlusQ * timeFactor)) /
    (1 + (imitationCoeff / pValue) * Math.exp(-pPlusQ * timeFactor));

  // Share of voice influence
  const totalSpend = yourSpend + competitorSpend;
  const shareOfVoice = totalSpend > 0 ? yourSpend / totalSpend : 0.5;
  const voiceMultiplier = 0.3 + (shareOfVoice * 0.7); // 30% base + 70% from voice

  // Brand equity multiplier
  // Strong brands get more bang for buck
  const brandMultiplier = 0.7 + (brandEquity / 100) * 0.6; // 0.7x to 1.3x

  // Market maturity penalty (harder to grow in mature markets)
  const maturityPenalty = 1 - (marketMaturity * 0.3);

  // Competitive response penalty
  // If competitors are spending aggressively, growth is harder
  const competitiveRatio = competitorSpend / Math.max(yourSpend, 1);
  const competitivePenalty = competitiveRatio > 2 ? 0.8 : 1.0;

  // Calculate new share
  const growthAmount = marketPotential * bassFactor * voiceMultiplier *
    brandMultiplier * maturityPenalty * competitivePenalty * 0.1;

  const newShare = currentShare + growthAmount;

  // Apply inertia (market share doesn't change instantly)
  const inertia = 0.3; // 30% of previous share persists
  const finalShare = (currentShare * inertia) + (newShare * (1 - inertia));

  return Math.min(Math.max(finalShare, 0), 100);
}

/**
 * Calculate market maturity based on total market spend
 */
export function calculateMarketMaturity(
  totalMarketSpend: number,
  marketSize: number
): number {
  if (marketSize === 0) return 0.5; // Default to moderate maturity

  // Maturity increases as market spend approaches market capacity
  const saturationRatio = totalMarketSpend / marketSize;

  // Sigmoid curve for maturity (0 to 1)
  return 1 / (1 + Math.exp(-5 * (saturationRatio - 0.5)));
}

/**
 * Calculate market share growth rate
 */
export function calculateMarketShareGrowthRate(
  previousShares: number[]
): number {
  if (previousShares.length < 2) return 0;

  const recent = previousShares.slice(-2);
  const growth = recent[1] - recent[0];
  return growth;
}

/**
 * Predict market share based on current trajectory
 */
export function predictMarketShare(
  currentShare: number,
  growthRate: number,
  quartersAhead: number
): number {
  const predictedShare = currentShare + (growthRate * quartersAhead);
  return Math.min(Math.max(predictedShare, 0), 100);
}

