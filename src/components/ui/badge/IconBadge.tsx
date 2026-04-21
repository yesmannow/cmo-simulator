'use client';

import * as React from 'react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';

interface IconBadgeProps extends VariantProps<typeof badgeVariants> {
  icon: React.ComponentType<{ className?: string }> | string | React.ReactElement;
  children: React.ReactNode;
  className?: string;
  iconPosition?: 'left' | 'right';
  iconSize?: 'sm' | 'md' | 'lg';
}

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function IconBadge({
  icon,
  children,
  className,
  variant = 'default',
  iconPosition = 'left',
  iconSize = 'md',
  ...props
}: IconBadgeProps) {
  const iconElement = typeof icon === 'string' ? (
    <span className={cn(iconSizeClasses[iconSize])}>{icon}</span>
  ) : React.isValidElement(icon) ? (
    <span className={cn(iconSizeClasses[iconSize])}>{icon}</span>
  ) : (
    <span className={cn(iconSizeClasses[iconSize])}>
      {React.createElement(icon, { className: 'w-full h-full' })}
    </span>
  );

  return (
    <Badge variant={variant} className={cn('flex items-center gap-1.5', className)} {...props}>
      {iconPosition === 'left' && iconElement}
      <span>{children}</span>
      {iconPosition === 'right' && iconElement}
    </Badge>
  );
}
