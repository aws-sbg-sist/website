import React, { forwardRef } from 'react';
import { cn } from './utils';

export type CardVariant = 'default' | 'interactive' | 'elevated' | 'bordered';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  as?: React.ElementType;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-[#121826] border border-[#1E293B] shadow-sm',
  interactive:
    'bg-[#121826] border border-[#1E293B] shadow-sm hover:border-[#FF9900]/50 hover:bg-[#151D2E] transition-all duration-200 cursor-pointer focus-within:border-[#FF9900] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9900]',
  elevated:
    'bg-[#1A2337] border border-[#2B384E] shadow-md hover:border-[#384865]',
  bordered:
    'bg-transparent border border-[#2B384E]',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', as: Component = 'div', className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-[8px] text-[#F8FAFC] overflow-hidden',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-[#1E293B]/70', className)}
        {...props}
      >
        <div className="space-y-1 min-w-0 flex-1">
          {title && (
            <h3 className="font-semibold text-base text-[#F8FAFC] tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-[#94A3B8]">
              {description}
            </p>
          )}
          {children}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('font-semibold text-base text-[#F8FAFC] tracking-tight', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xs text-[#94A3B8]', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-5 sm:p-6', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-5 py-4 sm:px-6 sm:py-4 bg-[#0E1420]/60 border-t border-[#1E293B]/70 flex items-center justify-between gap-3 text-sm text-[#94A3B8]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
