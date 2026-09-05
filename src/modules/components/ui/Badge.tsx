import React, { forwardRef } from 'react';
import { cn } from './utils';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-[#1E293B] text-[#E2E8F0] border border-[#334155]',
  accent:
    'bg-[#FF9900]/15 text-[#FFB340] border border-[#FF9900]/35',
  success:
    'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/35',
  warning:
    'bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/35',
  danger:
    'bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/35',
  error:
    'bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/35',
  info:
    'bg-[#38BDF8]/15 text-[#7DD3FC] border border-[#38BDF8]/35',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 text-[11px] font-medium gap-1 rounded-[4px]',
  md: 'h-6 px-2.5 text-xs font-medium gap-1.5 rounded-[4px]',
  lg: 'h-7 px-3 text-sm font-medium gap-1.5 rounded-[6px]',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', icon, children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium tracking-wide whitespace-nowrap select-none transition-colors shrink-0',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && (
          <span className="inline-flex items-center shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';
