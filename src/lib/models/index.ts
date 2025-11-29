/**
 * Mathematical Models Exports
 * Centralized exports for all mathematical models
 */

export {
  calculateMarketShareBass,
  calculateMarketMaturity,
  calculateMarketShareGrowthRate,
  predictMarketShare,
  type MarketShareContext
} from './marketShare';

export {
  calculateAdvancedROI,
  getIndustryCLV,
  calculateCAC,
  calculateROIEfficiency,
  type ROIContext,
  type ROIResult
} from './roi';

export {
  simulateCompetitiveResponse,
  calculateCompetitiveIntensity,
  predictCompetitorActions,
  type CompetitiveContext
} from './competitive';

