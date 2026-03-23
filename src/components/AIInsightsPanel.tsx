"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  X,
  ChevronRight,
  Target,
  DollarSign,
  BarChart3,
  Bot,
  MessageSquare
} from "lucide-react";
import { AIRecommendation } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

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
  const [displayText, setDisplayText] = useState("");
  const fullText = "Analyzing your performance... Stratgic patterns detected.";

  useEffect(() => {
    if (isLoading) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) i = 0;
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Card className={`${className} bg-slate-900/40 border-white/5 backdrop-blur-xl overflow-hidden`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
            </div>
            <CardTitle className="text-white">CMO Mentor</CardTitle>
          </div>
          <CardDescription className="text-slate-400 font-mono text-xs">{displayText}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl border border-white/5" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className={`${className} bg-slate-900/40 border-white/5 backdrop-blur-xl`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800/50 rounded-lg">
              <Bot className="h-5 w-5 text-slate-400" />
            </div>
            <CardTitle className="text-white">CMO Mentor</CardTitle>
          </div>
          <CardDescription className="text-slate-400">Quiet at the moment. Keep executing.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-blue-500/30 pl-4 py-2 bg-blue-500/5 rounded-r-lg">
            "The best strategy is one that's consistently improved through data. I'll alert you when patterns emerge."
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} bg-slate-900/40 border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden relative`}>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <MessageSquare className="w-16 h-16 text-white" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Bot className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white">CMO Mentor</CardTitle>
              <CardDescription className="text-blue-400/70 font-bold text-[10px] uppercase tracking-tighter">
                Tactical Intelligence Active
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-blue-600/10 text-blue-400 border-blue-500/20">
            {recommendations.length} insights
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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

function RecommendationCard({
  recommendation,
  index,
  onDismiss,
  onAccept
}: {
  recommendation: AIRecommendation;
  index: number;
  onDismiss?: (id: string) => void;
  onAccept?: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityStyles = {
    critical: "border-rose-500/30 bg-rose-500/5 text-rose-400",
    high: "border-orange-500/30 bg-orange-500/5 text-orange-400",
    medium: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    low: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
  };

  const typeIcons = {
    optimization: TrendingUp,
    warning: AlertTriangle,
    opportunity: Lightbulb,
    insight: Sparkles
  };

  const Icon = typeIcons[recommendation.type] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`border rounded-xl p-5 ${priorityStyles[recommendation.priority]} group transition-all hover:border-white/20`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-white text-base">{recommendation.title}</h4>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                {recommendation.description}
              </p>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(recommendation.id)}
                className="h-8 w-8 p-0 text-slate-500 hover:text-white hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2 border-t border-white/5"
              >
                {recommendation.suggested_action && (
                  <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10">
                    <p className="text-xs font-black text-blue-400 uppercase mb-2 tracking-widest">Mentor Suggestion</p>
                    <p className="text-sm text-slate-300 italic">"{recommendation.suggested_action}"</p>
                  </div>
                )}

                {recommendation.expected_impact && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">PROJ. REVENUE</p>
                      <p className={`text-sm font-bold ${recommendation.expected_impact.revenue_change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {recommendation.expected_impact.revenue_change >= 0 ? "+" : "-"}${Math.abs(recommendation.expected_impact.revenue_change).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">PROJ. SHARE</p>
                      <p className={`text-sm font-bold ${recommendation.expected_impact.market_share_change >= 0 ? "text-blue-400" : "text-rose-400"}`}>
                        {recommendation.expected_impact.market_share_change >= 0 ? "+" : "-"}{Math.abs(recommendation.expected_impact.market_share_change).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}

                {recommendation.reasoning && (
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Logic Breakdown</p>
                    <ul className="space-y-2">
                      {recommendation.reasoning.map((reason, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-2 pt-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-400 p-0 h-auto hover:text-blue-300"
            >
              {isExpanded ? "Collapse Reasoning" : "Explain Logic"}
              <ChevronRight className={`ml-1 h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
            </Button>

            {onAccept && (
              <Button
                size="sm"
                onClick={() => onAccept(recommendation.id)}
                className="text-xs bg-white text-slate-950 hover:bg-slate-200 font-bold px-4 rounded-lg"
              >
                Apply Tactics
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
