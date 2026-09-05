/**
 * AWS SBG (Student Builder Group) - Sathyabama IST
 * Centralized Typography Design Tokens
 * 
 * Typographic scale based on clean engineering hierarchy:
 * - High contrast titles, restrained body, clear labels
 * - Standardized line-heights to eliminate layout shifts
 * - Built-in Tailwind utility mappings for easy consumption across all 11 modules
 */

export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  scale: {
    display: {
      fontSize: '2.5rem', // 40px
      lineHeight: '1.2',
      fontWeight: '700',
      letterSpacing: '-0.03em',
      className: 'text-4xl sm:text-5xl font-bold tracking-tight leading-tight',
    },
    h1: {
      fontSize: '2rem', // 32px
      lineHeight: '1.25',
      fontWeight: '700',
      letterSpacing: '-0.025em',
      className: 'text-3xl sm:text-4xl font-bold tracking-tight leading-tight',
    },
    h2: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.3',
      fontWeight: '600',
      letterSpacing: '-0.02em',
      className: 'text-2xl sm:text-3xl font-semibold tracking-tight leading-snug',
    },
    h3: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.4',
      fontWeight: '600',
      letterSpacing: '-0.015em',
      className: 'text-xl sm:text-2xl font-semibold tracking-tight leading-snug',
    },
    h4: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.4',
      fontWeight: '600',
      letterSpacing: '-0.01em',
      className: 'text-lg font-semibold leading-normal',
    },
    'body-large': {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.6',
      fontWeight: '400',
      letterSpacing: '0',
      className: 'text-lg leading-relaxed',
    },
    body: {
      fontSize: '1rem', // 16px (Passes baseline readability)
      lineHeight: '1.6',
      fontWeight: '400',
      letterSpacing: '0',
      className: 'text-base leading-relaxed',
    },
    'body-small': {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0',
      className: 'text-sm leading-normal',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.4',
      fontWeight: '400',
      letterSpacing: '0.01em',
      className: 'text-xs leading-normal',
    },
    label: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1',
      fontWeight: '500',
      letterSpacing: '0.015em',
      className: 'text-sm font-medium leading-none tracking-wide',
    },
  },
} as const;

export type TypographyTokens = typeof typography;
export type TypographyVariant = keyof typeof typography.scale;
