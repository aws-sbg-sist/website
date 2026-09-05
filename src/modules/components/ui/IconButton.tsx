import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './utils';

export type IconButtonVariant = 'default' | 'primary' | 'outline' | 'ghost' | 'danger' | 'accent' | 'error';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  icon?: React.ReactNode;
  'aria-label': string; // Strictly required for accessibility
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  isLoading?: boolean;
  tooltip?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default:
    'bg-[#1E293B] text-[#F8FAFC] hover:bg-[#2B384E] active:bg-[#151D2A] border border-[#2B384E] focus-visible:outline-[#94A3B8]',
  primary:
    'bg-[#FF9900] text-[#0B0F17] hover:bg-[#FFA724] active:bg-[#E68A00] focus-visible:outline-[#FF9900]',
  accent:
    'bg-[#FF9900] text-[#0B0F17] hover:bg-[#FFA724] active:bg-[#E68A00] focus-visible:outline-[#FF9900]',
  outline:
    'bg-transparent text-[#F8FAFC] border border-[#334155] hover:bg-[#1A2337] hover:border-[#FF9900]/60 active:bg-[#121826] focus-visible:outline-[#FF9900]',
  ghost:
    'bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/70 active:bg-[#1E293B] focus-visible:outline-[#94A3B8]',
  danger:
    'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] focus-visible:outline-[#EF4444]',
  error:
    'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] focus-visible:outline-[#EF4444]',
};

const sizeStyles: Record<IconButtonSize, { button: string; icon: string }> = {
  sm: {
    button: 'w-8 h-8 rounded-[4px] relative after:content-[\'\'] after:absolute after:-inset-1.5 after:min-w-[44px] after:min-h-[44px]',
    icon: '[&>svg]:w-4 [&>svg]:h-4',
  },
  md: {
    button: 'w-10 h-10 rounded-[6px]',
    icon: '[&>svg]:w-5 [&>svg]:h-5',
  },
  lg: {
    button: 'w-12 h-12 rounded-[8px]',
    icon: '[&>svg]:w-6 [&>svg]:h-6',
  },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      as: Component = 'button',
      icon,
      'aria-label': ariaLabel,
      variant = 'default',
      size = 'md',
      loading = false,
      isLoading = false,
      disabled = false,
      type = 'button',
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isButtonLoading = loading || isLoading;
    const isDisabled = disabled || isButtonLoading;
    const isNativeButton = Component === 'button';
    const displayIcon = icon || children;

    return (
      <Component
        ref={ref}
        type={isNativeButton ? type : undefined}
        aria-label={ariaLabel}
        title={tooltip || ariaLabel}
        disabled={isNativeButton ? isDisabled : undefined}
        aria-busy={isButtonLoading ? 'true' : undefined}
        aria-disabled={isDisabled ? 'true' : undefined}
        className={cn(
          // Base
          'inline-flex items-center justify-center shrink-0 transition-colors duration-150 ease-out select-none touch-manipulation',
          // Accessible Focus
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          // Disabled & Loading
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size].button,
          sizeStyles[size].icon,
          className
        )}
        {...props}
      >
        {isButtonLoading ? (
          <Loader2
            className={cn(
              'animate-spin',
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            )}
            aria-hidden="true"
          />
        ) : (
          <span className="inline-flex items-center justify-center" aria-hidden="true">
            {displayIcon}
          </span>
        )}
      </Component>
    );
  }
);

IconButton.displayName = 'IconButton';
