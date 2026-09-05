'use client';

import React, { forwardRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/components/ui/utils';

export interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  lift?: number; // Y translation in pixels (subtle: default 3px)
  scale?: number; // Scale factor (subtle: default 1.01)
  className?: string;
  children: React.ReactNode;
}

export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(
  (
    {
      lift = 3,
      scale = 1.008,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -lift,
                scale: scale,
                transition: { duration: 0.18, ease: [0.2, 0, 0, 1] },
              }
        }
        whileTap={
          shouldReduceMotion
            ? undefined
            : {
                y: 0,
                scale: 0.995,
                transition: { duration: 0.1, ease: [0.2, 0, 0, 1] },
              }
        }
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

HoverCard.displayName = 'HoverCard';
