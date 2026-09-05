/**
 * AWS SBG (Student Builder Group) - Sathyabama IST
 * Centralized Spacing, Radius, Shadow & Layout Tokens
 * 
 * Consistent spatial rhythm based on a 4px/8px geometric grid.
 * Enforces uniform padding, max-widths, and elevated layers across all 11 modules.
 */

export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem',  // 96px
} as const;

export const radius = {
  none: '0px',
  sm: '0.25rem',  // 4px - Badges, small inputs
  md: '0.375rem', // 6px - Buttons, standard inputs
  lg: '0.5rem',   // 8px - Cards, dialogs
  xl: '0.75rem',  // 12px - Featured containers (capped to avoid cartoonish curves)
  full: '9999px', // Circular icons, pills
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  md: '0 4px 12px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 12px 30px -4px rgba(0, 0, 0, 0.65), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
} as const;

export const layout = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  },
  sectionSpacing: {
    compact: 'py-8 sm:py-12',
    default: 'py-12 sm:py-16 lg:py-20',
    generous: 'py-16 sm:py-24 lg:py-32',
  },
  pagePadding: {
    x: 'px-4 sm:px-6 lg:px-8',
  },
} as const;

export const motionTokens = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
  },
  ease: {
    standard: [0.2, 0, 0, 1] as const,
    entrance: [0, 0, 0.2, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
  },
} as const;

export type SpacingTokens = typeof spacing;
export type RadiusTokens = typeof radius;
export type ShadowTokens = typeof shadows;
export type LayoutTokens = typeof layout;
