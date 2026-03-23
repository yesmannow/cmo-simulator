"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Target,
  Heart,
  GripVertical,
  X,
  Plus,
  Sparkles
} from "lucide-react";
import { Tactic } from "@/lib/simMachine";
import { TacticDeepDive } from "@/components/education/TacticDeepDive";
import { getTacticEducation } from "@/lib/education/tacticKnowledge";
import { motion } from "framer-motion";

interface TacticCardProps {
  tactic: Tactic;
  onRemove?: () => void;
  onAdd?: () => void;
  isSelected?: boolean;
  isDraggable?: boolean;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
}

export function TacticCard({
  tactic,
  onRemove,
  onAdd,
  isSelected = false,
  isDraggable = false,
  showAddButton = false,
  showRemoveButton = false
}: TacticCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tactic.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const edu = getTacticEducation(tactic.id);

  const getCategoryTheme = (category: Tactic["category"]) => {
    switch (category) {
      case "digital": return "from-blue-400 to-indigo-500 border-blue-500/20";
      case "traditional": return "from-slate-400 to-slate-600 border-slate-500/20";
      case "content": return "from-emerald-400 to-teal-500 border-emerald-500/20";
      case "events": return "from-purple-400 to-violet-500 border-purple-500/20";
      case "partnerships": return "from-amber-400 to-orange-500 border-amber-500/20";
      default: return "from-slate-400 to-slate-500 border-slate-500/20";
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layoutId={tactic.id}
      className={`relative group ${isDragging ? "shadow-2xl" : ""}`}
    >
      <Card className={`bg-slate-900/40 border-white/5 backdrop-blur-xl transition-all duration-300 ${
        isSelected ? "ring-2 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "hover:border-white/10"
      }`}>
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getCategoryTheme(tactic.category)}`} />
        
        {isDraggable && (
          <div
            {...attributes}
            {...listeners}
            className="absolute top-3 left-3 cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-3.5 w-3.5 text-slate-400" />
          </div>
        )}

        {showRemoveButton && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-7 w-7 p-0 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}

        <CardHeader className={`pb-3 pt-6 ${isDraggable ? "pl-10" : ""}`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge className={`bg-white/5 border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400`}>
                {tactic.category}
              </Badge>
              <TacticDeepDive 
                tacticName={tactic.name}
                category={tactic.category}
                description={edu.description}
                strategyTip={edu.strategyTip}
                marketImpact={edu.marketImpact}
              />
            </div>
            <CardTitle className="text-base text-white font-bold leading-tight group-hover:text-blue-400 transition-colors">
              {tactic.name}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Cost and Time */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <DollarSign className="h-3 w-3 text-emerald-400" />
                Budget
              </div>
              <div className="text-sm font-bold text-white">${tactic.cost.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Clock className="h-3 w-3 text-blue-400" />
                Resource
              </div>
              <div className="text-sm font-bold text-white">{tactic.timeRequired}h</div>
            </div>
          </div>

          {/* Core Impacts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>PROJECTED PAYLOAD</span>
              <Sparkles className="w-3 h-3 text-yellow-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <ImpactRow icon={<TrendingUp className="h-3 w-3 text-emerald-400" />} label="Revenue" value={`+$${tactic.expectedImpact.revenue.toLocaleString()}`} />
              <ImpactRow icon={<Target className="h-3 w-3 text-blue-400" />} label="Share" value={`+${tactic.expectedImpact.marketShare}%`} />
              <ImpactRow icon={<Heart className="h-3 w-3 text-rose-400" />} label="Loyalty" value={`+${tactic.expectedImpact.customerSatisfaction}%`} />
              <ImpactRow icon={<Users className="h-3 w-3 text-indigo-400" />} label="Reach" value={`+${tactic.expectedImpact.brandAwareness}%`} />
            </div>
          </div>

          {/* ROI Metric */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency Rating</span>
              <span className="text-xs font-bold text-white">
                {((tactic.expectedImpact.revenue / tactic.cost) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((tactic.expectedImpact.revenue / tactic.cost) * 100) / 3, 100)}%` }}
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>

          {showAddButton && onAdd && (
            <Button
              onClick={onAdd}
              className={`w-full font-bold h-10 rounded-xl transition-all ${
                isSelected 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 text-white"
              }`}
            >
              <Plus className={`h-4 w-4 mr-2 ${isSelected ? "rotate-45" : ""} transition-transform`} />
              {isSelected ? "Active in Plan" : "Add to Strategy"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ImpactRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 overflow-hidden">
        {icon}
        <span className="text-[11px] text-slate-400 font-medium truncate">{label}</span>
      </div>
      <span className="text-xs font-bold text-white whitespace-nowrap">{value}</span>
    </div>
  );
}

export function DraggableTacticCard(props: TacticCardProps) {
  return <TacticCard {...props} isDraggable={true} />;
}
