// Comprehensive Knowledge Base for CMO Simulator

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'faq' | 'strategy' | 'glossary' | 'case-study' | 'tips' | 'best-practices';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  related?: string[];
}

// FAQ Section
export const faqItems: KnowledgeItem[] = [
  {
    id: 'budget-allocation-basics',
    title: 'How should I allocate my budget across the marketing funnel?',
    content: 'For balanced growth, allocate approximately 40% to Brand Awareness (top-of-funnel), 35% to Lead Generation (middle-funnel), and 25% to Conversion Optimization (bottom-funnel). However, adjust based on your competitive landscape and business goals. In crowded markets, you may need to allocate more to brand awareness to stand out.',
    category: 'faq',
    tags: ['budget', 'allocation', 'funnel', 'strategy'],
    difficulty: 'beginner',
    related: ['budget-allocation-strategy', 'funnel-optimization']
  },
  {
    id: 'quarterly-planning',
    title: 'How do I plan effectively for each quarter?',
    content: 'Each quarter builds on previous results. Q1 focuses on establishing presence and testing (A/B testing is crucial here). Q2 emphasizes scaling successful tactics and talent acquisition. Q3 focuses on optimization and competitive responses. Q4 consolidates gains and makes strategic bets for long-term growth.',
    category: 'faq',
    tags: ['planning', 'quarters', 'strategy', 'timing'],
    difficulty: 'intermediate',
    related: ['quarter-strategies', 'long-term-planning']
  },
  {
    id: 'wildcard-events',
    title: 'How do I decide whether to respond to wildcard events?',
    content: 'Evaluate wildcards based on cost vs benefit and alignment with your strategy. Some opportunities are worth significant investment if they align with your long-term goals. Others are distractions that can derail your focus. Consider your current budget, competitive position, and the specific impact on your KPIs.',
    category: 'faq',
    tags: ['wildcards', 'decision-making', 'opportunities', 'risk'],
    difficulty: 'intermediate',
    related: ['wildcard-strategy', 'risk-management']
  },
  {
    id: 'kpi-interpretation',
    title: 'How do I interpret my KPI results?',
    content: 'Look beyond individual numbers to understand relationships. High market share but low customer satisfaction indicates acquisition focus over retention. Strong revenue growth with declining profit margins suggests inefficient spending. Compare results against your strategy and competitive landscape for context.',
    category: 'faq',
    tags: ['kpis', 'analysis', 'interpretation', 'metrics'],
    difficulty: 'intermediate',
    related: ['kpi-analysis', 'performance-metrics']
  },
  {
    id: 'time-horizon-choice',
    title: 'Which time horizon should I choose for my simulation?',
    content: '1-year simulations show immediate results and are great for tactical learning. 3-year simulations demonstrate compounding effects and strategic patience. 5-year simulations reveal long-term market dynamics and the power of consistent execution. Choose based on your learning goals.',
    category: 'faq',
    tags: ['time-horizon', 'strategy', 'planning', 'learning'],
    difficulty: 'beginner',
    related: ['strategic-planning', 'long-term-thinking']
  }
];

