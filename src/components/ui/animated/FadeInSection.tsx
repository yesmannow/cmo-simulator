'use client';

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  duration?: number;
  threshold?: number;
}

const directionVariants = {
  up: { y: 50, opacity: 0 },
  down: { y: -50, opacity: 0 },
  left: { x: 50, opacity: 0 },
  right: { x: -50, opacity: 0 },
  fade: { opacity: 0 },
};

const directionAnimate = {
  up: { y: 0, opacity: 1 },
  down: { y: 0, opacity: 1 },
  left: { x: 0, opacity: 1 },
  right: { x: 0, opacity: 1 },
  fade: { opacity: 1 },
};

export function FadeInSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  threshold = 0.1,
}: FadeInSectionProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction]}
      animate={inView ? directionAnimate : directionVariants[direction]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Slide in from left
export function SlideInLeft({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
}: Omit<FadeInSectionProps, 'direction'>) {
  return (
    <FadeInSection
      direction="left"
      delay={delay}
      duration={duration}
      threshold={threshold}
      className={className}
    >
      {children}
    </FadeInSection>
  );
}

// Slide in from right
export function SlideInRight({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
}: Omit<FadeInSectionProps, 'direction'>) {
  return (
    <FadeInSection
      direction="right"
      delay={delay}
      duration={duration}
      threshold={threshold}
      className={className}
    >
      {children}
    </FadeInSection>
  );
}

// Fade in up (alias for convenience)
export function FadeInUp({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
}: Omit<FadeInSectionProps, 'direction'>) {
  return (
    <FadeInSection
      direction="up"
      delay={delay}
      duration={duration}
      threshold={threshold}
      className={className}
    >
      {children}
    </FadeInSection>
  );
}

// Scale in animation
export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  scaleFrom = 0.8,
}: Omit<FadeInSectionProps, 'direction'> & { scaleFrom?: number }) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: scaleFrom, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: scaleFrom, opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Rotate in animation
export function RotateIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  rotation = -10,
}: Omit<FadeInSectionProps, 'direction'> & { rotation?: number }) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ rotate: rotation, opacity: 0 }}
      animate={inView ? { rotate: 0, opacity: 1 } : { rotate: rotation, opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Blur in animation
export function BlurIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
}: Omit<FadeInSectionProps, 'direction'>) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ filter: 'blur(10px)', opacity: 0 }}
      animate={inView ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(10px)', opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: index * staggerDelay,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  );
}

