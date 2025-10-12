export type CompanySizeValue = 'startup' | 'scaleup' | 'enterprise';

export const COMPANY_SIZE_OPTIONS: Array<{
  value: CompanySizeValue;
  label: string;
  description: string;
}> = [
  {
    value: 'startup',
    label: 'Startup',
    description: '1-50 employees, high growth potential',
  },
  {
    value: 'scaleup',
    label: 'Scaleup',
    description: '51-500 employees, expanding market presence',
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: '500+ employees, established market leader',
  },
];

export type MarketLandscapeValue = 'emerging' | 'competitive' | 'niche';

export const MARKET_LANDSCAPE_OPTIONS: Array<{
  value: MarketLandscapeValue;
  label: string;
  description: string;
}> = [
  {
    value: 'emerging',
    label: 'Emerging Market',
    description: 'New category with rapid growth potential',
  },
  {
    value: 'competitive',
    label: 'Highly Competitive',
    description: 'Crowded market with aggressive competitors',
  },
  {
    value: 'niche',
    label: 'Niche Leader',
    description: 'Specialized audience with unique needs',
  },
];

export type TimeHorizonValue = 'short_term' | 'mid_term' | 'long_term';

export const TIME_HORIZON_OPTIONS: Array<{
  value: TimeHorizonValue;
  label: string;
  description: string;
}> = [
  {
    value: 'short_term',
    label: '0-6 Months',
    description: 'Rapid impact, quick wins focus',
  },
  {
    value: 'mid_term',
    label: '6-18 Months',
    description: 'Balanced growth and optimization',
  },
  {
    value: 'long_term',
    label: '18+ Months',
    description: 'Long-term brand building and innovation',
  },
];

export type BudgetBucketKey =
  | 'brandBuilding'
  | 'demandGeneration'
  | 'productInnovation'
  | 'customerExperience';

export const BUDGET_BUCKETS: Array<{
  key: BudgetBucketKey;
  label: string;
  description: string;
  accent: string;
}> = [
  {
    key: 'brandBuilding',
    label: 'Brand Building',
    description: 'Awareness campaigns, PR, sponsorships',
    accent: 'from-fuchsia-500 to-purple-500',
  },
  {
    key: 'demandGeneration',
    label: 'Demand Generation',
    description: 'Paid media, performance marketing, growth',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    key: 'productInnovation',
    label: 'Product Innovation',
    description: 'Research, product marketing, go-to-market',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'customerExperience',
    label: 'Customer Experience',
    description: 'Lifecycle marketing, retention, community',
    accent: 'from-sky-500 to-blue-500',
  },
];

export const DEFAULT_BUDGET_ALLOCATION: Record<BudgetBucketKey, number> = {
  brandBuilding: 25,
  demandGeneration: 25,
  productInnovation: 25,
  customerExperience: 25,
};

export function getCompanySizeLabel(value?: CompanySizeValue | string | null): string {
  if (!value) return 'Not specified';
  return COMPANY_SIZE_OPTIONS.find(option => option.value === value)?.label ?? String(value);
}

export function getMarketLandscapeLabel(value?: MarketLandscapeValue | string | null): string {
  if (!value) return 'Not specified';
  return MARKET_LANDSCAPE_OPTIONS.find(option => option.value === value)?.label ?? String(value);
}

export function getTimeHorizonLabel(value?: TimeHorizonValue | string | null): string {
  if (!value) return 'Not specified';
  return TIME_HORIZON_OPTIONS.find(option => option.value === value)?.label ?? String(value);
}
