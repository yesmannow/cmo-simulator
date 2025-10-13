// AI Commentator/Story Bot System - Enhanced Version

export interface CommentaryContext {
  companyName: string;
  userName: string;
  currentQuarter: string;
  currentBudget: number;
  remainingBudget: number;
  recentDecisions: string[];
  currentKPIs: {
    revenue: number;
    profit: number;
    marketShare: number;
    customerSatisfaction: number;
    brandAwareness: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  phase: 'setup' | 'strategy' | 'quarter' | 'debrief' | 'completed';
  recentEvents: string[];
  decisionHistory: DecisionRecord[];
  teamMembers: {
    marketing: string[];
    finance: string[];
    sales: string[];
  };
}

export interface DecisionRecord {
  quarter: string;
  decision: string;
  outcome: string;
  impact: 'positive' | 'negative' | 'neutral';
  kpiChanges: Partial<CommentaryContext['currentKPIs']>;
}

export interface CommentaryResponse {
  type: 'encouragement' | 'warning' | 'insight' | 'question' | 'celebration' | 'guidance' | 'analysis' | 'motivation';
  message: string;
  suggestions?: string[];
  nextSteps?: string[];
  confidence?: number; // 0-1, how confident the commentary is
  emotionalTone?: 'excited' | 'concerned' | 'optimistic' | 'realistic' | 'urgent';
  strategicImportance?: 'low' | 'medium' | 'high' | 'critical';
}

export class EnhancedStoryBot {
  private context: CommentaryContext;
  private commentaryHistory: string[] = [];
  private personalityTraits: {
    formality: 'casual' | 'professional' | 'executive';
    optimism: number; // 0-1
    directness: number; // 0-1
    detailOrientation: number; // 0-1
  } = {
    formality: 'casual',
    optimism: 0.8,
    directness: 0.6,
    detailOrientation: 0.7
  };

  constructor(context: CommentaryContext) {
    this.context = context;
    this.initializePersonality();
  }

  private initializePersonality() {
    switch (this.context.difficulty) {
      case 'beginner':
        this.personalityTraits = {
          formality: 'casual',
          optimism: 0.8,
          directness: 0.6,
          detailOrientation: 0.7
        };
        break;
      case 'intermediate':
        this.personalityTraits = {
          formality: 'professional',
          optimism: 0.6,
          directness: 0.8,
          detailOrientation: 0.8
        };
        break;
      case 'advanced':
        this.personalityTraits = {
          formality: 'executive',
          optimism: 0.4,
          directness: 0.9,
          detailOrientation: 0.9
        };
        break;
    }
  }

  updateContext(newContext: Partial<CommentaryContext>) {
    this.context = { ...this.context, ...newContext };
  }

  generateCommentary(event: string, additionalData?: Record<string, unknown>): CommentaryResponse {
    const baseResponse = this.getBaseResponse(event, additionalData);

    // Filter responses based on difficulty level
    const filteredResponses = baseResponse ? [baseResponse] : [];
    const selectedResponse = filteredResponses.length > 0 ? filteredResponses[0] : this.getDefaultResponse();

    const enhancedResponse = this.enhanceResponse(selectedResponse);
    this.commentaryHistory.push(enhancedResponse.message);

    return enhancedResponse;
  }

  private getDefaultResponse(): CommentaryResponse {
    return {
      type: 'encouragement',
      message: this.getDefaultEncouragement(),
      confidence: 0.5
    };
  }

