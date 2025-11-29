'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Info, X, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRiskRewardAnalysis, calculateRiskScore, calculateRewardScore, type RiskRewardAnalysis } from '@/lib/riskRewardEducation';
import { Progress } from '@/components/ui/progress';

interface RiskRewardIndicatorProps {
  decisionId: string;
  variant?: 'compact' | 'detailed' | 'popup';
  showDetails?: boolean;
  className?: string;
}

export function RiskRewardIndicator({
  decisionId,
  variant = 'compact',
  showDetails = false,
  className = '',
}: RiskRewardIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const analysis = getRiskRewardAnalysis(decisionId);

  if (!analysis) return null;

  const riskScore = calculateRiskScore(analysis);
  const rewardScore = calculateRewardScore(analysis);

  const riskColor = riskScore > 66 ? 'red' : riskScore > 33 ? 'yellow' : 'green';
  const rewardColor = rewardScore > 66 ? 'green' : rewardScore > 33 ? 'yellow' : 'blue';

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <AlertTriangle className={`h-4 w-4 ${
            riskColor === 'red' ? 'text-red-500' :
            riskColor === 'yellow' ? 'text-yellow-500' :
            'text-green-500'
          }`} />
          <span className="text-xs font-medium">Risk: {analysis.riskLevel}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className={`h-4 w-4 ${
            rewardColor === 'green' ? 'text-green-500' :
            rewardColor === 'yellow' ? 'text-yellow-500' :
            'text-blue-500'
          }`} />
          <span className="text-xs font-medium">Reward: {analysis.rewardLevel}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 px-2 text-xs"
        >
          <Info className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-start gap-2"
      >
        <Shield className="h-4 w-4" />
        <span>View Risk & Reward Analysis</span>
        <Info className="h-4 w-4 ml-auto" />
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <Card className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{analysis.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant={analysis.riskLevel === 'high' ? 'destructive' : analysis.riskLevel === 'medium' ? 'secondary' : 'default'}
                  >
                    Risk: {analysis.riskLevel}
                  </Badge>
                  <Badge
                    variant={analysis.rewardLevel === 'high' ? 'default' : analysis.rewardLevel === 'medium' ? 'secondary' : 'outline'}
                  >
                    Reward: {analysis.rewardLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risk/Reward Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Risk Score</span>
                      <span className="text-sm text-muted-foreground">{riskScore}%</span>
                    </div>
                    <Progress value={riskScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Reward Score</span>
                      <span className="text-sm text-muted-foreground">{rewardScore}%</span>
                    </div>
                    <Progress value={rewardScore} className="h-2" />
                  </div>
                </div>

                {/* Risks */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Potential Risks
                  </h4>
                  <div className="space-y-2">
                    {analysis.risks.map((risk, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm text-red-900">{risk.description}</p>
                          <div className="flex gap-1 ml-2">
                            <Badge variant="outline" className="text-xs">
                              {risk.probability}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {risk.impact}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Potential Rewards
                  </h4>
                  <div className="space-y-2">
                    {analysis.rewards.map((reward, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm text-green-900">{reward.description}</p>
                          <div className="flex gap-1 ml-2">
                            <Badge variant="outline" className="text-xs">
                              {reward.probability}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {reward.impact}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best For / Worst For */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-700">✅ Best For:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.bestFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-red-700">❌ Worst For:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.worstFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Real World Example */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2 text-blue-900">🌍 Real-World Example:</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">{analysis.realWorldExample}</p>
                </div>

                {/* Expert Advice */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2 text-purple-900 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Expert Advice:
                  </h4>
                  <p className="text-sm text-purple-800 leading-relaxed">{analysis.expertAdvice}</p>
                </div>

                {/* Mitigation Strategies */}
                {analysis.mitigationStrategies && analysis.mitigationStrategies.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">🛡️ How to Reduce Risk:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.mitigationStrategies.map((strategy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

