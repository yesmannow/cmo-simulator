/**
 * Industry Benchmark Scoring
 * Provides comparison to industry averages and percentiles
 *
 * Priority: P2 (Week 4)
 */

export interface BenchmarkData {
  industry: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  metricType: 'revenue' | 'roi' | 'marketShare' | 'brandEquity' | 'score';
  percentile50: number; // Median
  percentile75: number;
  percentile90: number;
  percentile99: number;
  average: number;
  updatedAt: string;
}

export interface BenchmarkComparison {
  yourScore: number;
  industryAverage: number;
  top10Percentile: number;
  top1Percentile: number;
  yourPercentile: number;

  componentComparison: {
    revenue: { you: number; avg: number; top10: number; percentile: number };
    roi: { you: number; avg: number; top10: number; percentile: number };
    marketShare: { you: number; avg: number; top10: number; percentile: number };
    brandEquity: { you: number; avg: number; top10: number; percentile: number };
  };

  recommendations: string[];
  strengths: string[];
  gaps: string[];
}

/**
 * Industry benchmark data (would come from database in production)
 */
const BENCHMARK_DATA: Record<string, Record<string, BenchmarkData[]>> = {
  healthcare: {
    beginner: [
      { industry: 'healthcare', difficulty: 'beginner', metricType: 'revenue', percentile50: 500000, percentile75: 750000, percentile90: 1000000, percentile99: 2000000, average: 600000, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'beginner', metricType: 'roi', percentile50: 80, percentile75: 120, percentile90: 180, percentile99: 300, average: 100, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'beginner', metricType: 'marketShare', percentile50: 8, percentile75: 12, percentile90: 18, percentile99: 25, average: 10, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'beginner', metricType: 'score', percentile50: 3000, percentile75: 4500, percentile90: 6500, percentile99: 10000, average: 3500, updatedAt: new Date().toISOString() }
    ],
    intermediate: [
      { industry: 'healthcare', difficulty: 'intermediate', metricType: 'revenue', percentile50: 2000000, percentile75: 3000000, percentile90: 5000000, percentile99: 10000000, average: 2500000, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'intermediate', metricType: 'roi', percentile50: 100, percentile75: 150, percentile90: 220, percentile99: 350, average: 120, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'intermediate', metricType: 'marketShare', percentile50: 10, percentile75: 15, percentile90: 22, percentile99: 30, average: 12, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'intermediate', metricType: 'score', percentile50: 5000, percentile75: 7500, percentile90: 11000, percentile99: 15000, average: 6000, updatedAt: new Date().toISOString() }
    ],
    advanced: [
      { industry: 'healthcare', difficulty: 'advanced', metricType: 'revenue', percentile50: 5000000, percentile75: 8000000, percentile90: 12000000, percentile99: 20000000, average: 6000000, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'advanced', metricType: 'roi', percentile50: 120, percentile75: 180, percentile90: 250, percentile99: 400, average: 140, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'advanced', metricType: 'marketShare', percentile50: 12, percentile75: 18, percentile90: 25, percentile99: 35, average: 15, updatedAt: new Date().toISOString() },
      { industry: 'healthcare', difficulty: 'advanced', metricType: 'score', percentile50: 7000, percentile75: 10000, percentile90: 14000, percentile99: 20000, average: 8500, updatedAt: new Date().toISOString() }
    ]
  },
  legal: {
    beginner: [
      { industry: 'legal', difficulty: 'beginner', metricType: 'revenue', percentile50: 600000, percentile75: 900000, percentile90: 1200000, percentile99: 2500000, average: 750000, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'beginner', metricType: 'roi', percentile50: 90, percentile75: 130, percentile90: 200, percentile99: 320, average: 110, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'beginner', metricType: 'marketShare', percentile50: 6, percentile75: 10, percentile90: 15, percentile99: 22, average: 8, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'beginner', metricType: 'score', percentile50: 3200, percentile75: 4800, percentile90: 7000, percentile99: 11000, average: 3800, updatedAt: new Date().toISOString() }
    ],
    intermediate: [
      { industry: 'legal', difficulty: 'intermediate', metricType: 'revenue', percentile50: 2500000, percentile75: 4000000, percentile90: 6000000, percentile99: 12000000, average: 3000000, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'intermediate', metricType: 'roi', percentile50: 110, percentile75: 160, percentile90: 230, percentile99: 360, average: 130, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'intermediate', metricType: 'marketShare', percentile50: 8, percentile75: 12, percentile90: 18, percentile99: 28, average: 10, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'intermediate', metricType: 'score', percentile50: 5500, percentile75: 8000, percentile90: 12000, percentile99: 16000, average: 6500, updatedAt: new Date().toISOString() }
    ],
    advanced: [
      { industry: 'legal', difficulty: 'advanced', metricType: 'revenue', percentile50: 6000000, percentile75: 10000000, percentile90: 15000000, percentile99: 25000000, average: 7500000, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'advanced', metricType: 'roi', percentile50: 130, percentile75: 190, percentile90: 260, percentile99: 410, average: 150, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'advanced', metricType: 'marketShare', percentile50: 10, percentile75: 15, percentile90: 22, percentile99: 32, average: 12, updatedAt: new Date().toISOString() },
      { industry: 'legal', difficulty: 'advanced', metricType: 'score', percentile50: 8000, percentile75: 11000, percentile90: 15000, percentile99: 21000, average: 9500, updatedAt: new Date().toISOString() }
    ]
  },
  ecommerce: {
    beginner: [
      { industry: 'ecommerce', difficulty: 'beginner', metricType: 'revenue', percentile50: 200000, percentile75: 350000, percentile90: 600000, percentile99: 1200000, average: 300000, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'beginner', metricType: 'roi', percentile50: 150, percentile75: 220, percentile90: 300, percentile99: 450, average: 180, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'beginner', metricType: 'marketShare', percentile50: 10, percentile75: 15, percentile90: 22, percentile99: 30, average: 12, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'beginner', metricType: 'score', percentile50: 2800, percentile75: 4200, percentile90: 6000, percentile99: 9000, average: 3300, updatedAt: new Date().toISOString() }
    ],
    intermediate: [
      { industry: 'ecommerce', difficulty: 'intermediate', metricType: 'revenue', percentile50: 1000000, percentile75: 2000000, percentile90: 4000000, percentile99: 8000000, average: 1500000, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'intermediate', metricType: 'roi', percentile50: 180, percentile75: 250, percentile90: 350, percentile99: 500, average: 200, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'intermediate', metricType: 'marketShare', percentile50: 12, percentile75: 18, percentile90: 25, percentile99: 35, average: 15, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'intermediate', metricType: 'score', percentile50: 4800, percentile75: 7000, percentile90: 10000, percentile99: 14000, average: 5800, updatedAt: new Date().toISOString() }
    ],
    advanced: [
      { industry: 'ecommerce', difficulty: 'advanced', metricType: 'revenue', percentile50: 3000000, percentile75: 6000000, percentile90: 12000000, percentile99: 20000000, average: 4500000, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'advanced', metricType: 'roi', percentile50: 200, percentile75: 280, percentile90: 380, percentile99: 550, average: 220, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'advanced', metricType: 'marketShare', percentile50: 15, percentile75: 22, percentile90: 30, percentile99: 40, average: 18, updatedAt: new Date().toISOString() },
      { industry: 'ecommerce', difficulty: 'advanced', metricType: 'score', percentile50: 6500, percentile75: 9500, percentile90: 13000, percentile99: 18000, average: 7800, updatedAt: new Date().toISOString() }
    ]
  }
};

