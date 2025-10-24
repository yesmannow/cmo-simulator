/**
 * AI Insights Engine
 * Generates intelligent recommendations and insights using AI
 */

import { 
  Channel, 
  Industry, 
  QuarterlyResults, 
  AIRecommendation, 
  MarketInsight,
  ImpactPrediction 
} from '@/types';

// ============================================================================
// AI CONFIGURATION
// ============================================================================

const AI_CONFIG = {
  provider: process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai', // 'openai' or 'anthropic'
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  model: process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-4-turbo-preview',
  maxTokens: 1000,
  temperature: 0.7
};

// ============================================================================
// INSIGHT TYPES
// ============================================================================

export interface InsightContext {
  industry: Industry;
  currentQuarter: string;
  quarterlyResults: QuarterlyResults;
  channelSpends: Record<Channel, number>;
  totalBudget: number;
  marketShare: number;
  competitorActions?: string[];
  recentDecisions?: string[];
}

export interface OptimizationSuggestion {
  channel: Channel;
  currentSpend: number;
  suggestedSpend: number;
  expectedImpact: ImpactPrediction;
  reasoning: string[];
}

// ============================================================================
// AI INSIGHTS SERVICE
// ============================================================================

export class AIInsightsService {
  private static instance: AIInsightsService;
  private cache: Map<string, AIRecommendation[]> = new Map();
  private requestQueue: Promise<unknown>[] = [];

  private constructor() {}

  static getInstance(): AIInsightsService {
    if (!AIInsightsService.instance) {
      AIInsightsService.instance = new AIInsightsService();
    }
    return AIInsightsService.instance;
  }

