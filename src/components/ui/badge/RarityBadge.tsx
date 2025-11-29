'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Sparkles, Gem, Star, Circle } from 'lucide-react';

export type RarityType = 'common' | 'rare' | 'epic' | 'legendary';

interface RarityBadgeProps {
  rarity: RarityType;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const rarityConfig: Record<RarityType, {
  icon: typeof Circle;
  className: string;
  iconClassName: string;
  label: string;
}> = {
  common: {
    icon: Circle,
    className: 'bg-gray-500/10 text-gray-700 border-gray-500/20 dark:text-gray-400 dark:bg-gray-500/20',
    iconClassName: 'text-gray-600 dark:text-gray-400',
    label: 'Common',
  },
  rare: {
    icon: Star,
    className: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20',
    iconClassName: 'text-blue-600 dark:text-blue-400',
    label: 'Rare',
  },
  epic: {
    icon: Gem,
    className: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 dark:bg-purple-500/20',
    iconClassName: 'text-purple-600 dark:text-purple-400',
    label: 'Epic',
  },
  legendary: {
    icon: Sparkles,
    className: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20',
    iconClassName: 'text-amber-600 dark:text-amber-400',
    label: 'Legendary',
  },
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-2.5 py-1',
};

export function RarityBadge({
  rarity,
  children,
  className,
  showIcon = true,
  size = 'md',
}: RarityBadgeProps) {
  const config = rarityConfig[rarity];
  const Icon = config.icon;
  const displayText = children || config.label;

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

