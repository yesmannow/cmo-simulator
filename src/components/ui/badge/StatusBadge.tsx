'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, XCircle, Loader2 } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'loading';

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400 dark:bg-green-500/20',
    iconClassName: 'text-green-600 dark:text-green-400',
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-500/20',
    iconClassName: 'text-yellow-600 dark:text-yellow-400',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 dark:bg-red-500/20',
    iconClassName: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    className: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20',
    iconClassName: 'text-blue-600 dark:text-blue-400',
  },
  loading: {
    icon: Loader2,
    className: 'bg-gray-500/10 text-gray-700 border-gray-500/20 dark:text-gray-400 dark:bg-gray-500/20',
    iconClassName: 'text-gray-600 dark:text-gray-400',
  },
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-2.5 py-1',
};

export function StatusBadge({
  status,
  children,
  className,
  showIcon = true,
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 border',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            status === 'loading' ? 'animate-spin' : '',
            config.iconClassName,
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          )}
        />
      )}
      <span>{children}</span>
    </Badge>
  );
}