// Strategy Guide
export const strategyGuideItems: KnowledgeItem[] = [
  {
    id: 'budget-allocation-strategy',
    title: 'Advanced Budget Allocation Strategies',
    content: 'In competitive markets, allocate 50% to brand awareness to establish category leadership. In established markets, focus 45% on conversion optimization to maximize ROI. For growth markets, split evenly across funnel stages. Always reserve 10-15% for opportunistic investments and wildcard responses.',
    category: 'strategy',
    tags: ['budget', 'allocation', 'advanced', 'competition', 'growth'],
    difficulty: 'advanced',
    related: ['competitive-strategy', 'roi-optimization']
  },
  {
    id: 'competitive-positioning',
    title: 'Competitive Positioning Framework',
    content: 'Position as the premium choice when customer satisfaction is your strength. Position as the value leader when cost efficiency drives your advantage. Position as the innovation leader when you have technological advantages. Your positioning should leverage your actual strengths, not aspirational ones.',
    category: 'strategy',
    tags: ['positioning', 'competition', 'branding', 'differentiation'],
    difficulty: 'intermediate',
    related: ['brand-strategy', 'competitive-analysis']
  },
  {
    id: 'customer-acquisition-strategy',
    title: 'Customer Acquisition Cost Optimization',
    content: 'Track CAC by channel and customer segment. SEO provides compounding returns but requires patience. Paid ads offer immediate results but diminishing returns. Content marketing builds long-term assets but needs consistent investment. Optimize by focusing on your most profitable customer segments first.',
    category: 'strategy',
    tags: ['acquisition', 'cac', 'optimization', 'channels', 'profitability'],
    difficulty: 'advanced',
    related: ['customer-segmentation', 'channel-optimization']
  },
  {
    id: 'retention-vs-acquisition',
    title: 'Retention vs Acquisition Balance',
    content: 'Early in your simulation, focus 70% on acquisition to build your customer base. Mid-simulation, shift to 60% retention to maximize lifetime value. Late simulation, emphasize retention (80%) to protect market share. Customer retention is typically 5x more cost-effective than acquisition.',
    category: 'strategy',
    tags: ['retention', 'acquisition', 'lifetime-value', 'balance', 'timing'],
    difficulty: 'intermediate',
    related: ['customer-lifetime-value', 'retention-strategies']
  },
  {
    id: 'crisis-management',
    title: 'Crisis Management and Recovery',
    content: 'In crisis situations, prioritize customer communication and service recovery. Allocate emergency budget for reputation management. Focus on transparent communication rather than aggressive marketing. Recovery takes 2-3 quarters, so plan for sustained investment in trust rebuilding.',
    category: 'strategy',
    tags: ['crisis', 'recovery', 'reputation', 'communication', 'management'],
    difficulty: 'advanced',
    related: ['crisis-response', 'reputation-management']
  }
];

// Marketing Glossary
export const glossaryItems: KnowledgeItem[] = [
  {
    id: 'customer-lifetime-value',
    title: 'Customer Lifetime Value (CLV)',
    content: 'The total revenue a customer generates during their entire relationship with your company. High CLV justifies higher acquisition costs and supports retention-focused strategies. Calculate as: Average Order Value × Purchase Frequency × Customer Lifespan.',
    category: 'glossary',
    tags: ['clv', 'lifetime-value', 'retention', 'profitability'],
    difficulty: 'intermediate',
    related: ['retention-strategies', 'profitability-analysis']
  },
  {
    id: 'customer-acquisition-cost',
    title: 'Customer Acquisition Cost (CAC)',
    content: 'The total cost to acquire a new customer, including all marketing and sales expenses. Should be compared against CLV for profitability analysis. Formula: Total Acquisition Costs ÷ Number of New Customers Acquired.',
    category: 'glossary',
    tags: ['cac', 'acquisition', 'costs', 'profitability'],
    difficulty: 'intermediate',
    related: ['acquisition-strategies', 'roi-analysis']
  },
  {
    id: 'market-share',
    title: 'Market Share',
    content: 'Your company\'s portion of total market sales. Influences pricing power, competitive positioning, and long-term sustainability. Growth requires either expanding the market or taking share from competitors.',
    category: 'glossary',
    tags: ['market-share', 'competition', 'growth', 'positioning'],
    difficulty: 'beginner',
    related: ['competitive-strategy', 'market-expansion']
  },
  {
    id: 'brand-equity',
    title: 'Brand Equity',
    content: 'The value of your brand name and reputation. Strong brand equity allows premium pricing, customer loyalty, and competitive advantages. Built through consistent quality, emotional connections, and positive associations.',
    category: 'glossary',
    tags: ['brand-equity', 'branding', 'reputation', 'loyalty'],
    difficulty: 'intermediate',
    related: ['brand-building', 'reputation-management']
  },
  {
    id: 'conversion-funnel',
    title: 'Marketing Conversion Funnel',
    content: 'The customer journey from awareness to purchase and beyond. Top-of-funnel: Awareness, Middle-of-funnel: Consideration, Bottom-of-funnel: Purchase and Retention. Each stage requires different tactics and metrics.',
    category: 'glossary',
    tags: ['funnel', 'conversion', 'customer-journey', 'stages'],
    difficulty: 'beginner',
    related: ['funnel-optimization', 'customer-journey']
  },
  {
    id: 'churn-rate',
    title: 'Customer Churn Rate',
    content: 'The percentage of customers who stop doing business with you over a given period. High churn indicates problems with product quality, customer service, or competitive positioning. Formula: (Lost Customers ÷ Total Customers) × 100.',
    category: 'glossary',
    tags: ['churn', 'retention', 'customer-loss', 'metrics'],
    difficulty: 'intermediate',
    related: ['retention-strategies', 'customer-service']
  }
];

