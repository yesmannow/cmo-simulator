import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { Cpu, Database, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TechUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: 'cpu' | 'database' | 'zap' | 'shield';
  unlocked: boolean;
}

interface StrategyTechTreeProps {
  upgrades: TechUpgrade[];
  onUnlock: (id: string, cost: number) => void;
  currentBudget: number;
}

export function StrategyTechTree({ upgrades, onUnlock, currentBudget }: StrategyTechTreeProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'cpu': return <Cpu className="w-6 h-6" />;
      case 'database': return <Database className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'shield': return <ShieldCheck className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <Card className="w-full bg-slate-900/50 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
          <span>MarTech Infrastructure</span>
        </CardTitle>
        <CardDescription>Invest in long-term operational multipliers.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgrades.map((tech) => {
          const canAfford = currentBudget >= tech.cost;
          return (
            <motion.div 
              key={tech.id} 
              whileHover={{ scale: 1.02 }} 
              className={`p-4 rounded-xl border transition-colors ${tech.unlocked ? 'bg-indigo-900/30 border-indigo-500/50' : 'bg-slate-800/40 border-slate-700/50'}`}
            >
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-lg flex-shrink-0 ${tech.unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-400'}`}>
                  {getIcon(tech.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold truncate ${tech.unlocked ? 'text-indigo-100' : 'text-slate-200'}`}>{tech.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-3 line-clamp-2">{tech.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-mono ${tech.unlocked ? 'text-indigo-300' : canAfford ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tech.unlocked ? 'Active' : `$${tech.cost.toLocaleString()}`}
                    </span>
                    {!tech.unlocked && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs border-slate-600 hover:bg-slate-700 hover:text-white" 
                        disabled={!canAfford}
                        onClick={() => onUnlock(tech.id, tech.cost)}
                      >
                        Unlock
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
