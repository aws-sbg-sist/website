import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent' | 'error';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FF9900] text-[#0B0F17] hover:bg-[#FFA724] active:bg-[#E68A00] font-semibold shadow-sm focus-visible:outline-[#FF9900]',
  accent:
    'bg-[#FF9900] text-[#0B0F17] hover:bg-[#FFA724] active:bg-[#E68A00] font-semibold shadow-sm focus-visible:outline-[#FF9900]',
  secondary:
    'bg-[#1E293B] text-[#F8FAFC] hover:bg-[#2B384E] active:bg-[#151D2A] border border-[#2B384E] font-medium focus-visible:outline-[#94A3B8]',
  outline:
    'bg-transparent text-[#F8FAFC] border border-[#334155] hover:bg-[#1A2337] hover:border-[#FF9900]/60 active:bg-[#121826] font-medium focus-visible:outline-[#FF9900]',
  ghost:
    'bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/70 active:bg-[#1E293B] font-medium focus-visible:outline-[#94A3B8]',
  danger:
    'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] font-semibold shadow-sm focus-visible:outline-[#EF4444]',
  error:
    'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] font-semibold shadow-sm focus-visible:outline-[#EF4444]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[4px]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[6px]',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-[8px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as: Component = 'button',
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading = false,
      disabled = false,
      fullWidth = false,
      type = 'button',
      className,
      children,
      iconLeft,
      iconRight,
      ...props
    },
    ref
  ) => {
    const isButtonLoading = loading || isLoading;
    const isDisabled = disabled || isButtonLoading;
    const isNativeButton = Component === 'button';

    return (
      <Component
        ref={ref}
        type={isNativeButton ? type : undefined}
        disabled={isNativeButton ? isDisabled : undefined}
        aria-busy={isButtonLoading ? 'true' : undefined}
        aria-disabled={isDisabled ? 'true' : undefined}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center select-none tracking-normal transition-colors duration-150 ease-out whitespace-nowrap',
          // Focus state (WCAG AA compliant, high-contrast outline)
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          // Disabled & Loading
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Mobile touch target minimum
          'min-h-[36px] sm:min-h-0',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isButtonLoading && (
          <Loader2
            className={cn(
              'animate-spin shrink-0',
              size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
            )}
            aria-hidden="true"
          />
        )}
        {!isButtonLoading && iconLeft && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        <span>{children}</span>
        {!isButtonLoading && iconRight && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';
