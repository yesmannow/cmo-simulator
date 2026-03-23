import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface SonarRadarProps {
  idealPoint: { x: number; y: number };
  brandPosition: { x: number; y: number };
  competitorPositions?: { name: string; x: number; y: number }[];
}

export function SonarRadar({ idealPoint, brandPosition, competitorPositions = [] }: SonarRadarProps) {
  const brandData = [{ name: 'Your Brand', x: brandPosition.x, y: brandPosition.y }];
  const idealData = [{ name: 'Ideal Customer', x: idealPoint.x, y: idealPoint.y }];
  
  const compData = competitorPositions.map(c => ({ name: c.name, x: c.x, y: c.y }));

  return (
    <Card className="w-full bg-slate-900/50 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
          <span>Perceptual Market Map</span>
        </CardTitle>
        <CardDescription>Target the golden 'Ideal Customer' dot to maximize Base Sales.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey="x" name="Price/Value" domain={[0, 100]} stroke="#94a3b8" />
            <YAxis type="number" dataKey="y" name="Quality/Performance" domain={[0, 100]} stroke="#94a3b8" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            {compData.length > 0 && (
              <Scatter name="Competitors" data={compData} fill="#ef4444" />
            )}
            <Scatter name="Ideal Target" data={idealData} fill="#eab308" className="animate-pulse drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
            <Scatter name="Your Brand" data={brandData} fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