  private getBaseResponse(event: string, additionalData?: Record<string, unknown>): CommentaryResponse | null {
    // Analyze recent performance trends
    const performanceTrend = this.analyzePerformanceTrend();
    const riskLevel = this.assessRiskLevel();

    switch (event) {
      case 'simulation_start':
        return {
          type: 'motivation',
          message: this.getMotivationalMessage('welcome'),
          emotionalTone: 'excited',
          strategicImportance: 'high',
          suggestions: this.getWelcomeSuggestions()
        };

      case 'budget_allocated':
        const budgetUsage = (this.context.currentBudget - this.context.remainingBudget) / this.context.currentBudget;
        return {
          type: budgetUsage > 0.8 ? 'warning' : budgetUsage > 0.6 ? 'insight' : 'encouragement',
          message: this.getBudgetCommentary(budgetUsage),
          emotionalTone: budgetUsage > 0.8 ? 'concerned' : 'optimistic',
          strategicImportance: budgetUsage > 0.8 ? 'high' : 'medium',
          suggestions: this.getBudgetSuggestions(budgetUsage)
        };

      case 'tactic_selected':
        const tacticName = additionalData?.tacticName as string || 'this tactic';
        return {
          type: 'insight',
          message: this.getTacticCommentary(tacticName),
          emotionalTone: 'realistic',
          strategicImportance: 'medium',
          suggestions: this.getTacticSuggestions()
        };

      case 'quarter_completed':
        const performance = this.analyzeQuarterPerformance();
        return {
          type: performance === 'excellent' ? 'celebration' : performance === 'good' ? 'encouragement' : 'guidance',
          message: this.getQuarterCompletionMessage(performance),
          emotionalTone: performance === 'excellent' ? 'excited' : performance === 'good' ? 'optimistic' : 'realistic',
          strategicImportance: 'high',
          suggestions: this.getQuarterSuggestions(performance)
        };

      case 'wildcard_appeared':
        return {
          type: 'analysis',
          message: this.getWildcardCommentary(),
          emotionalTone: 'realistic',
          strategicImportance: 'high',
          suggestions: this.getWildcardSuggestions()
        };

      case 'crisis_handled':
        return {
          type: 'celebration',
          message: this.getCrisisResponseMessage(),
          emotionalTone: 'optimistic',
          strategicImportance: 'high',
          suggestions: ['Document lessons learned', 'Update crisis protocols']
        };

      case 'milestone_reached':
        return {
          type: 'celebration',
          message: this.getMilestoneMessage(),
          emotionalTone: 'excited',
          strategicImportance: 'high',
          suggestions: ['Celebrate with team', 'Use momentum strategically']
        };

      case 'low_performance':
        return {
          type: 'guidance',
          message: this.getLowPerformanceMessage(),
          emotionalTone: 'realistic',
          strategicImportance: 'critical',
          suggestions: this.getRecoverySuggestions()
        };

      case 'high_performance':
        return {
          type: 'celebration',
          message: this.getHighPerformanceMessage(),
          emotionalTone: 'excited',
          strategicImportance: 'high',
          suggestions: this.getScalingSuggestions()
        };

      case 'budget_warning':
        return {
          type: 'warning',
          message: this.getBudgetWarningMessage(),
          emotionalTone: 'concerned',
          strategicImportance: 'high',
          suggestions: this.getBudgetWarningSuggestions()
        };

      default:
        return this.getDefaultResponse();
    }
  }

  private enhanceResponse(baseResponse: CommentaryResponse): CommentaryResponse {
    // Add context-specific enhancements
    const enhanced = { ...baseResponse };

    // Add strategic insights based on decision history
    if (this.context.decisionHistory.length > 0) {
      enhanced.suggestions = (enhanced.suggestions || []).concat(
        this.getStrategicInsights()
      );
    }

    // Add emotional context based on recent performance
    const performanceTrend = this.analyzePerformanceTrend();
    if (performanceTrend === 'declining' && enhanced.emotionalTone === 'excited') {
      enhanced.emotionalTone = 'optimistic';
    }

    // Add difficulty-appropriate detail level
    if (this.context.difficulty === 'advanced' && enhanced.type === 'insight') {
      enhanced.message += ' ' + this.getAdvancedInsight();
    }

    return enhanced;
  }

