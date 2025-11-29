'use client';

import { motion } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  ripple?: boolean;
  scaleOnHover?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({
  ripple = true,
  scaleOnHover = true,
  className,
  children,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={scaleOnHover ? { scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Button
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        {children}
        {ripple && (
          <motion.span
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ scale: 0, opacity: 0.5 }}
            whileTap={{
              scale: 4,
              opacity: [0.5, 0],
              transition: { duration: 0.6 }
            }}
          />
        )}
      </Button>
    </motion.div>
  );
}

