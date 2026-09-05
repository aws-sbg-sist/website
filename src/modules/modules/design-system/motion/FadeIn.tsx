'use client';

import React, { forwardRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/components/ui/utils';

export type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  children: React.ReactNode;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  (
    {
      direction = 'up',
      delay = 0,
      duration = 0.35,
      distance = 12,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();

    const getInitialPosition = () => {
      if (shouldReduceMotion || direction === 'none') {
        return { x: 0, y: 0 };
      }
      switch (direction) {
        case 'up':
          return { x: 0, y: distance };
        case 'down':
          return { x: 0, y: -distance };
        case 'left':
          return { x: distance, y: 0 };
        case 'right':
          return { x: -distance, y: 0 };
        default:
          return { x: 0, y: 0 };
      }
    };

    const initial = {
      opacity: 0,
      ...getInitialPosition(),
    };

    const animate = {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.2, 0, 0, 1],
      },
    };

    return (
      <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

FadeIn.displayName = 'FadeIn';
