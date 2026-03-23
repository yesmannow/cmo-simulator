'use client';

import * as React from 'react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

interface IconBadgeProps extends VariantProps<typeof badgeVariants> {
  icon: LucideIcon | string | React.ReactNode;
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
  const IconComponent = typeof icon === 'string' ? null : icon;
  const iconElement = typeof icon === 'string' ? (
    <span className={cn(iconSizeClasses[iconSize])}>{icon}</span>
  ) : IconComponent ? (
    <span className={cn(iconSizeClasses[iconSize])}>
      {React.isValidElement(IconComponent) ? IconComponent : React.createElement(IconComponent as any, { className: 'w-full h-full' })}
    </span>
  ) : (
    icon
  );

  return (
    <Badge variant={variant} className={cn('flex items-center gap-1.5', className)} {...(props as any)}>
      {iconPosition === 'left' && iconElement}
      <span>{children}</span>
      {iconPosition === 'right' && iconElement}
    </Badge>
  );
}

