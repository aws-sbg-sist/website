import React, { forwardRef } from 'react';
import { cn } from './utils';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';
export type DividerVariant = 'subtle' | 'strong';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  spacing?: DividerSpacing;
  variant?: DividerVariant;
  label?: React.ReactNode;
}

const spacingStyles: Record<DividerOrientation, Record<DividerSpacing, string>> = {
  horizontal: {
    none: 'my-0',
    sm: 'my-3',
    md: 'my-6',
    lg: 'my-10',
  },
  vertical: {
    none: 'mx-0',
    sm: 'mx-3',
    md: 'mx-6',
    lg: 'mx-10',
  },
};

const variantStyles: Record<DividerVariant, string> = {
  subtle: 'border-[#1E293B]',
  strong: 'border-[#334155]',
};

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      spacing = 'md',
      variant = 'subtle',
      label,
      className,
      ...props
    },
    ref
  ) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn(
            'inline-block h-full self-stretch border-l',
            variantStyles[variant],
            spacingStyles.vertical[spacing],
            className
          )}
          {...props}
        />
      );
    }

    if (label) {
      const textLabel = typeof label === 'string' ? label : undefined;
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          aria-label={props['aria-label'] || textLabel}
          className={cn(
            'flex items-center w-full',
            spacingStyles.horizontal[spacing],
            className
          )}
          {...props}
        >
          <div className={cn('flex-1 border-t', variantStyles[variant])} />
          <span className="px-3 text-xs font-medium uppercase tracking-wider text-[#64748B] select-none">
            {label}
          </span>
          <div className={cn('flex-1 border-t', variantStyles[variant])} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn(
          'w-full border-t border-0',
          variantStyles[variant],
          spacingStyles.horizontal[spacing],
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';