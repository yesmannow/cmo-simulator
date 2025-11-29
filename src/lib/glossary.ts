/**
 * Comprehensive Marketing Glossary
 * Provides detailed definitions for all marketing terms used in the simulator
 * Written for users with no prior marketing knowledge
 */

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  simpleExplanation: string; // For users with no background
  example: string;
  relatedTerms: string[];
  category: 'strategy' | 'metrics' | 'tactics' | 'finance' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const glossary: GlossaryTerm[] = [
  // ============================================================================
  // FINANCIAL METRICS
  // ============================================================================
  {
    id: 'revenue',
    term: 'Revenue',
    definition: 'The total amount of money generated from sales of products or services before any expenses are deducted.',
    simpleExplanation: 'Think of revenue as all the money that comes into your business from customers buying your products or services. It\'s the "top line" number before you subtract costs.',
    example: 'If you sell 100 products at $50 each, your revenue is $5,000.',
    relatedTerms: ['profit', 'roi', 'customer-lifetime-value'],
    category: 'finance',
    difficulty: 'beginner',
  },
  {
    id: 'profit',
    term: 'Profit',
    definition: 'The money left over after subtracting all expenses (costs, salaries, marketing spend) from revenue.',
    simpleExplanation: 'Profit is what you actually get to keep. It\'s like your allowance after you\'ve paid all your bills. Revenue minus all costs equals profit.',
    example: 'If you make $5,000 in revenue but spent $3,000 on marketing and other costs, your profit is $2,000.',
    relatedTerms: ['revenue', 'roi', 'budget'],
    category: 'finance',
    difficulty: 'beginner',
  },
  {
    id: 'roi',
    term: 'ROI (Return on Investment)',
    definition: 'A percentage that shows how much profit you made compared to how much you spent. Formula: ((Revenue - Cost) / Cost) × 100',
    simpleExplanation: 'ROI tells you if your marketing is worth it. If you spend $100 and make $150, your ROI is 50% - meaning you got back your $100 plus $50 extra.',
    example: 'Spend $10,000 on ads, generate $15,000 in revenue. ROI = (($15,000 - $10,000) / $10,000) × 100 = 50%',
    relatedTerms: ['revenue', 'profit', 'customer-acquisition-cost'],
    category: 'finance',
    difficulty: 'beginner',
  },
  {
    id: 'budget',
    term: 'Budget',
    definition: 'The total amount of money you have available to spend on marketing activities over a specific period.',
    simpleExplanation: 'Your budget is like your wallet for marketing. It\'s the total money you can spend on ads, content, events, and other marketing activities.',
    example: 'A $2,000,000 annual budget means you can spend up to $500,000 per quarter on marketing.',
    relatedTerms: ['revenue', 'profit', 'allocation'],
    category: 'finance',
    difficulty: 'beginner',
  },
  {
    id: 'customer-acquisition-cost',
    term: 'Customer Acquisition Cost (CAC)',
    definition: 'The average amount of money you spend to get one new customer. Formula: Total Marketing Spend ÷ Number of New Customers',
    simpleExplanation: 'CAC tells you how expensive it is to get each new customer. If you spend $1,000 on marketing and get 10 new customers, your CAC is $100 per customer.',
    example: 'Spend $50,000 on marketing, acquire 500 customers. CAC = $50,000 ÷ 500 = $100 per customer',
    relatedTerms: ['roi', 'customer-lifetime-value', 'conversion-rate'],
    category: 'finance',
    difficulty: 'intermediate',
  },
  {
    id: 'customer-lifetime-value',
    term: 'Customer Lifetime Value (CLV)',
    definition: 'The total amount of money a customer will spend with your business over their entire relationship with you.',
    simpleExplanation: 'CLV is how much money one customer gives you over their lifetime. If a customer buys from you 10 times at $50 each, their CLV is $500.',
    example: 'Average customer buys 4 times per year at $100 each, stays for 3 years. CLV = 4 × $100 × 3 = $1,200',
    relatedTerms: ['customer-acquisition-cost', 'retention', 'revenue'],
    category: 'finance',
    difficulty: 'intermediate',
  },

  // ============================================================================
  // MARKETING METRICS
  // ============================================================================
  {
    id: 'market-share',
    term: 'Market Share',
    definition: 'The percentage of total sales in your industry that your company captures. Shows your competitive position.',
    simpleExplanation: 'Market share is your slice of the pie. If the entire market is $10 million and you make $1 million, you have 10% market share.',
    example: 'Total industry sales = $100M. Your sales = $10M. Market share = 10%',
    relatedTerms: ['competition', 'brand-awareness', 'revenue'],
    category: 'metrics',
    difficulty: 'beginner',
  },
  {
    id: 'brand-awareness',
    term: 'Brand Awareness',
    definition: 'The percentage of people in your target market who recognize and remember your brand name.',
    simpleExplanation: 'Brand awareness is how many people know who you are. If 30% of people recognize your brand, you have 30% brand awareness.',
    example: 'Survey 1,000 people. 300 recognize your brand. Brand awareness = 30%',
    relatedTerms: ['market-share', 'brand-equity', 'advertising'],
    category: 'metrics',
    difficulty: 'beginner',
  },
  {
    id: 'customer-satisfaction',
    term: 'Customer Satisfaction',
    definition: 'A measure of how happy your customers are with your products, services, and overall experience.',
    simpleExplanation: 'Customer satisfaction is how happy your customers are. Happy customers buy more, tell friends, and stay longer.',
    example: 'Survey customers: 85% say they\'re satisfied. Customer satisfaction = 85%',
    relatedTerms: ['retention', 'brand-equity', 'customer-lifetime-value'],
    category: 'metrics',
    difficulty: 'beginner',
  },
  {
    id: 'conversion-rate',
    term: 'Conversion Rate',
    definition: 'The percentage of visitors or leads who take a desired action (like making a purchase). Formula: (Conversions ÷ Visitors) × 100',
    simpleExplanation: 'Conversion rate is how many people actually buy (or do what you want) out of everyone who visits. If 100 people visit and 5 buy, conversion rate is 5%.',
    example: '1,000 website visitors, 50 make purchases. Conversion rate = (50 ÷ 1,000) × 100 = 5%',
    relatedTerms: ['traffic', 'leads', 'revenue'],
    category: 'metrics',
    difficulty: 'beginner',
  },
  {
    id: 'traffic',
    term: 'Traffic',
    definition: 'The number of people who visit your website, store, or see your marketing materials.',
    simpleExplanation: 'Traffic is how many people see your stuff. More traffic usually means more potential customers, but quality matters too.',
    example: 'Your website gets 10,000 visitors this month. That\'s your traffic.',
    relatedTerms: ['conversion-rate', 'leads', 'advertising'],
    category: 'metrics',
    difficulty: 'beginner',
  },
  {
    id: 'leads',
    term: 'Leads',
    definition: 'People who have shown interest in your product or service by taking an action like filling out a form, downloading content, or requesting information.',
    simpleExplanation: 'Leads are potential customers who raised their hand and said "I\'m interested." They\'re not customers yet, but they might become one.',
    example: '500 people download your free guide. These are leads - people interested in what you offer.',
    relatedTerms: ['conversion-rate', 'traffic', 'customer-acquisition-cost'],
    category: 'metrics',
    difficulty: 'beginner',
  },

  // ============================================================================
  // STRATEGIC CONCEPTS
  // ============================================================================
  {
    id: 'brand-equity',
    term: 'Brand Equity',
    definition: 'The value and strength of your brand name. Strong brand equity means people trust you, pay more for your products, and choose you over competitors.',
    simpleExplanation: 'Brand equity is how valuable your brand name is. Apple has high brand equity - people pay more and trust them more than unknown brands.',
    example: 'Two identical products: one with strong brand equity sells for $100, generic version sells for $50.',
    relatedTerms: ['brand-awareness', 'customer-satisfaction', 'market-share'],
    category: 'strategy',
    difficulty: 'intermediate',
  },
  {
    id: 'target-audience',
    term: 'Target Audience',
    definition: 'The specific group of people you want to reach with your marketing. Defined by demographics, interests, pain points, and behaviors.',
    simpleExplanation: 'Your target audience is who you\'re trying to sell to. Instead of "everyone," you focus on people most likely to buy.',
    example: 'Target audience: "Small business owners, age 35-55, struggling with cash flow, tech-savvy"',
    relatedTerms: ['positioning', 'messaging', 'channels'],
    category: 'strategy',
    difficulty: 'beginner',
  },
  {
    id: 'positioning',
    term: 'Brand Positioning',
    definition: 'How you want customers to think about your brand compared to competitors. Your unique place in the market.',
    simpleExplanation: 'Positioning is how you want to be seen. Are you the premium option? The affordable one? The innovative leader?',
    example: 'Tesla positions as "innovative electric vehicles." Toyota positions as "reliable and affordable."',
    relatedTerms: ['target-audience', 'brand-equity', 'competition'],
    category: 'strategy',
    difficulty: 'intermediate',
  },
  {
    id: 'funnel',
    term: 'Marketing Funnel',
    definition: 'The customer journey from first hearing about you (awareness) to buying (conversion) to becoming a repeat customer (retention).',
    simpleExplanation: 'The funnel shows how customers move from "never heard of you" to "loyal customer." It\'s wide at the top (many people aware) and narrow at the bottom (fewer buyers).',
    example: 'Top: 10,000 people aware → Middle: 1,000 interested → Bottom: 100 buyers',
    relatedTerms: ['conversion-rate', 'traffic', 'retention'],
    category: 'strategy',
    difficulty: 'beginner',
  },
  {
    id: 'channels',
    term: 'Marketing Channels',
    definition: 'The different ways you reach customers: Google Ads, Facebook, email, SEO, events, partnerships, etc.',
    simpleExplanation: 'Channels are the different places you advertise. Like TV, radio, internet, or in-person events - but for digital marketing.',
    example: 'Channels: Google Ads (paid search), Facebook (social media), Email (direct), SEO (free search)',
    relatedTerms: ['tactics', 'traffic', 'budget-allocation'],
    category: 'strategy',
    difficulty: 'beginner',
  },

  // ============================================================================
  // TACTICS & METHODS
  // ============================================================================
  {
    id: 'tactics',
    term: 'Marketing Tactics',
    definition: 'Specific actions you take to achieve marketing goals. Examples: running Google Ads, creating blog content, hosting webinars, sponsoring events.',
    simpleExplanation: 'Tactics are the specific things you do. Strategy is "increase brand awareness." Tactics are "run Facebook ads" or "create YouTube videos."',
    example: 'Tactics: Google Ads campaign, email newsletter, trade show booth, influencer partnership',
    relatedTerms: ['strategy', 'channels', 'budget'],
    category: 'tactics',
    difficulty: 'beginner',
  },
  {
    id: 'seo',
    term: 'SEO (Search Engine Optimization)',
    definition: 'Making your website show up higher in Google search results without paying for ads. Done through quality content, keywords, and technical optimization.',
    simpleExplanation: 'SEO is getting Google to show your website for free when people search. Instead of paying for ads, you optimize your site to rank naturally.',
    example: 'Someone searches "best marketing software." Your SEO-optimized site appears #1 in results (not in the ads section).',
    relatedTerms: ['content-marketing', 'traffic', 'organic'],
    category: 'tactics',
    difficulty: 'intermediate',
  },
  {
    id: 'content-marketing',
    term: 'Content Marketing',
    definition: 'Creating valuable content (blogs, videos, guides) that attracts and educates potential customers, building trust and driving sales over time.',
    simpleExplanation: 'Content marketing is teaching and helping people instead of just selling. You write helpful articles, make videos, create guides - and people trust you more.',
    example: 'A software company writes "How to Choose Marketing Software" guide. People read it, trust the company, and buy.',
    relatedTerms: ['seo', 'brand-awareness', 'leads'],
    category: 'tactics',
    difficulty: 'beginner',
  },
  {
    id: 'paid-ads',
    term: 'Paid Advertising',
    definition: 'Paying platforms (Google, Facebook, etc.) to show your ads to potential customers. You pay per click or per impression.',
    simpleExplanation: 'Paid ads are like renting a billboard, but online. You pay Google or Facebook to show your ad to people searching or browsing.',
    example: 'Pay Google $1 per click. 1,000 people click = $1,000 spent. Some of those clicks become customers.',
    relatedTerms: ['traffic', 'customer-acquisition-cost', 'roi'],
    category: 'tactics',
    difficulty: 'beginner',
  },
  {
    id: 'email-marketing',
    term: 'Email Marketing',
    definition: 'Sending emails to people who have given you permission, to build relationships, share updates, and drive sales.',
    simpleExplanation: 'Email marketing is sending newsletters, promotions, and updates to people who signed up. It\'s direct communication with people who already know you.',
    example: 'Send weekly newsletter to 10,000 subscribers. Include product updates and special offers. Some click and buy.',
    relatedTerms: ['leads', 'retention', 'conversion-rate'],
    category: 'tactics',
    difficulty: 'beginner',
  },
  {
    id: 'social-media',
    term: 'Social Media Marketing',
    definition: 'Using platforms like Facebook, Instagram, LinkedIn, Twitter to connect with customers, share content, and build your brand.',
    simpleExplanation: 'Social media marketing is being active on Facebook, Instagram, etc. You post content, respond to comments, run ads, and build a community.',
    example: 'Post daily on Instagram, respond to comments, run ads to new followers, share behind-the-scenes content.',
    relatedTerms: ['brand-awareness', 'content-marketing', 'engagement'],
    category: 'tactics',
    difficulty: 'beginner',
  },

  // ============================================================================
  // ADVANCED CONCEPTS
  // ============================================================================
  {
    id: 'retention',
    term: 'Customer Retention',
    definition: 'Keeping existing customers coming back to buy again. Much cheaper than acquiring new customers.',
    simpleExplanation: 'Retention is getting customers to buy again. It\'s easier and cheaper to keep a customer than find a new one.',
    example: 'Customer buys once. You email them, offer loyalty rewards. They buy 3 more times this year. That\'s retention.',
    relatedTerms: ['customer-lifetime-value', 'customer-satisfaction', 'email-marketing'],
    category: 'strategy',
    difficulty: 'intermediate',
  },
  {
    id: 'churn',
    term: 'Churn Rate',
    definition: 'The percentage of customers who stop buying from you over a period. High churn means customers are leaving.',
    simpleExplanation: 'Churn is how many customers you\'re losing. If 10% of customers stop buying each year, your churn rate is 10%.',
    example: 'Start with 1,000 customers. 100 stop buying this year. Churn rate = 10%',
    relatedTerms: ['retention', 'customer-satisfaction', 'customer-lifetime-value'],
    category: 'metrics',
    difficulty: 'intermediate',
  },
  {
    id: 'compounding',
    term: 'Compounding Growth',
    definition: 'When investments grow over time, and the growth itself creates more growth. Like interest earning interest.',
    simpleExplanation: 'Compounding is when your investment keeps growing because the growth itself creates more growth. Like a snowball rolling downhill.',
    example: 'SEO content you create in Q1 brings traffic. In Q2, that content ranks higher, bringing more traffic. In Q3, even more. It compounds.',
    relatedTerms: ['seo', 'content-marketing', 'long-term'],
    category: 'strategy',
    difficulty: 'advanced',
  },
  {
    id: 'diminishing-returns',
    term: 'Diminishing Returns',
    definition: 'When spending more money gives you less and less benefit. The first $1,000 might get great results, but the next $1,000 gets worse results.',
    simpleExplanation: 'Diminishing returns means the more you spend, the less you get back. Like eating pizza - the first slice is amazing, the 10th slice is just okay.',
    example: 'First $10,000 on ads: 100 customers. Next $10,000: 80 customers. Next $10,000: 60 customers. Returns are diminishing.',
    relatedTerms: ['budget-allocation', 'roi', 'efficiency'],
    category: 'strategy',
    difficulty: 'intermediate',
  },
  {
    id: 'share-of-voice',
    term: 'Share of Voice',
    definition: 'Your advertising spending compared to total industry spending. Higher share of voice usually means higher market share.',
    simpleExplanation: 'Share of voice is how loud you are compared to competitors. If you spend 20% of all industry ad dollars, you have 20% share of voice.',
    example: 'Total industry ad spend = $10M. Your spend = $2M. Share of voice = 20%',
    relatedTerms: ['market-share', 'competition', 'budget'],
    category: 'strategy',
    difficulty: 'advanced',
  },
];

