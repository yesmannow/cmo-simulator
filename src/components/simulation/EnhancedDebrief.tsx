'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Download, 
  Trophy, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign,
  Award,
  Star,
  Zap,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Share2
} from 'lucide-react';
import { useAIRecommendations } from '@/hooks/useAIInsights';
import { InsightContext } from '@/lib/aiInsights';
import { AIInsightsPanel } from '@/components/AIInsightsPanel';

interface EnhancedDebriefProps {
  context: SimulationContext;
  onExportPDF: () => void;
  onRestart: () => void;
  onShare?: () => void;
}

export function EnhancedDebrief({ context, onExportPDF, onRestart, onShare }: EnhancedDebriefProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // AI Insights
  const aiContext: InsightContext = {
    industry: context.strategy?.marketLandscape === 'disruptor' ? 'healthcare' :
             context.strategy?.marketLandscape === 'crowded' ? 'ecommerce' : 'legal',
    currentQuarter: 'Q4',
    quarterlyResults: {
      revenue: context.quarters.Q4.results.revenue,
      roi: ((context.quarters.Q4.results.revenue - context.quarters.Q4.budgetSpent) / context.quarters.Q4.budgetSpent) * 100,
      marketShare: context.quarters.Q4.results.marketShare,
      brandEquity: context.brandEquity,
      channel_performance: [
        { channel: 'digital', spend: 0, roi: 0, conversions: 0 },
        { channel: 'content', spend: 0, roi: 0, conversions: 0 },
        { channel: 'events', spend: 0, roi: 0, conversions: 0 },
        { channel: 'partnerships', spend: 0, roi: 0, conversions: 0 },
      ]
    },
    channelSpends: {
      digital: 0,
      content: 0,
      events: 0,
      partnerships: 0,
      social: 0,
      traditional: 0,
    },
    totalBudget: context.totalBudget,
    marketShare: context.quarters.Q4.results.marketShare
  };

  const { recommendations, isLoading } = useAIRecommendations(aiContext);

  // Calculate comprehensive metrics
  const quarterlyData = [
    {
      quarter: 'Q1',
      revenue: context.quarters.Q1.results.revenue,
      marketShare: context.quarters.Q1.results.marketShare,
      satisfaction: context.quarters.Q1.results.customerSatisfaction,
      awareness: context.quarters.Q1.results.brandAwareness,
      budget: context.quarters.Q1.budgetSpent,
    },
    {
      quarter: 'Q2',
      revenue: context.quarters.Q2.results.revenue,
      marketShare: context.quarters.Q2.results.marketShare,
      satisfaction: context.quarters.Q2.results.customerSatisfaction,
      awareness: context.quarters.Q2.results.brandAwareness,
      budget: context.quarters.Q2.budgetSpent,
    },
    {
      quarter: 'Q3',
      revenue: context.quarters.Q3.results.revenue,
      marketShare: context.quarters.Q3.results.marketShare,
      satisfaction: context.quarters.Q3.results.customerSatisfaction,
      awareness: context.quarters.Q3.results.brandAwareness,
      budget: context.quarters.Q3.budgetSpent,
    },
    {
      quarter: 'Q4',
      revenue: context.quarters.Q4.results.revenue,
      marketShare: context.quarters.Q4.results.marketShare,
      satisfaction: context.quarters.Q4.results.customerSatisfaction,
      awareness: context.quarters.Q4.results.brandAwareness,
      budget: context.quarters.Q4.budgetSpent,
    },
  ];

  const totalRevenue = quarterlyData.reduce((sum, q) => sum + q.revenue, 0);
  const totalBudgetSpent = quarterlyData.reduce((sum, q) => sum + q.budget, 0);
  const roi = totalBudgetSpent > 0 ? ((totalRevenue - totalBudgetSpent) / totalBudgetSpent) * 100 : 0;
  const finalMarketShare = context.quarters.Q4.results.marketShare;
  const finalSatisfaction = context.quarters.Q4.results.customerSatisfaction;
  const finalAwareness = context.quarters.Q4.results.brandAwareness;

  // Calculate grade and performance metrics
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const overallScore = Math.round((roi * 0.4 + finalMarketShare * 2 + finalSatisfaction * 0.8 + finalAwareness * 0.6) / 4);
  const gradeInfo = getGrade(overallScore);

  // Tactic performance analysis
  const allTactics = [
    ...context.quarters.Q1.tactics,
    ...context.quarters.Q2.tactics,
    ...context.quarters.Q3.tactics,
    ...context.quarters.Q4.tactics,
  ];

  const tacticsByCategory = allTactics.reduce((acc, tactic) => {
    if (!acc[tactic.category]) {
      acc[tactic.category] = { count: 0, totalCost: 0, totalRevenue: 0 };
    }
    acc[tactic.category].count++;
    acc[tactic.category].totalCost += tactic.cost;
    acc[tactic.category].totalRevenue += tactic.expectedImpact.revenue;
    return acc;
  }, {} as Record<string, { count: number; totalCost: number; totalRevenue: number }>);

  const categoryData = Object.entries(tacticsByCategory).map(([category, data]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count: data.count,
    investment: data.totalCost,
    revenue: data.totalRevenue,
    roi: data.totalCost > 0 ? ((data.totalRevenue - data.totalCost) / data.totalCost) * 100 : 0,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="flex items-center justify-center gap-4">
          <Trophy className="h-12 w-12 text-yellow-500" />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Campaign Complete!
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Your 12-month marketing simulation results
            </p>
          </div>
        </div>

        {/* Overall Grade */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl ${gradeInfo.bg} border-2 border-current/20`}
        >
          <Award className={`h-8 w-8 ${gradeInfo.color}`} />
          <div>
            <div className={`text-3xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</div>
            <div className="text-sm text-muted-foreground">Overall Grade</div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${gradeInfo.color}`}>{overallScore}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base">Total Revenue</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                ROI: {roi.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Market Share</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {finalMarketShare.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Final Position
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-base">Satisfaction</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {finalSatisfaction.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Customer Rating
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-base">Brand Awareness</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {finalAwareness.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Market Recognition
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly Trends</TabsTrigger>
          <TabsTrigger value="tactics">Tactic Analysis</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KPI Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="marketShare" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="satisfaction" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="awareness" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quarterly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Investment vs Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="budget" fill="#ef4444" name="Investment" />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tactics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="investment"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Investment']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category ROI Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'ROI']} />
                    <Bar dataKey="roi" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <AIInsightsPanel
              recommendations={recommendations}
              isLoading={isLoading}
              onDismiss={(id: string) => console.log('Dismissed recommendation:', id)}
              onAccept={(id: string) => console.log('Accepted recommendation:', id)}
            />

            {/* Fallback insights if AI fails */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {roi > 200 && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Star className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Exceptional ROI Performance</div>
                        <div className="text-sm text-green-700">
                          Your {roi.toFixed(1)}% ROI demonstrates outstanding marketing efficiency and strategic decision-making.
                        </div>
                      </div>
                    </div>
                  )}

                  {finalMarketShare > 25 && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-800">Market Leadership Achieved</div>
                        <div className="text-sm text-blue-700">
                          Capturing {finalMarketShare.toFixed(1)}% market share positions you as a market leader.
                        </div>
                      </div>
                    </div>
                  )}

                  {context.hiredTalent.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-purple-800">Strategic Talent Investment</div>
                        <div className="text-sm text-purple-700">
                          Hiring {context.hiredTalent.length} key talent member(s) enhanced your team's capabilities and performance.
                        </div>
                      </div>
                    </div>
                  )}

                  {context.selectedBigBet && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                      <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-orange-800">Bold Strategic Move</div>
                        <div className="text-sm text-orange-700">
                          Your big bet on "{context.selectedBigBet.name}" shows strategic courage and long-term thinking.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={onExportPDF} size="lg" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export PDF Report
        </Button>
        
        {onShare && (
          <Button onClick={onShare} variant="outline" size="lg" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        )}
        
        <Button onClick={onRestart} variant="outline" size="lg" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Start New Campaign
        </Button>
      </div>
    </div>
  );
}
