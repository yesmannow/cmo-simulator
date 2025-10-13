'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Users, 
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Share2,
  ArrowLeft,
  Calendar,
  Award
} from 'lucide-react';

interface DecisionPoint {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  type: 'budget-allocation' | 'tactic-selection' | 'wildcard-response' | 'talent-hire' | 'big-bet';
  decision: string;
  outcome: 'positive' | 'negative' | 'neutral';
  impact: {
    revenue: number;
    marketShare: number;
    brandEquity?: number;
    teamMorale?: number;
  };
  reasoning: string;
  alternativeOutcome?: string;
}

interface SimulationDebrief {
  id: string;
  companyName: string;
  industry: string;
  timeHorizon: string;
  marketLandscape: string;
  
  // Final Results
  finalScore: number;
  grade: string;
  totalRevenue: number;
  totalProfit: number;
  finalMarketShare: number;
  roi: number;
  
  // Timeline
  decisionPoints: DecisionPoint[];
  
  // Analysis
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  
  // Comparison
  percentile: number;
  industryAverage: number;
}

export default function DebriefPage() {
  const params = useParams();
  const router = useRouter();
  const [debrief, setDebrief] = useState<SimulationDebrief | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load simulation debrief data
    loadDebriefData();
  }, [params.simulationId]);

  const loadDebriefData = async () => {
    // In production, this would fetch from Supabase
    // For now, load from localStorage or mock data
    const mockDebrief: SimulationDebrief = {
      id: params.simulationId as string,
      companyName: 'Apex Health',
      industry: 'Healthcare',
      timeHorizon: '3-Year Growth',
      marketLandscape: 'The Disruptor',
      finalScore: 6850,
      grade: 'A',
      totalRevenue: 2450000,
      totalProfit: 1450000,
      finalMarketShare: 12.5,
      roi: 145,
      decisionPoints: [
        {
          quarter: 'Q1',
          type: 'tactic-selection',
          decision: 'Invested heavily in Content Marketing & SEO',
          outcome: 'positive',
          impact: {
            revenue: 80000,
            marketShare: 2,
            brandEquity: 15
          },
          reasoning: 'Strong choice. SEO investments compound over time, providing sustainable organic traffic growth.',
          alternativeOutcome: 'Paid ads would have provided faster results but at higher long-term cost.'
        },
        {
          quarter: 'Q1',
          type: 'wildcard-response',
          decision: 'Responded to competitor price cut with value messaging campaign',
          outcome: 'positive',
          impact: {
            revenue: 20000,
            marketShare: 1,
            brandEquity: 10
          },
          reasoning: 'Excellent strategic thinking. Competing on value instead of price protected your margins and brand positioning.',
          alternativeOutcome: 'Matching their price would have preserved short-term sales but damaged long-term brand equity.'
        },
        {
          quarter: 'Q2',
          type: 'talent-hire',
          decision: 'Hired Senior Content Strategist',
          outcome: 'positive',
          impact: {
            revenue: 50000,
            marketShare: 1,
            teamMorale: 10
          },
          reasoning: 'Smart investment. Specialized talent amplified your content strategy effectiveness.',
        },
        {
          quarter: 'Q2',
          type: 'wildcard-response',
          decision: 'Ignored viral competitor campaign',
          outcome: 'negative',
          impact: {
            revenue: -20000,
            marketShare: -2,
            teamMorale: -5
          },
          reasoning: 'Missed opportunity. While staying focused is usually good, this viral moment required a response.',
          alternativeOutcome: 'A strategic influencer campaign could have captured the momentum without appearing reactive.'
        },
        {
          quarter: 'Q3',
          type: 'budget-allocation',
          decision: 'Doubled down on best-performing channel (Content)',
          outcome: 'positive',
          impact: {
            revenue: 120000,
            marketShare: 3,
            brandEquity: 12
          },
          reasoning: 'Data-driven decision. Scaling what works is fundamental to growth.',
        },
        {
          quarter: 'Q4',
          type: 'big-bet',
          decision: 'Launched Community Health Fair (high brand value, uncertain ROI)',
          outcome: 'neutral',
          impact: {
            revenue: -30000,
            marketShare: 1,
            brandEquity: 20
          },
          reasoning: 'Bold move. Short-term cost but significant brand equity gain. Long-term impact remains to be seen.',
        }
      ],
      strengths: [
        'Strong focus on long-term brand building over short-term gains',
        'Excellent budget discipline and ROI focus',
        'Strategic use of content marketing for sustainable growth',
        'Competed on value rather than price, protecting margins'
      ],
      weaknesses: [
        'Slow to respond to competitive viral moments',
        'Could have been more aggressive in paid acquisition during high-growth quarters',
        'Underutilized social media advertising opportunities'
      ],
      recommendations: [
        'Maintain your content-first strategy but allocate 15-20% budget to paid social for faster growth',
        'Develop a rapid response protocol for competitive threats and viral opportunities',
        'Consider hiring a paid media specialist to complement your content strength',
        'Test more aggressive pricing strategies in Q1 next year to capture market share faster'
      ],
      percentile: 78,
      industryAverage: 4200
    };

    setDebrief(mockDebrief);
    setIsLoading(false);
  };

  const handleDownloadReport = () => {
    // In production, this would generate a PDF via API
    alert('PDF report generation would be triggered here');
  };

  const handleShare = () => {
    // In production, this would create a shareable link
    alert('Share functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your campaign analysis...</p>
        </div>
      </div>
    );
  }

  if (!debrief) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Simulation Not Found</CardTitle>
            <CardDescription>This simulation could not be loaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredDecisions = selectedQuarter === 'all' 
    ? debrief.decisionPoints 
    : debrief.decisionPoints.filter(d => d.quarter === selectedQuarter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold mb-2">Campaign Debrief</h1>
            <p className="text-muted-foreground">
              {debrief.companyName} • {debrief.industry} • {debrief.timeHorizon}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-primary">
            <CardHeader className="pb-3">
              <CardDescription>Strategy Score</CardDescription>
              <CardTitle className="text-4xl text-primary">
                {debrief.finalScore.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-lg px-3 py-1">
                  Grade {debrief.grade}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Top {100 - debrief.percentile}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardDescription>
              <CardTitle className="text-3xl">
                ${(debrief.totalRevenue / 1000000).toFixed(2)}M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Profit: ${(debrief.totalProfit / 1000000).toFixed(2)}M
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Market Share
              </CardDescription>
              <CardTitle className="text-3xl">
                {debrief.finalMarketShare}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">+{(debrief.finalMarketShare - 5).toFixed(1)}%</span>
                <span className="text-muted-foreground">from start</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ROI
              </CardDescription>
              <CardTitle className="text-3xl">
                {debrief.roi}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Industry avg: {((debrief.industryAverage / debrief.finalScore) * debrief.roi).toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Decision Timeline</TabsTrigger>
            <TabsTrigger value="analysis">Strategic Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Decision Journey</CardTitle>
                    <CardDescription>
                      Review every strategic choice and its impact on your campaign
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedQuarter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedQuarter('all')}
                    >
                      All
                    </Button>
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                      <Button
                        key={q}
                        variant={selectedQuarter === q ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedQuarter(q as any)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDecisions.map((decision, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-l-4 ${
                        decision.outcome === 'positive' ? 'border-l-green-500' :
                        decision.outcome === 'negative' ? 'border-l-red-500' :
                        'border-l-yellow-500'
                      }`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                decision.outcome === 'positive' ? 'bg-green-500/10' :
                                decision.outcome === 'negative' ? 'bg-red-500/10' :
                                'bg-yellow-500/10'
                              }`}>
                                {decision.outcome === 'positive' ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : decision.outcome === 'negative' ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{decision.quarter}</Badge>
                                  <Badge variant="secondary">{decision.type}</Badge>
                                </div>
                                <CardTitle className="text-lg">{decision.decision}</CardTitle>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Impact Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Revenue Impact</p>
                              <p className={`text-sm font-semibold ${
                                decision.impact.revenue > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {decision.impact.revenue > 0 ? '+' : ''}${(decision.impact.revenue / 1000).toFixed(0)}K
                              </p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Market Share</p>
                              <p className={`text-sm font-semibold ${
                                decision.impact.marketShare > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {decision.impact.marketShare > 0 ? '+' : ''}{decision.impact.marketShare}%
                              </p>
                            </div>
                            {decision.impact.brandEquity !== undefined && (
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Brand Equity</p>
                                <p className={`text-sm font-semibold ${
                                  decision.impact.brandEquity > 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {decision.impact.brandEquity > 0 ? '+' : ''}{decision.impact.brandEquity}
                                </p>
                              </div>
                            )}
                            {decision.impact.teamMorale !== undefined && (
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Team Morale</p>
                                <p className={`text-sm font-semibold ${
                                  decision.impact.teamMorale > 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {decision.impact.teamMorale > 0 ? '+' : ''}{decision.impact.teamMorale}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Reasoning */}
                          <div className="p-4 bg-primary/5 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Zap className="h-4 w-4 text-primary" />
                              Analysis
                            </h4>
                            <p className="text-sm text-muted-foreground">{decision.reasoning}</p>
                          </div>

                          {/* Alternative Outcome */}
                          {decision.alternativeOutcome && (
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-semibold mb-2 text-sm">What If You Chose Differently?</h4>
                              <p className="text-sm text-muted-foreground">{decision.alternativeOutcome}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Award className="h-5 w-5" />
                    Strategic Strengths
                  </CardTitle>
                  <CardDescription>What you did exceptionally well</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {debrief.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="border-2 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                  <CardDescription>Opportunities to optimize your strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {debrief.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Strategic Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable insights to improve your next campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {debrief.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How You Stack Up</CardTitle>
                <CardDescription>
                  Your performance compared to other {debrief.industry} campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Your Percentile</p>
                    <p className="text-4xl font-bold text-primary mb-1">{debrief.percentile}th</p>
                    <p className="text-xs text-muted-foreground">
                      Better than {debrief.percentile}% of campaigns
                    </p>
                  </div>

                  <div className="p-6 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                    <p className="text-4xl font-bold mb-1">{debrief.finalScore.toLocaleString()}</p>
                    <p className="text-xs text-green-500">
                      +{((debrief.finalScore / debrief.industryAverage - 1) * 100).toFixed(0)}% vs avg
                    </p>
                  </div>

                  <div className="p-6 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Industry Average</p>
                    <p className="text-4xl font-bold mb-1">{debrief.industryAverage.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {debrief.industry} campaigns
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You achieved a <span className="font-semibold text-primary">Grade {debrief.grade}</span> with a strategy score of{' '}
                    <span className="font-semibold text-primary">{debrief.finalScore.toLocaleString()}</span>, placing you in the{' '}
                    <span className="font-semibold text-primary">top {100 - debrief.percentile}%</span> of all {debrief.industry} campaigns.
                    Your focus on {debrief.strengths[0]?.toLowerCase()} was particularly effective.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push('/leaderboard')}>
            View Leaderboard
          </Button>
          <Button onClick={() => router.push('/sim/setup')}>
            Start New Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
