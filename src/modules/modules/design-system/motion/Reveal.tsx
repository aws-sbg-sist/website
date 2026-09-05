'use client';

import React, { forwardRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/components/ui/utils';

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  amount?: 'some' | 'all' | number;
  className?: string;
  children: React.ReactNode;
}

export const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  (
    {
      delay = 0,
      duration = 0.4,
      distance = 16,
      once = true,
      amount = 0.15,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();

    const initial = {
      opacity: 0,
      y: shouldReduceMotion ? 0 : distance,
    };

    const whileInView = {
      opacity: 1,
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
        whileInView={whileInView}
        viewport={{ once, amount }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Reveal.displayName = 'Reveal';
