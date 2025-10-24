'use client';

/**
 * Monitoring Dashboard Component
 * Internal dashboard for viewing analytics and performance metrics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { performanceMonitor, PerformanceMetrics } from '@/lib/performance';
import { abTesting } from '@/lib/abTesting';
import { Activity, Zap, TrendingUp, Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isGoodPerformance, setIsGoodPerformance] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getSummary());
      setIsGoodPerformance(performanceMonitor.isPerformanceGood());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatMs = (ms?: number) => {
    if (!ms) return '0 ms';
    return Math.round(ms) + ' ms';
  };

  const getRating = (value: number, good: number, poor: number) => {
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  };

  const experiments = abTesting.getActiveExperiments();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time performance and analytics</p>
        </div>
        <Badge variant={isGoodPerformance ? 'default' : 'destructive'}>
          {isGoodPerformance ? (
            <>
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Good Performance
            </>
          ) : (
            <>
              <AlertCircle className="mr-1 h-3 w-3" />
              Needs Improvement
            </>
          )}
        </Badge>
      </div>

      {/* Core Web Vitals */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Largest Contentful Paint"
          description="LCP measures loading performance"
          value={formatMs(metrics.lcp)}
          rating={metrics.lcp ? getRating(metrics.lcp, 2500, 4000) : 'good'}
          icon={<Zap className="h-4 w-4" />}
          target="< 2.5s"
        />
        <MetricCard
          title="First Input Delay"
          description="FID measures interactivity"
          value={formatMs(metrics.fid)}
          rating={metrics.fid ? getRating(metrics.fid, 100, 300) : 'good'}
          icon={<Activity className="h-4 w-4" />}
          target="< 100ms"
        />
        <MetricCard
          title="Cumulative Layout Shift"
          description="CLS measures visual stability"
          value={metrics.cls?.toFixed(3) || '0'}
          rating={metrics.cls ? getRating(metrics.cls, 0.1, 0.25) : 'good'}
          icon={<TrendingUp className="h-4 w-4" />}
          target="< 0.1"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">First Contentful Paint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMs(metrics.fcp)}</div>
            <p className="text-xs text-muted-foreground">Target: &lt; 1.8s</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Time to First Byte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMs(metrics.ttfb)}</div>
            <p className="text-xs text-muted-foreground">Target: &lt; 800ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMs(metrics.pageLoadTime)}</div>
            <p className="text-xs text-muted-foreground">Total load time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Page Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(metrics.totalSize)}</div>
            <p className="text-xs text-muted-foreground">All resources</p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Breakdown</CardTitle>
          <CardDescription>Size of loaded resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ResourceBar
              label="JavaScript"
              size={metrics.jsSize || 0}
              total={metrics.totalSize || 1}
              color="bg-blue-500"
            />
            <ResourceBar
              label="CSS"
              size={metrics.cssSize || 0}
              total={metrics.totalSize || 1}
              color="bg-purple-500"
            />
            <ResourceBar
              label="Images"
              size={metrics.imageSize || 0}
              total={metrics.totalSize || 1}
              color="bg-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Experiments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active A/B Tests
          </CardTitle>
          <CardDescription>Currently running experiments</CardDescription>
        </CardHeader>
        <CardContent>
          {experiments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active experiments</p>
          ) : (
            <div className="space-y-4">
              {experiments.map(exp => (
                <div key={exp.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{exp.name}</h4>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    </div>
                    <Badge>{exp.traffic_allocation}% traffic</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {exp.variants.map(variant => (
                      <Badge key={variant.id} variant="outline">
                        {variant.name}: {variant.allocation}%
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  description: string;
  value: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  icon: React.ReactNode;
  target: string;
}

function MetricCard({ title, description, value, rating, icon, target }: MetricCardProps) {
  const ratingColors = {
    good: 'bg-green-500',
    'needs-improvement': 'bg-yellow-500',
    poor: 'bg-red-500'
  };

  const ratingLabels = {
    good: 'Good',
    'needs-improvement': 'Needs Improvement',
    poor: 'Poor'
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">Target: {target}</p>
          </div>
          <Badge
            variant="outline"
            className={`${ratingColors[rating]} text-white border-0`}
          >
            {ratingLabels[rating]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResourceBarProps {
  label: string;
  size: number;
  total: number;
  color: string;
}

function ResourceBar({ label, size, total, color }: ResourceBarProps) {
  const percentage = (size / total) * 100;
  const formatBytes = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{formatBytes(size)}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