  /**
   * Generate recommendations based on current performance
   */
  async generateRecommendations(
    context: InsightContext
  ): Promise<AIRecommendation[]> {
    const cacheKey = `recommendations_${context.currentQuarter}_${context.quarterlyResults.revenue}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) || [];
    }

    try {
      // In development, use mock recommendations
      if (process.env.NODE_ENV === 'development' || !AI_CONFIG.apiKey) {
        return this.generateMockRecommendations(context);
      }

      // Call AI API
      const recommendations = await this.callAI(
        this.buildRecommendationPrompt(context)
      );

      // Cache results
      this.cache.set(cacheKey, recommendations);

      return recommendations;
    } catch (error) {
      console.error('[AI Insights] Failed to generate recommendations:', error);
      return this.generateMockRecommendations(context);
    }
  }

  /**
   * Analyze channel performance and suggest optimizations
   */
  async analyzeChannelPerformance(
    context: InsightContext
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    // Analyze each channel
    for (const [channel, performance] of Object.entries(context.quarterlyResults.channel_performance)) {
      const currentSpend = context.channelSpends[channel as Channel] || 0;
      const roi = performance.roi;

      // High ROI channels - suggest increasing spend
      if (roi > 300 && currentSpend < context.totalBudget * 0.3) {
        suggestions.push({
          channel: channel as Channel,
          currentSpend,
          suggestedSpend: currentSpend * 1.5,
          expectedImpact: {
            revenue_change: currentSpend * 0.5 * (roi / 100),
            market_share_change: 2,
            brand_equity_change: 5,
            confidence: 75,
            risk_level: 'low'
          },
          reasoning: [
            `${channel} has exceptional ROI of ${roi}%`,
            'Increasing investment could yield significant returns',
            'Market conditions favor this channel'
          ]
        });
      }

      // Low ROI channels - suggest decreasing spend
      if (roi < 100 && currentSpend > context.totalBudget * 0.05) {
        suggestions.push({
          channel: channel as Channel,
          currentSpend,
          suggestedSpend: currentSpend * 0.7,
          expectedImpact: {
            revenue_change: 0,
            market_share_change: -1,
            brand_equity_change: -2,
            confidence: 80,
            risk_level: 'low'
          },
          reasoning: [
            `${channel} has low ROI of ${roi}%`,
            'Reallocating budget could improve overall performance',
            'Consider testing different strategies for this channel'
          ]
        });
      }
    }

    return suggestions;
  }

  /**
   * Predict impact of a decision
   */
  async predictImpact(
    context: InsightContext,
    proposedChanges: Record<Channel, number>
  ): Promise<ImpactPrediction> {
    // Calculate expected impact based on historical data
    let totalRevenueChange = 0;
    let marketShareChange = 0;
    let brandEquityChange = 0;

    for (const [channel, newSpend] of Object.entries(proposedChanges)) {
      const currentSpend = context.channelSpends[channel as Channel] || 0;
      const spendChange = newSpend - currentSpend;
      const performance = context.quarterlyResults.channel_performance[channel as Channel];

      if (performance) {
        const roi = performance.roi / 100;
        totalRevenueChange += spendChange * roi;
        marketShareChange += (spendChange / context.totalBudget) * 5;
        brandEquityChange += (spendChange / context.totalBudget) * 10;
      }
    }

    return {
      revenue_change: totalRevenueChange,
      market_share_change: marketShareChange,
      brand_equity_change: brandEquityChange,
      confidence: 70,
      risk_level: Math.abs(totalRevenueChange) > context.totalBudget * 0.5 ? 'high' : 'medium'
    };
  }

  /**
   * Generate market insights
   */
  async generateMarketInsights(
    context: InsightContext
  ): Promise<MarketInsight[]> {
    const insights: MarketInsight[] = [];

    // Trend analysis
    if (context.quarterlyResults.vs_previous_quarter?.trend === 'improving') {
      insights.push({
        id: crypto.randomUUID(),
        simulation_id: crypto.randomUUID(),
        quarter: context.currentQuarter as any,
        category: 'trend',
        title: 'Positive Growth Trajectory',
        description: 'Your marketing performance is improving quarter over quarter. This indicates effective strategy execution.',
        impact_level: 'high',
        actionable: true,
        related_channels: this.getTopPerformingChannels(context),
        created_at: new Date().toISOString()
      });
    }

    // Market share insights
    if (context.marketShare < 10) {
      insights.push({
        id: crypto.randomUUID(),
        simulation_id: crypto.randomUUID(),
        quarter: context.currentQuarter as any,
        category: 'market',
        title: 'Market Share Opportunity',
        description: 'Your current market share is below 10%. There is significant room for growth through aggressive marketing.',
        impact_level: 'high',
        actionable: true,
        created_at: new Date().toISOString()
      });
    }

    // Industry-specific insights
    insights.push(...this.getIndustryInsights(context));

    return insights;
  }

  /**
   * Explain a metric in natural language
   */
  async explainMetric(
    metricName: string,
    value: number,
    context: InsightContext
  ): Promise<string> {
    const explanations: Record<string, (val: number, ctx: InsightContext) => string> = {
      roi: (val) => {
        if (val > 200) return `Excellent! Your ROI of ${val}% means you're earning $${val/100} for every dollar spent. This is well above industry average.`;
        if (val > 100) return `Good ROI of ${val}%. You're profitable, earning $${val/100} for every dollar spent.`;
        return `Your ROI of ${val}% is below break-even. Consider optimizing your channel mix.`;
      },
      market_share: (val) => {
        if (val > 20) return `Strong market position at ${val}% market share. You're a major player in the ${context.industry} industry.`;
        if (val > 10) return `Solid market share of ${val}%. There's room to grow and capture more of the market.`;
        return `Market share of ${val}% indicates you're still building presence. Focus on growth strategies.`;
      },
      brand_equity: (val) => {
        if (val > 75) return `Exceptional brand equity score of ${val}/100. Your brand is highly valued by customers.`;
        if (val > 50) return `Good brand equity at ${val}/100. Continue building brand awareness and trust.`;
        return `Brand equity of ${val}/100 needs improvement. Invest in brand-building activities.`;
      }
    };

    const explainer = explanations[metricName];
    return explainer ? explainer(value, context) : `${metricName}: ${value}`;
  }

  /**
   * Build prompt for AI recommendations
   */
  private buildRecommendationPrompt(context: InsightContext): string {
    return `
You are an expert marketing strategist analyzing performance for a ${context.industry} company.

Current Performance:
- Revenue: $${context.quarterlyResults.revenue.toLocaleString()}
- ROI: ${context.quarterlyResults.roi}%
- Market Share: ${context.marketShare}%
- Budget: $${context.totalBudget.toLocaleString()}

Channel Performance:
${Object.entries(context.quarterlyResults.channel_performance)
  .map(([channel, perf]) => `- ${channel}: $${perf.spend} spent, ${perf.roi}% ROI, ${perf.conversions} conversions`)
  .join('\n')}

Provide 3-5 actionable recommendations to improve performance. For each recommendation:
1. Identify the specific issue or opportunity
2. Suggest concrete actions
3. Estimate the potential impact
4. Assess the risk level

Format as JSON array of recommendations.
    `.trim();
  }

  /**
   * Call AI API (OpenAI or Anthropic)
   */
  private async callAI(prompt: string): Promise<AIRecommendation[]> {
    if (AI_CONFIG.provider === 'openai') {
      return this.callOpenAI(prompt);
    } else {
      return this.callAnthropic(prompt);
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<AIRecommendation[]> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: 'You are an expert marketing strategist.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(prompt: string): Promise<AIRecommendation[]> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_CONFIG.apiKey || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: AI_CONFIG.maxTokens,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    return JSON.parse(data.content[0].text);
  }

  /**
   * Generate mock recommendations (for development)
   */
  private generateMockRecommendations(context: InsightContext): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Find best and worst performing channels
    const channelPerformance = Object.entries(context.quarterlyResults.channel_performance)
      .map(([channel, perf]) => ({ channel: channel as Channel, ...perf }))
      .sort((a, b) => b.roi - a.roi);

    const bestChannel = channelPerformance[0];
    const worstChannel = channelPerformance[channelPerformance.length - 1];

    // Recommendation 1: Increase spend on best channel
    if (bestChannel.roi > 150) {
      recommendations.push({
        id: crypto.randomUUID(),
        simulation_id: crypto.randomUUID(),
        quarter: context.currentQuarter as any,
        type: 'optimization',
        priority: 'high',
        title: `Scale Up ${bestChannel.channel.toUpperCase()} Investment`,
        description: `Your ${bestChannel.channel} channel is performing exceptionally well with ${bestChannel.roi}% ROI.`,
        suggested_action: `Increase ${bestChannel.channel} budget by 30-50% to capitalize on this high-performing channel.`,
        expected_impact: {
          revenue_change: bestChannel.spend * 0.4 * (bestChannel.roi / 100),
          market_share_change: 3,
          brand_equity_change: 5,
          confidence: 80,
          risk_level: 'low'
        },
        reasoning: [
          `${bestChannel.channel} has the highest ROI at ${bestChannel.roi}%`,
          'Market conditions are favorable for this channel',
          'Scaling proven winners reduces risk while maximizing returns'
        ],
        data_points: {
          current_spend: bestChannel.spend,
          current_roi: bestChannel.roi,
          conversions: bestChannel.conversions
        },
        dismissed: false,
        created_at: new Date().toISOString()
      });
    }

    // Recommendation 2: Optimize or reduce worst channel
    if (worstChannel.roi < 100) {
      recommendations.push({
        id: crypto.randomUUID(),
        simulation_id: crypto.randomUUID(),
        quarter: context.currentQuarter as any,
        type: 'warning',
        priority: 'medium',
        title: `Optimize ${worstChannel.channel.toUpperCase()} Strategy`,
        description: `${worstChannel.channel} is underperforming with only ${worstChannel.roi}% ROI.`,
        suggested_action: `Consider reducing ${worstChannel.channel} spend by 20-30% and reallocating to higher-performing channels.`,
        expected_impact: {
          revenue_change: 0,
          market_share_change: 0,
          brand_equity_change: -2,
          confidence: 70,
          risk_level: 'low'
        },
        reasoning: [
          `${worstChannel.channel} ROI of ${worstChannel.roi}% is below break-even`,
          'Reallocating budget could improve overall performance',
          'Test different messaging or targeting for this channel'
        ],
        data_points: {
          current_spend: worstChannel.spend,
          current_roi: worstChannel.roi,
          conversions: worstChannel.conversions
        },
        dismissed: false,
        created_at: new Date().toISOString()
      });
    }

    // Recommendation 3: Market share opportunity
    if (context.marketShare < 15) {
      recommendations.push({
        id: crypto.randomUUID(),
        simulation_id: crypto.randomUUID(),
        quarter: context.currentQuarter as any,
        type: 'opportunity',
        priority: 'high',
        title: 'Market Share Growth Opportunity',
        description: `At ${context.marketShare}% market share, there's significant room for growth.`,
        suggested_action: 'Increase overall marketing budget by 20% and focus on brand awareness channels.',
        expected_impact: {
          revenue_change: context.totalBudget * 0.2 * 1.5,
          market_share_change: 5,
          brand_equity_change: 10,
          confidence: 65,
          risk_level: 'medium'
        },
        reasoning: [
          'Low market share indicates untapped potential',
          'Aggressive growth strategy could capture market share',
          'Competitors may be vulnerable to disruption'
        ],
        data_points: {
          current_market_share: context.marketShare,
          total_budget: context.totalBudget
        },
        dismissed: false,
        created_at: new Date().toISOString()
      });
    }

    return recommendations;
  }

  /**
   * Get top performing channels
   */
  private getTopPerformingChannels(context: InsightContext): Channel[] {
    return Object.entries(context.quarterlyResults.channel_performance)
      .sort(([, a], [, b]) => b.roi - a.roi)
      .slice(0, 3)
      .map(([channel]) => channel as Channel);
  }

  /**
   * Get industry-specific insights
   */
  private getIndustryInsights(context: InsightContext): MarketInsight[] {
    const industryTips: Record<Industry, string> = {
      healthcare: 'Healthcare marketing requires trust-building. Focus on educational content and patient testimonials.',
      legal: 'Legal services benefit from thought leadership. Invest in content marketing and SEO.',
      ecommerce: 'E-commerce thrives on retargeting and social proof. Optimize your conversion funnel.',
      saas: 'SaaS marketing should focus on free trials and product-led growth strategies.',
      fintech: 'Fintech requires security messaging and regulatory compliance in all marketing.',
      education: 'Educational institutions should leverage seasonal enrollment periods.',
      'real-estate': 'Real estate marketing benefits from local SEO and virtual tours.',
      'food-delivery': 'Food delivery apps should focus on retention and repeat orders.',
      fitness: 'Fitness marketing peaks in January and summer. Plan campaigns accordingly.',
      automotive: 'Automotive marketing requires long consideration periods. Nurture leads.',
      travel: 'Travel marketing is highly seasonal. Adjust budgets for peak booking periods.',
      gaming: 'Gaming marketing should leverage influencers and community building.',
      fashion: 'Fashion marketing requires trend awareness and visual storytelling.',
      construction: 'Construction services benefit from case studies and project showcases.',
      energy: 'Energy sector marketing should emphasize sustainability and cost savings.',
      agritech: 'AgriTech marketing should focus on ROI and practical demonstrations.',
      manufacturing: 'Manufacturing marketing requires technical content and trade shows.',
      nonprofit: 'Nonprofit marketing should emphasize impact stories and donor relationships.',
      music: 'Music marketing thrives on social media and viral content.',
      sports: 'Sports marketing should leverage event-based campaigns and partnerships.',
      'pet-care': 'Pet care marketing benefits from emotional storytelling and user-generated content.',
      'home-services': 'Home services marketing should focus on local SEO and reviews.',
      cannabis: 'Cannabis marketing faces regulatory restrictions. Focus on education and compliance.',
      space: 'Space industry marketing requires thought leadership and innovation messaging.'
    };

    return [{
      id: crypto.randomUUID(),
      simulation_id: crypto.randomUUID(),
      quarter: context.currentQuarter as any,
      category: 'market',
      title: `${context.industry} Industry Insight`,
      description: industryTips[context.industry],
      impact_level: 'medium',
      actionable: true,
      created_at: new Date().toISOString()
    }];
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const aiInsights = AIInsightsService.getInstance();

export const generateRecommendations = (context: InsightContext) =>
  aiInsights.generateRecommendations(context);

export const analyzeChannelPerformance = (context: InsightContext) =>
  aiInsights.analyzeChannelPerformance(context);

export const predictImpact = (
  context: InsightContext,
  proposedChanges: Record<Channel, number>
) => aiInsights.predictImpact(context, proposedChanges);

export const explainMetric = (
  metricName: string,
  value: number,
  context: InsightContext
) => aiInsights.explainMetric(metricName, value, context);