  private analyzePerformanceTrend(): 'improving' | 'declining' | 'stable' {
    if (this.context.decisionHistory.length < 2) return 'stable';

    const recent = this.context.decisionHistory.slice(-2);
    const kpiChanges = recent.map(d => d.kpiChanges);

    const avgRecent = this.calculateAverageKPIs(kpiChanges[1]);
    const avgPrevious = this.calculateAverageKPIs(kpiChanges[0]);

    if (avgRecent > avgPrevious * 1.05) return 'improving';
    if (avgRecent < avgPrevious * 0.95) return 'declining';
    return 'stable';
  }

  private calculateAverageKPIs(kpis: Partial<CommentaryContext['currentKPIs']>): number {
    const values = Object.values(kpis).filter(v => typeof v === 'number') as number[];
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private assessRiskLevel(): 'low' | 'medium' | 'high' {
    const budgetRisk = (this.context.currentBudget - this.context.remainingBudget) / this.context.currentBudget;
    const performanceRisk = this.analyzePerformanceTrend() === 'declining' ? 0.3 : 0;

    const totalRisk = budgetRisk + performanceRisk;
    if (totalRisk > 0.7) return 'high';
    if (totalRisk > 0.4) return 'medium';
    return 'low';
  }

  // Context-aware message generation
  private getMotivationalMessage(type: 'welcome' | 'midway' | 'final'): string {
    const { companyName, userName, difficulty } = this.context;

    const messages = {
      welcome: [
        `Welcome to the helm, ${userName}! As CMO of ${companyName}, you're about to navigate ${difficulty === 'beginner' ? 'foundational marketing waters' : difficulty === 'intermediate' ? 'strategic marketing challenges' : 'executive-level marketing storms'}. Let's build something remarkable.`,
        `${userName}, ${companyName} is counting on your leadership. This ${difficulty === 'beginner' ? 'learning journey' : difficulty === 'intermediate' ? 'strategic challenge' : 'executive test'} will reveal your marketing prowess. Let's make history.`,
        `The board has chosen you, ${userName}, to lead ${companyName}'s marketing efforts. Your ${difficulty === 'beginner' ? 'first steps' : difficulty === 'intermediate' ? 'strategic decisions' : 'executive vision'} will determine our future. Let's excel together.`
      ],
      midway: [
        `Halfway through our journey, ${userName}. ${companyName} has shown ${this.analyzePerformanceTrend() === 'improving' ? 'remarkable progress' : 'resilience'}. Let's maintain our momentum.`,
        `${userName}, we're at a critical juncture. ${companyName}'s trajectory depends on your next moves. Stay focused on our strategic objectives.`
      ],
      final: [
        `As we approach the final quarter, ${userName}, ${companyName}'s story is taking shape. Your leadership has been ${this.analyzePerformanceTrend() === 'improving' ? 'exceptional' : 'commendable'}. Let's finish strong.`
      ]
    };

    return messages[type][Math.floor(Math.random() * messages[type].length)];
  }

  private getBudgetCommentary(usage: number): string {
    const { companyName, userName, currentQuarter } = this.context;

    if (usage > 0.8) {
      return `${userName}, you've committed ${Math.round(usage * 100)}% of ${companyName}'s budget to ${currentQuarter} initiatives. That's an aggressive stance that shows confidence in our strategy. Just ensure we maintain flexibility for unexpected opportunities.`;
    } else if (usage > 0.6) {
      return `Solid budget allocation for ${currentQuarter}, ${userName}. ${Math.round(usage * 100)}% commitment to ${companyName}'s growth initiatives demonstrates balanced risk-taking.`;
    } else {
      return `${userName}, your conservative ${Math.round(usage * 100)}% budget allocation for ${currentQuarter} at ${companyName} shows wisdom and strategic patience.`;
    }
  }

  private getTacticCommentary(tacticName: string): string {
    const { companyName, userName, difficulty } = this.context;

    const commentary = [
      `${userName}, selecting ${tacticName} for ${companyName} shows ${difficulty === 'beginner' ? 'great instinct' : difficulty === 'intermediate' ? 'strategic thinking' : 'executive vision'}. `,
      `Smart choice with ${tacticName}, ${userName}. This tactic aligns well with ${companyName}'s current market position. `,
      `${tacticName} is an excellent fit for ${companyName}'s strategy, ${userName}. Let's monitor its performance closely. `
    ];

    return commentary[Math.floor(Math.random() * commentary.length)];
  }

  private getQuarterCompletionMessage(performance: string): string {
    const { companyName, userName, currentQuarter } = this.context;

    switch (performance) {
      case 'excellent':
        return `${currentQuarter} has been exceptional for ${companyName}, ${userName}! Outstanding results across all metrics demonstrate your strategic acumen.`;
      case 'good':
        return `${companyName} delivered solid ${currentQuarter} results, ${userName}. Good progress with room for optimization in upcoming quarters.`;
      case 'needs_improvement':
        return `${currentQuarter} presented challenges for ${companyName}, ${userName}. Every setback is a learning opportunity - let's analyze and improve.`;
      default:
        return `${currentQuarter} results are in for ${companyName}, ${userName}. Interesting data to analyze for our next strategic moves.`;
    }
  }

  private getWildcardCommentary(): string {
    const { companyName, userName } = this.context;

    return `A significant development has emerged for ${companyName}, ${userName}. This situation presents both opportunities and challenges that could reshape our trajectory.`;
  }

  private getCrisisResponseMessage(): string {
    const { companyName, userName } = this.context;

    return `Excellent crisis management, ${userName}! ${companyName}'s reputation has been protected, and our team handled this challenge with remarkable poise. This experience will strengthen our future resilience.`;
  }

  private getMilestoneMessage(): string {
    const { companyName, userName } = this.context;

    return `Congratulations on this significant milestone, ${userName}! ${companyName} has achieved something remarkable under your leadership. Let's use this momentum to propel us forward.`;
  }

  private getLowPerformanceMessage(): string {
    const { companyName, userName } = this.context;

    return `${userName}, ${companyName} is facing headwinds. Every great CMO encounters challenges - they're opportunities to demonstrate leadership and strategic thinking.`;
  }

  private getHighPerformanceMessage(): string {
    const { companyName, userName } = this.context;

    return `Outstanding performance, ${userName}! ${companyName} is firing on all cylinders under your strategic direction. This level of execution sets the standard for marketing excellence.`;
  }

  private getBudgetWarningMessage(): string {
    const { companyName, userName } = this.context;

    return `${userName}, ${companyName}'s budget is running low. Strategic resource management becomes critical at this juncture.`;
  }

  private getDefaultEncouragement(): string {
    const { companyName, userName } = this.context;

    return `Keep up the excellent work, ${userName}. Your strategic decisions are shaping ${companyName}'s future.`;
  }

  private getAdvancedInsight(): string {
    const insights = [
      'Consider the second-order effects on our competitive positioning.',
      'This decision will influence stakeholder perceptions and future resource allocation.',
      'Evaluate the long-term brand equity implications of this tactical choice.',
      'Monitor how this impacts our customer lifetime value calculations.'
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  }

  private getStrategicInsights(): string[] {
    const insights: string[] = [];

    if (this.context.currentKPIs.customerSatisfaction > 80) {
      insights.push('High customer satisfaction creates opportunities for premium pricing and referrals');
    }

    if (this.context.currentKPIs.marketShare > 15) {
      insights.push('Market leadership position requires defensive strategies to protect gains');
    }

    if (this.context.currentKPIs.brandAwareness > 60) {
      insights.push('Strong brand recognition enables expansion into adjacent markets');

      if (this.context.difficulty === 'advanced') {
        insights.push('Consider leveraging brand equity for strategic partnerships or acquisitions');
      }
    }

    return insights.slice(0, 2); // Limit to 2 insights
  }

  private getWelcomeSuggestions(): string[] {
    switch (this.context.difficulty) {
      case 'beginner':
        return [
          'Start by understanding your market fundamentals',
          'Focus on learning cause-and-effect relationships',
          'Don\'t worry about perfection - focus on progress'
        ];
      case 'intermediate':
        return [
          'Balance multiple strategic objectives',
          'Monitor competitive responses to your moves',
          'Build systematic decision-making processes'
        ];
      case 'advanced':
        return [
          'Consider second and third-order strategic effects',
          'Balance stakeholder interests and expectations',
          'Make bold moves when data supports them'
        ];
      default:
        return [];
    }
  }

  private getBudgetSuggestions(usage: number): string[] {
    if (usage > 0.8) {
      return ['Maintain emergency reserves for opportunities', 'Consider more conservative allocations in future quarters'];
    } else if (usage > 0.6) {
      return ['Monitor budget utilization closely', 'Be prepared to adjust based on performance'];
    } else {
      return ['Consider more aggressive investment in proven tactics', 'Look for high-ROI opportunities'];
    }
  }

  private getTacticSuggestions(): string[] {
    return [
      'Monitor early performance indicators',
      'Be ready to scale successful elements',
      'Document what works for future quarters'
    ];
  }

  private getQuarterSuggestions(performance: string): string[] {
    switch (performance) {
      case 'excellent':
        return ['Scale successful tactics', 'Document winning strategies', 'Consider strategic investments'];
      case 'good':
        return ['Optimize underperforming areas', 'Maintain momentum', 'Refine execution'];
      case 'needs_improvement':
        return ['Analyze root causes', 'Focus on high-impact improvements', 'Learn from the experience'];
      default:
        return [];
    }
  }

  private getWildcardSuggestions(): string[] {
    return [
      'Evaluate cost-benefit ratio carefully',
      'Consider long-term strategic implications',
      'Assess alignment with current objectives'
    ];
  }

  private getRecoverySuggestions(): string[] {
    return [
      'Review strategic fundamentals',
      'Focus on high-impact, low-risk improvements',
      'Consider tactical adjustments',
      'Maintain team morale during challenges'
    ];
  }

  private getScalingSuggestions(): string[] {
    return [
      'Identify scalable elements of success',
      'Consider strategic investments',
      'Document processes for consistency',
      'Prepare for increased competitive attention'
    ];
  }

  private getBudgetWarningSuggestions(): string[] {
    return [
      'Review current spending priorities',
      'Identify areas for cost optimization',
      'Consider reallocating from underperforming initiatives'
    ];
  }

  analyzeQuarterPerformance(): 'excellent' | 'good' | 'needs_improvement' {
    const { currentKPIs } = this.context;
    const avgScore = (currentKPIs.revenue * 0.3 + currentKPIs.marketShare * 0.25 +
                     currentKPIs.customerSatisfaction * 0.25 + currentKPIs.brandAwareness * 0.2) / 100;

    if (avgScore > 0.7) return 'excellent';
    if (avgScore > 0.5) return 'good';
    return 'needs_improvement';
  }
}

// Factory function to create enhanced story bot
export const createEnhancedStoryBot = (context: CommentaryContext): EnhancedStoryBot => {
  return new EnhancedStoryBot(context);
};

// Utility functions for enhanced commentary
export const getIndustrySpecificInsight = (industry: string, context: string): string => {
  const insights = {
    healthcare: {
      budget: 'Healthcare marketing requires careful regulatory compliance and trust-building.',
      tactics: 'Patient education and trust indicators are crucial in healthcare marketing.',
      competition: 'Healthcare markets often have high barriers to entry but strong loyalty factors.'
    },
    legal: {
      budget: 'Legal services marketing emphasizes expertise and trustworthiness over aggressive promotion.',
      tactics: 'Thought leadership and case studies are highly effective in legal marketing.',
      competition: 'Legal markets value reputation and specialization over broad marketing spend.'
    },
    ecommerce: {
      budget: 'E-commerce requires constant optimization and customer acquisition focus.',
      tactics: 'Conversion rate optimization and customer retention are critical success factors.',
      competition: 'E-commerce is highly competitive with rapid innovation cycles.'
    }
  };

  return insights[industry as keyof typeof insights]?.[context as keyof typeof insights.healthcare] || '';
};
