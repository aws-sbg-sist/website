/**
 * AWS SBG Design System - Motion Language Primitives
 * 
 * Strict motion primitives respecting prefers-reduced-motion.
 * Supports both Framer Motion and Motion library lineages.
 */

export * from './FadeIn';
export * from './Reveal';
export * from './HoverCard';

// Re-export core motion utilities for seamless integration across all 11 modules
export { motion, useReducedMotion, AnimatePresence } from 'motion/react';

// Standardized animation presets for team members
export const motionPresets = {
  transition: {
    instant: { duration: 0.05, ease: 'easeOut' },
    fast: { duration: 0.15, ease: [0.2, 0, 0, 1] },
    normal: { duration: 0.25, ease: [0.2, 0, 0, 1] },
    slow: { duration: 0.4, ease: [0.2, 0, 0, 1] },
  },
  distance: {
    subtle: 8,
    standard: 16,
    prominent: 24,
  },
  scale: {
    hover: 1.01,
    active: 0.985,
  },
} as const;
