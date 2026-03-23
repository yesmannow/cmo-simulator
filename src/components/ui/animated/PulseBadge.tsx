'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PulseBadgeProps extends React.ComponentProps<typeof Badge> {
  pulse?: boolean;
}

export function PulseBadge({
  pulse = true,
  className,
  children,
  ...props
}: PulseBadgeProps) {
  return (
    <motion.div
      animate={pulse ? {
        scale: [1, 1.05, 1],
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Badge className={cn('relative', className)} {...props}>
        {children}
        {pulse && (
          <motion.span
            className="absolute inset-0 rounded-full bg-current opacity-20"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.2, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </Badge>
    </motion.div>
  );
}

