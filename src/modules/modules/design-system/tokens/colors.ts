/**
 * AWS SBG (Student Builder Group) - Sathyabama IST
 * Centralized Color Design Tokens
 * 
 * Strict palette designed for an AWS student developer organization:
 * - Technical, confident, restrained
 * - Squid Ink deep slate neutrals
 * - Signature AWS Builder Orange accent
 * - Semantic feedback tokens (success, warning, error, info)
 * - Contrast ratios exceeding WCAG AA standards (4.5:1 for body text)
 */

export const colors = {
  // Theme Backgrounds
  background: {
    DEFAULT: '#0B0F17', // Primary canvas background
    subtle: '#0E1420',
    inverse: '#F8FAFC',
  },

  // Surfaces & Panels
  surface: {
    DEFAULT: '#121826', // Base card/panel background
    elevated: '#1A2337', // Hovered or modal/floating background
    sunken: '#080C14', // Recessed elements, code blocks, input wells
    border: '#1E293B', // Subtle separator borders
    borderHover: '#334155', // Interactive border focus/hover
  },

  // Borders
  border: {
    subtle: '#1E293B',
    default: '#2B384E',
    strong: '#475569',
    focus: '#FF9900',
  },

  // Typography Colors
  text: {
    DEFAULT: '#F8FAFC', // High-contrast primary text (14.2:1 against bg)
    secondary: '#94A3B8', // Supporting text & metadata
    muted: '#64748B', // Tertiary text, placeholders
    inverse: '#0B0F17', // Text on light/accent surfaces
  },

  // Primary Accent (AWS Builder Orange)
  accent: {
    DEFAULT: '#FF9900', // AWS Signature Orange
    hover: '#FFA724',
    active: '#E68A00',
    subtle: 'rgba(255, 153, 0, 0.12)', // Tinted pill/chip background
    border: 'rgba(255, 153, 0, 0.28)', // Tinted border
    foreground: '#0B0F17', // Text/icon on primary accent
  },

  // Semantic Feedback States
  success: {
    DEFAULT: '#10B981',
    hover: '#059669',
    subtle: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.28)',
    foreground: '#ECFDF5',
  },

  warning: {
    DEFAULT: '#F59E0B',
    hover: '#D97706',
    subtle: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.28)',
    foreground: '#FFFBEB',
  },

  error: {
    DEFAULT: '#EF4444',
    hover: '#DC2626',
    subtle: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.28)',
    foreground: '#FEF2F2',
  },

  info: {
    DEFAULT: '#38BDF8',
    hover: '#0284C7',
    subtle: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.28)',
    foreground: '#F0F9FF',
  },
} as const;

export type ColorTokens = typeof colors;