// Case Studies
export const caseStudyItems: KnowledgeItem[] = [
  {
    id: 'startup-growth-case',
    title: 'Startup Growth: From 0 to Market Leader',
    content: 'TechFlow Inc. started as a B2B SaaS startup in a crowded market. They allocated 60% to lead generation in Q1-Q2, achieving 25% market share. By Q3-Q4, they shifted to 50% retention focus, achieving 85% customer satisfaction and 40% profit margins. Key lesson: Balance aggressive acquisition with retention investment.',
    category: 'case-study',
    tags: ['startup', 'growth', 'saas', 'acquisition', 'retention'],
    difficulty: 'intermediate',
    related: ['startup-strategies', 'growth-tactics']
  },
  {
    id: 'crisis-recovery-case',
    title: 'Crisis Recovery: Reputation Rebuild',
    content: 'After a major product recall, QualityCorp lost 30% market share and saw satisfaction drop to 45%. They invested heavily in customer service (40% of budget) and transparent communication. Within 3 quarters, they recovered to 80% satisfaction and regained market leadership. Lesson: Crisis recovery requires patience and customer focus.',
    category: 'case-study',
    tags: ['crisis', 'recovery', 'reputation', 'customer-service', 'communication'],
    difficulty: 'advanced',
    related: ['crisis-management', 'reputation-strategies']
  },
  {
    id: 'market-disruption-case',
    title: 'Market Disruption: Incumbent Response',
    content: 'Established player MarketCorp faced disruption from agile competitors. They invested in innovation (30% budget) while maintaining brand strength. By Q3, they achieved 15% market share growth through strategic partnerships and customer retention. Lesson: Defend core strengths while innovating.',
    category: 'case-study',
    tags: ['disruption', 'incumbent', 'innovation', 'partnerships', 'defense'],
    difficulty: 'advanced',
    related: ['disruption-strategies', 'defensive-tactics']
  }
];

// Advanced Tips and Tricks
export const advancedTipsItems: KnowledgeItem[] = [
  {
    id: 'wildcard-chaining',
    title: 'Wildcard Event Chaining',
    content: 'Some wildcards create opportunities for follow-up actions. A successful crisis response might enable partnership opportunities. A market expansion wildcard could justify increased R&D investment. Look for these chain reactions to maximize impact.',
    category: 'tips',
    tags: ['wildcards', 'chaining', 'opportunities', 'combinations', 'synergy'],
    difficulty: 'advanced',
    related: ['wildcard-strategies', 'opportunity-maximization']
  },
  {
    id: 'budget-reallocation',
    title: 'Dynamic Budget Reallocation',
    content: 'Don\'t stick rigidly to initial allocations. If Q1 shows strong SEO performance, reallocate budget mid-quarter. If paid ads underperform, shift funds to content marketing. Flexibility in execution often outperforms perfect planning.',
    category: 'tips',
    tags: ['budget', 'flexibility', 'reallocation', 'adaptation', 'performance'],
    difficulty: 'intermediate',
    related: ['budget-optimization', 'performance-adaptation']
  },
  {
    id: 'competitor-analysis',
    title: 'Advanced Competitor Analysis',
    content: 'Track competitor spending patterns and market responses. If competitors increase ad spend, they might be preparing a major launch. Use this intelligence to time your own initiatives and defensive actions.',
    category: 'tips',
    tags: ['competitors', 'analysis', 'intelligence', 'timing', 'defense'],
    difficulty: 'advanced',
    related: ['competitive-intelligence', 'defensive-strategies']
  },
  {
    id: 'momentum-building',
    title: 'Momentum Building Techniques',
    content: 'Create positive feedback loops where early successes enable larger investments. Strong Q1 results justify Q2 expansion. High customer satisfaction enables premium pricing. Build these virtuous cycles for exponential growth.',
    category: 'tips',
    tags: ['momentum', 'feedback-loops', 'growth', 'cycles', 'compounding'],
    difficulty: 'advanced',
    related: ['growth-strategies', 'compounding-effects']
  }
];

