'use client';

/**
 * Scenario Planner Component
 * Interactive what-if analysis and scenario comparison
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  GitBranch,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  Lightbulb,
  Plus,
  Trash2,
  BarChart3
} from 'lucide-react';
import { Scenario, Channel } from '@/types';
import { InsightContext } from '@/lib/aiInsights';
import { useScenarios, useScenarioComparison } from '@/hooks/useScenarioPlanning';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioPlannerProps {
  context: InsightContext;
  baseSimulationId: string;
  currentSpends: Record<Channel, number>;
  onApplyScenario?: (channelSpends: Record<Channel, number>) => void;
}

export function ScenarioPlanner({
  context,
  baseSimulationId,
  currentSpends,
  onApplyScenario
}: ScenarioPlannerProps) {
  const {
    scenarios,
    isLoading,
    loadTemplates,
    deleteScenario
  } = useScenarios(context, baseSimulationId);

  const { comparison, bestScenario, worstScenario } = useScenarioComparison(
    currentSpends,
    scenarios,
    context
  );

  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  React.useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleApplyScenario = (scenario: Scenario) => {
    if (onApplyScenario) {
      onApplyScenario(scenario.channel_spends);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <CardTitle>Scenario Planning</CardTitle>
            </div>
            <Badge variant="outline">
              {scenarios.length} {scenarios.length === 1 ? 'scenario' : 'scenarios'}
            </Badge>
          </div>
          <CardDescription>
            Compare different budget allocation strategies and predict outcomes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current vs Best */}
      {comparison && bestScenario && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Current Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <MetricDisplay
                label="Revenue"
                value={`$${comparison.baseline.revenue.toLocaleString()}`}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <MetricDisplay
                label="ROI"
                value={`${comparison.baseline.roi.toFixed(1)}%`}
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <MetricDisplay
                label="Market Share"
                value={`${comparison.baseline.market_share.toFixed(1)}%`}
                icon={<Target className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Best Scenario</CardTitle>
                <Badge className="bg-green-500">Recommended</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{bestScenario.scenario.name}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <MetricDisplay
                label="Revenue"
                value={`$${bestScenario.outcome.revenue.toLocaleString()}`}
                change={bestScenario.difference.revenue}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <MetricDisplay
                label="ROI"
                value={`${bestScenario.outcome.roi.toFixed(1)}%`}
                change={bestScenario.difference.roi}
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <MetricDisplay
                label="Market Share"
                value={`${bestScenario.outcome.market_share.toFixed(1)}%`}
                change={bestScenario.difference.market_share}
                icon={<Target className="h-4 w-4" />}
              />
              <Button
                onClick={() => handleApplyScenario(bestScenario.scenario)}
                className="w-full mt-4"
                size="sm"
              >
                Apply This Scenario
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scenario List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Scenarios</CardTitle>
          <CardDescription>
            Pre-built scenarios based on different strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {scenarios.map((scenario, index) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    index={index}
                    isSelected={selectedScenario?.id === scenario.id}
                    isBest={bestScenario?.scenario.id === scenario.id}
                    isWorst={worstScenario?.scenario.id === scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    onDelete={() => deleteScenario(scenario.id)}
                    onApply={() => handleApplyScenario(scenario)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Scenario Details */}
      {selectedScenario && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedScenario.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedScenario(null)}
              >
                Close
              </Button>
            </div>
            <CardDescription>{selectedScenario.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Channel Allocation */}
            <div>
              <h4 className="font-semibold mb-3">Channel Allocation</h4>
              <div className="space-y-2">
                {Object.entries(selectedScenario.channel_spends).map(([channel, spend]) => (
                  <ChannelBar
                    key={channel}
                    channel={channel as Channel}
                    spend={spend}
                    total={Object.values(selectedScenario.channel_spends).reduce((sum, s) => sum + s, 0)}
                  />
                ))}
              </div>
            </div>

            {/* Risks & Opportunities */}
            <div className="grid gap-4 md:grid-cols-2">
              {selectedScenario.predicted_outcomes.risks && selectedScenario.predicted_outcomes.risks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Risks
                  </h4>
                  <ul className="space-y-1">
                    {selectedScenario.predicted_outcomes.risks.map((risk, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-yellow-600 mt-0.5">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedScenario.predicted_outcomes.opportunities && selectedScenario.predicted_outcomes.opportunities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-green-600" />
                    Opportunities
                  </h4>
                  <ul className="space-y-1">
                    {selectedScenario.predicted_outcomes.opportunities.map((opp, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confidence Interval */}
            <div>
              <h4 className="font-semibold mb-2">Revenue Projection</h4>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Low Estimate</span>
                  <span className="font-semibold">
                    ${selectedScenario.predicted_outcomes.confidence_interval.low.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Expected</span>
                  <span className="font-bold text-lg text-primary">
                    ${selectedScenario.predicted_outcomes.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">High Estimate</span>
                  <span className="font-semibold">
                    ${selectedScenario.predicted_outcomes.confidence_interval.high.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface MetricDisplayProps {
  label: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
}

function MetricDisplay({ label, value, change, icon }: MetricDisplayProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{value}</span>
        {change !== undefined && change !== 0 && (
          <Badge variant={change > 0 ? 'default' : 'destructive'} className="text-xs">
            {change > 0 ? '+' : ''}{typeof change === 'number' && change % 1 !== 0 ? change.toFixed(1) : change}
            {typeof change === 'number' && Math.abs(change) < 100 ? '%' : ''}
          </Badge>
        )}
      </div>
    </div>
  );
}

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  isSelected: boolean;
  isBest: boolean;
  isWorst: boolean;
  onClick: () => void;
  onDelete: () => void;
  onApply: () => void;
}

function ScenarioCard({
  scenario,
  index,
  isSelected,
  isBest,
  isWorst,
  onClick,
  onDelete,
  onApply
}: ScenarioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-primary shadow-md' : 'hover:border-primary/50'
      } ${isBest ? 'bg-green-50 dark:bg-green-950/20' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{scenario.name}</h4>
            {isBest && <Badge className="bg-green-500">Best</Badge>}
            {isWorst && <Badge variant="destructive">Lowest ROI</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{scenario.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center p-2 bg-background rounded border">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="font-semibold text-sm">
            ${(scenario.predicted_outcomes.revenue / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="text-center p-2 bg-background rounded border">
          <p className="text-xs text-muted-foreground">ROI</p>
          <p className="font-semibold text-sm">
            {scenario.predicted_outcomes.roi.toFixed(0)}%
          </p>
        </div>
        <div className="text-center p-2 bg-background rounded border">
          <p className="text-xs text-muted-foreground">Market</p>
          <p className="font-semibold text-sm">
            {scenario.predicted_outcomes.market_share.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onApply}
        >
          Apply
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

interface ChannelBarProps {
  channel: Channel;
  spend: number;
  total: number;
}

function ChannelBar({ channel, spend, total }: ChannelBarProps) {
  const percentage = (spend / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium capitalize">{channel}</span>
        <span className="text-sm text-muted-foreground">
          ${spend.toLocaleString()} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
