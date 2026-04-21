'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Trophy,
  TrendingUp,
  Target,
  Zap,
  DollarSign,
  Award,
  Star
} from 'lucide-react';

export type AchievementCategory =
  | 'Performance'
  | 'Financial'
  | 'Market'
  | 'Strategy'
  | 'Innovation'
  | 'Consistency'
  | 'Mastery';

interface CategoryBadgeProps {
  category: AchievementCategory | string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const categoryConfig: Record<string, {
  icon: typeof Trophy;
  className: string;
  iconClassName: string;
}> = {
  Performance: {
    icon: Trophy,
    className: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 dark:bg-purple-500/20',
    iconClassName: 'text-purple-600 dark:text-purple-400',
  },
  Financial: {
    icon: DollarSign,
    className: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400 dark:bg-green-500/20',
    iconClassName: 'text-green-600 dark:text-green-400',
  },
  Market: {
    icon: TrendingUp,
    className: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20',
    iconClassName: 'text-blue-600 dark:text-blue-400',
  },
  Strategy: {
    icon: Target,
    className: 'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/20',
    iconClassName: 'text-orange-600 dark:text-orange-400',
  },
  Innovation: {
    icon: Zap,
    className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-500/20',
    iconClassName: 'text-yellow-600 dark:text-yellow-400',
  },
  Consistency: {
    icon: Star,
    className: 'bg-pink-500/10 text-pink-700 border-pink-500/20 dark:text-pink-400 dark:bg-pink-500/20',
    iconClassName: 'text-pink-600 dark:text-pink-400',
  },
  Mastery: {
    icon: Award,
    className: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-400 dark:bg-indigo-500/20',
    iconClassName: 'text-indigo-600 dark:text-indigo-400',
  },
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-2.5 py-1',
};

export function CategoryBadge({
  category,
  children,
  className,
  showIcon = true,
  size = 'md',
}: CategoryBadgeProps) {
  const config = categoryConfig[category] || {
    icon: Award,
    className: 'bg-gray-500/10 text-gray-700 border-gray-500/20 dark:text-gray-400 dark:bg-gray-500/20',
    iconClassName: 'text-gray-600 dark:text-gray-400',
  };
  const Icon = config.icon;
  const displayText = children || category;

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 border capitalize',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            config.iconClassName,
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          )}
        />
      )}
      <span>{displayText}</span>
    </Badge>
  );
}