/**
 * Get benchmark data for industry and difficulty
 */
export function getBenchmarkData(
  industry: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  metricType: 'revenue' | 'roi' | 'marketShare' | 'brandEquity' | 'score'
): BenchmarkData | null {
  const industryData = BENCHMARK_DATA[industry];
  if (!industryData) return null;

  const difficultyData = industryData[difficulty];
  if (!difficultyData) return null;

  return difficultyData.find(b => b.metricType === metricType) || null;
}

/**
 * Calculate percentile for a given value
 */
export function calculatePercentile(
  value: number,
  benchmark: BenchmarkData
): number {
  if (value >= benchmark.percentile99) return 99;
  if (value >= benchmark.percentile90) {
    // Interpolate between 90 and 99
    const range = benchmark.percentile99 - benchmark.percentile90;
    const position = (value - benchmark.percentile90) / range;
    return 90 + (position * 9);
  }
  if (value >= benchmark.percentile75) {
    // Interpolate between 75 and 90
    const range = benchmark.percentile90 - benchmark.percentile75;
    const position = (value - benchmark.percentile75) / range;
    return 75 + (position * 15);
  }
  if (value >= benchmark.percentile50) {
    // Interpolate between 50 and 75
    const range = benchmark.percentile75 - benchmark.percentile50;
    const position = (value - benchmark.percentile50) / range;
    return 50 + (position * 25);
  }
  // Below median
  const range = benchmark.percentile50;
  const position = value / range;
  return Math.max(0, position * 50);
}

