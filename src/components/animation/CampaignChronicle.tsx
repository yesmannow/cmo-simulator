'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, Target, DollarSign } from 'lucide-react';

interface ChronicleEvent {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  kpiChange?: {
    revenue?: number;
    marketShare?: number;
    satisfaction?: number;
    awareness?: number;
  };
}

interface CampaignChronicleProps {
  events: ChronicleEvent[];
  currentQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  isAnimating?: boolean;
}

export function CampaignChronicle({ events, currentQuarter, isAnimating = false }: CampaignChronicleProps) {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [pathProgress, setPathProgress] = useState(0);

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
  const currentQuarterIndex = quarters.indexOf(currentQuarter);

  useEffect(() => {
    if (isAnimating) {
      const targetProgress = ((currentQuarterIndex + 1) / 4) * 100;
      setPathProgress(targetProgress);
    }
  }, [currentQuarterIndex, isAnimating]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '📊';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Campaign Chronicle</h3>
        </div>

        {/* Timeline Path */}
        <div className="relative mb-8">
          {/* Background path */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-muted rounded-full transform -translate-y-1/2" />
          
          {/* Animated progress path */}
          <motion.div
            className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full transform -translate-y-1/2"
            initial={{ width: '0%' }}
            animate={{ width: `${pathProgress}%` }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* Quarter markers */}
          <div className="relative flex justify-between">
            {quarters.map((quarter, index) => {
              const isActive = index <= currentQuarterIndex;
              const isCurrent = index === currentQuarterIndex;
              
              return (
                <motion.div
                  key={quarter}
                  className="flex flex-col items-center"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: isCurrent ? 1.2 : isActive ? 1 : 0.8,
                    opacity: isActive ? 1 : 0.5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                      isCurrent
                        ? 'bg-primary text-white border-primary shadow-lg'
                        : isActive
                          ? 'bg-white text-primary border-primary'
                          : 'bg-muted text-muted-foreground border-muted'
                    }`}
                  >
                    {quarter}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {quarter === 'Q1' && 'Launch'}
                    {quarter === 'Q2' && 'Scale'}
                    {quarter === 'Q3' && 'Optimize'}
                    {quarter === 'Q4' && 'Maximize'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Events Timeline */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                activeEvent === index
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-muted hover:border-primary/50'
              }`}
              onClick={() => setActiveEvent(activeEvent === index ? null : index)}
            >
              <div className="flex items-start gap-3">
                <Badge className={`${getImpactColor(event.impact)} shrink-0`}>
                  {event.quarter}
                </Badge>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getImpactIcon(event.impact)}</span>
                    <h4 className="font-medium truncate">{event.title}</h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.description}
                  </p>

                  {/* KPI Changes */}
                  {event.kpiChange && activeEvent === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-muted"
                    >
                      {event.kpiChange.revenue && (
                        <div className="flex items-center gap-2 text-xs">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          <span>Revenue: {event.kpiChange.revenue > 0 ? '+' : ''}{event.kpiChange.revenue}%</span>
                        </div>
                      )}
                      {event.kpiChange.marketShare && (
                        <div className="flex items-center gap-2 text-xs">
                          <Target className="h-3 w-3 text-blue-600" />
                          <span>Market Share: {event.kpiChange.marketShare > 0 ? '+' : ''}{event.kpiChange.marketShare}%</span>
                        </div>
                      )}
                      {event.kpiChange.satisfaction && (
                        <div className="flex items-center gap-2 text-xs">
                          <Users className="h-3 w-3 text-purple-600" />
                          <span>Satisfaction: {event.kpiChange.satisfaction > 0 ? '+' : ''}{event.kpiChange.satisfaction}%</span>
                        </div>
                      )}
                      {event.kpiChange.awareness && (
                        <div className="flex items-center gap-2 text-xs">
                          <TrendingUp className="h-3 w-3 text-orange-600" />
                          <span>Awareness: {event.kpiChange.awareness > 0 ? '+' : ''}{event.kpiChange.awareness}%</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Your campaign events will appear here as you progress through the simulation.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