// Best Practices
export const bestPracticesItems: KnowledgeItem[] = [
  {
    id: 'data-driven-decisions',
    title: 'Data-Driven Decision Making',
    content: 'Base decisions on simulation results and KPI trends, not intuition. If A/B tests show clear winners, scale them aggressively. If certain channels underperform, reallocate budget immediately. Let data guide your strategy, not guesswork.',
    category: 'best-practices',
    tags: ['data', 'decisions', 'analysis', 'evidence', 'strategy'],
    difficulty: 'intermediate',
    related: ['data-analysis', 'decision-making']
  },
  {
    id: 'continuous-learning',
    title: 'Continuous Learning and Adaptation',
    content: 'Treat each quarter as a learning opportunity. Document what worked and what didn\'t. Apply learnings immediately to subsequent quarters. The best marketers are perpetual students who adapt based on real-world feedback.',
    category: 'best-practices',
    tags: ['learning', 'adaptation', 'improvement', 'feedback', 'growth'],
    difficulty: 'beginner',
    related: ['learning-culture', 'continuous-improvement']
  },
  {
    id: 'risk-management',
    title: 'Strategic Risk Management',
    content: 'Diversify your marketing portfolio across multiple channels and tactics. Never put all your budget into one approach. Maintain emergency reserves for unexpected opportunities or crises. Balance bold bets with conservative core strategies.',
    category: 'best-practices',
    tags: ['risk', 'diversification', 'portfolio', 'balance', 'conservative'],
    difficulty: 'intermediate',
    related: ['risk-management', 'portfolio-theory']
  },
  {
    id: 'long-term-vision',
    title: 'Long-Term Strategic Vision',
    content: 'While quarterly results matter, focus on sustainable, long-term growth. Investments in brand building and customer relationships pay dividends over multiple quarters. Resist the temptation of short-term wins that sacrifice future potential.',
    category: 'best-practices',
    tags: ['long-term', 'vision', 'sustainability', 'growth', 'patience'],
    difficulty: 'advanced',
    related: ['long-term-thinking', 'sustainable-growth']
  }
];

// All knowledge items combined
export const allKnowledgeItems: KnowledgeItem[] = [
  ...faqItems,
  ...strategyGuideItems,
  ...glossaryItems,
  ...caseStudyItems,
  ...advancedTipsItems,
  ...bestPracticesItems
];

// Helper functions
export const getItemsByCategory = (category: string): KnowledgeItem[] => {
  return allKnowledgeItems.filter(item => item.category === category);
};

export const getItemsByDifficulty = (difficulty: string): KnowledgeItem[] => {
  return allKnowledgeItems.filter(item => item.difficulty === difficulty);
};

export const searchKnowledgeItems = (query: string): KnowledgeItem[] => {
  const searchTerm = query.toLowerCase();
  return allKnowledgeItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm) ||
    item.content.toLowerCase().includes(searchTerm) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getRelatedItems = (itemId: string): KnowledgeItem[] => {
  const item = allKnowledgeItems.find(i => i.id === itemId);
  if (!item || !item.related) return [];

  return item.related.map(relatedId =>
    allKnowledgeItems.find(i => i.id === relatedId)
  ).filter(Boolean) as KnowledgeItem[];
};

export const categories = [
  { id: 'faq', label: 'FAQ', description: 'Frequently Asked Questions' },
  { id: 'strategy', label: 'Strategy Guide', description: 'Advanced Marketing Strategies' },
  { id: 'glossary', label: 'Glossary', description: 'Marketing Terms & Definitions' },
  { id: 'case-study', label: 'Case Studies', description: 'Real-World Examples' },
  { id: 'tips', label: 'Tips & Tricks', description: 'Advanced Techniques' },
  { id: 'best-practices', label: 'Best Practices', description: 'Proven Methods' }
];

export const difficulties = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
];