/**
 * Get a term by ID
 */
export function getTerm(id: string): GlossaryTerm | undefined {
  return glossary.find(term => term.id === id);
}

/**
 * Get all terms in a category
 */
export function getTermsByCategory(category: GlossaryTerm['category']): GlossaryTerm[] {
  return glossary.filter(term => term.category === category);
}

/**
 * Get terms by difficulty level
 */
export function getTermsByDifficulty(difficulty: GlossaryTerm['difficulty']): GlossaryTerm[] {
  return glossary.filter(term => term.difficulty === difficulty);
}

/**
 * Search terms by keyword
 */
export function searchTerms(keyword: string): GlossaryTerm[] {
  const lowerKeyword = keyword.toLowerCase();
  return glossary.filter(term =>
    term.term.toLowerCase().includes(lowerKeyword) ||
    term.definition.toLowerCase().includes(lowerKeyword) ||
    term.simpleExplanation.toLowerCase().includes(lowerKeyword) ||
    term.relatedTerms.some(rt => rt.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * Get related terms for a given term
 */
export function getRelatedTerms(termId: string): GlossaryTerm[] {
  const term = getTerm(termId);
  if (!term) return [];

  return term.relatedTerms
    .map(id => getTerm(id))
    .filter((t): t is GlossaryTerm => t !== undefined);
}

