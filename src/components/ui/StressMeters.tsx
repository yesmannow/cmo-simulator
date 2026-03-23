import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Briefcase, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export interface StressMetersProps {
  ceoStress: number; // 0-100 indicating CEO satisfaction/stress (100 = happy)
  cfoStress: number; // 0-100 indicating CFO satisfaction
  cmoStress: number; // 0-100 indicating Team/CMO sanity
}

export function StressMeters({ ceoStress, cfoStress, cmoStress }: StressMetersProps) {
  const getMeterColor = (val: number) => {
    if (val > 70) return 'bg-emerald-500';
    if (val > 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTextColor = (val: number) => {
    if (val > 70) return 'text-emerald-500';
    if (val > 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getStatusText = (val: number) => {
    if (val > 70) return 'Satisfied';
    if (val > 40) return 'Concerned';
    return 'Critical';
  };

  const meters = [
    { label: 'CEO (Growth)', value: ceoStress, icon: <Briefcase className="w-5 h-5" />, desc: 'Focuses on Market Share & Top-line Revenue' },
    { label: 'CFO (Profit)', value: cfoStress, icon: <DollarSign className="w-5 h-5" />, desc: 'Focuses on MROI & CAC Efficiency' },
    { label: 'Team (Burnout)', value: cmoStress, icon: <Users className="w-5 h-5" />, desc: 'Focuses on Workload & Strategy Churn' }
  ];

  return (
    <Card className="w-full bg-slate-900/50 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
          Board of Directors
        </CardTitle>
        <CardDescription>
          Maintain executive alignment. If any meter drops to zero, you risk termination.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {meters.map((meter, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <span className="text-slate-400">{meter.icon}</span>
                {meter.label}
              </div>
              <span className={`font-bold ${getTextColor(meter.value)}`}>
                {getStatusText(meter.value)} ({Math.round(meter.value)}%)
              </span>
            </div>
            {/* Custom Progress Bar to support dynamic colors */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${getMeterColor(meter.value)}`}
                initial={{ width: 0 }}
                animate={{ width: `${meter.value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-slate-500">{meter.desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
