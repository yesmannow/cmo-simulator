'use client';

/**
 * AI Insights Panel Component
 * Displays AI-generated recommendations and insights
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  X,
  ChevronRight,
  Target,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { AIRecommendation } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface AIInsightsPanelProps {
  recommendations: AIRecommendation[];
  isLoading?: boolean;
  onDismiss?: (id: string) => void;
  onAccept?: (id: string) => void;
  className?: string;
}

export function AIInsightsPanel({
  recommendations,
  isLoading,
  onDismiss,
  onAccept,
  className
}: AIInsightsPanelProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle>AI Insights</CardTitle>
          </div>
          <CardDescription>Analyzing your performance...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Insights</CardTitle>
          </div>
          <CardDescription>No recommendations at this time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Keep making decisions and we'll provide insights based on your performance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Insights</CardTitle>
          </div>
          <Badge variant="outline">
            {recommendations.length} {recommendations.length === 1 ? 'insight' : 'insights'}
          </Badge>
        </div>
        <CardDescription>
          AI-powered recommendations to optimize your marketing strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence>
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                index={index}
                onDismiss={onDismiss}
                onAccept={onAccept}
              />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  index: number;
  onDismiss?: (id: string) => void;
  onAccept?: (id: string) => void;
}

function RecommendationCard({
  recommendation,
  index,
  onDismiss,
  onAccept
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const typeIcons = {
    optimization: TrendingUp,
    warning: AlertTriangle,
    opportunity: Lightbulb,
    insight: Sparkles
  };

  const priorityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  const Icon = typeIcons[recommendation.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.1 }}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${priorityColors[recommendation.priority]} bg-opacity-10`}>
          <Icon className={`h-5 w-5 text-${priorityColors[recommendation.priority].replace('bg-', '')}`} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">{recommendation.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {recommendation.description}
              </p>
            </div>
            <div className="flex gap-1">
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(recommendation.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {recommendation.suggested_action && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium mb-1">Suggested Action:</p>
              <p className="text-sm">{recommendation.suggested_action}</p>
            </div>
          )}

          {recommendation.expected_impact && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <ImpactMetric
                icon={<DollarSign className="h-3 w-3" />}
                label="Revenue"
                value={`$${Math.abs(recommendation.expected_impact.revenue_change).toLocaleString()}`}
                positive={recommendation.expected_impact.revenue_change > 0}
              />
              <ImpactMetric
                icon={<Target className="h-3 w-3" />}
                label="Market Share"
                value={`${Math.abs(recommendation.expected_impact.market_share_change).toFixed(1)}%`}
                positive={recommendation.expected_impact.market_share_change > 0}
              />
              <ImpactMetric
                icon={<BarChart3 className="h-3 w-3" />}
                label="Confidence"
                value={`${recommendation.expected_impact.confidence}%`}
                positive={true}
              />
            </div>
          )}

          {isExpanded && recommendation.reasoning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1 mt-3"
            >
              <p className="text-sm font-medium">Reasoning:</p>
              <ul className="space-y-1">
                {recommendation.reasoning.map((reason, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
              <ChevronRight className={`ml-1 h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>

            {onAccept && (
              <Button
                size="sm"
                onClick={() => onAccept(recommendation.id)}
                className="text-xs"
              >
                Apply Suggestion
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ImpactMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive: boolean;
}

function ImpactMetric({ icon, label, value, positive }: ImpactMetricProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-background rounded border">
      <div className={`${positive ? 'text-green-600' : 'text-red-600'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className={`text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? '+' : '-'}{value}
        </p>
      </div>
    </div>
  );
}