/**
 * Generate benchmark comparison
 */
export function generateBenchmarkComparison(
  yourMetrics: {
    revenue: number;
    roi: number;
    marketShare: number;
    brandEquity: number;
    score: number;
  },
  industry: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): BenchmarkComparison {
  const revenueBenchmark = getBenchmarkData(industry, difficulty, 'revenue');
  const roiBenchmark = getBenchmarkData(industry, difficulty, 'roi');
  const marketShareBenchmark = getBenchmarkData(industry, difficulty, 'marketShare');
  const scoreBenchmark = getBenchmarkData(industry, difficulty, 'score');

  const revenuePercentile = revenueBenchmark
    ? calculatePercentile(yourMetrics.revenue, revenueBenchmark)
    : 50;
  const roiPercentile = roiBenchmark
    ? calculatePercentile(yourMetrics.roi, roiBenchmark)
    : 50;
  const marketSharePercentile = marketShareBenchmark
    ? calculatePercentile(yourMetrics.marketShare, marketShareBenchmark)
    : 50;
  const scorePercentile = scoreBenchmark
    ? calculatePercentile(yourMetrics.score, scoreBenchmark)
    : 50;

  const recommendations: string[] = [];
  const strengths: string[] = [];
  const gaps: string[] = [];

  // Generate recommendations based on gaps
  if (revenuePercentile < 50 && revenueBenchmark) {
    recommendations.push(`Your revenue ($${yourMetrics.revenue.toLocaleString()}) is below the industry median ($${revenueBenchmark.percentile50.toLocaleString()}). Focus on increasing conversion rates and customer acquisition.`);
  }
  if (roiPercentile < 50 && roiBenchmark) {
    recommendations.push(`Your ROI (${yourMetrics.roi.toFixed(1)}%) is below the industry median (${roiBenchmark.percentile50}%). Optimize your budget allocation for better efficiency.`);
  }
  if (marketSharePercentile < 50 && marketShareBenchmark) {
    recommendations.push(`Your market share (${yourMetrics.marketShare.toFixed(1)}%) is below the industry median (${marketShareBenchmark.percentile50}%). Increase brand awareness and competitive positioning.`);
  }

  // Identify strengths
  if (revenuePercentile >= 90) strengths.push('Exceptional revenue performance - top 10%');
  if (roiPercentile >= 90) strengths.push('Outstanding ROI efficiency - top 10%');
  if (marketSharePercentile >= 90) strengths.push('Strong market presence - top 10%');
  if (scorePercentile >= 90) strengths.push('Elite overall performance - top 10%');

  // Identify gaps
  if (revenuePercentile < 25) gaps.push('Revenue significantly below industry average');
  if (roiPercentile < 25) gaps.push('ROI efficiency needs major improvement');
  if (marketSharePercentile < 25) gaps.push('Market share is well below industry average');

  return {
    yourScore: yourMetrics.score,
    industryAverage: scoreBenchmark?.average || 0,
    top10Percentile: scoreBenchmark?.percentile90 || 0,
    top1Percentile: scoreBenchmark?.percentile99 || 0,
    yourPercentile: scorePercentile,

    componentComparison: {
      revenue: {
        you: yourMetrics.revenue,
        avg: revenueBenchmark?.average || 0,
        top10: revenueBenchmark?.percentile90 || 0,
        percentile: revenuePercentile
      },
      roi: {
        you: yourMetrics.roi,
        avg: roiBenchmark?.average || 0,
        top10: roiBenchmark?.percentile90 || 0,
        percentile: roiPercentile
      },
      marketShare: {
        you: yourMetrics.marketShare,
        avg: marketShareBenchmark?.average || 0,
        top10: marketShareBenchmark?.percentile90 || 0,
        percentile: marketSharePercentile
      },
      brandEquity: {
        you: yourMetrics.brandEquity,
        avg: 60, // Default brand equity average
        top10: 80,
        percentile: yourMetrics.brandEquity > 80 ? 90 : yourMetrics.brandEquity > 60 ? 50 : 25
      }
    },

    recommendations,
    strengths,
    gaps
  };
}

