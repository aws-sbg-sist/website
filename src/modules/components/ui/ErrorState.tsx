import React, { forwardRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from './utils';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      icon,
      title = 'Something went wrong',
      description = "We couldn't load this content. Please verify your connection and try again.",
      action,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[8px] border border-[#EF4444]/30 bg-[#EF4444]/5',
          className
        )}
        {...props}
      >
        <div
          className="w-12 h-12 rounded-[8px] bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-4 shadow-sm"
          aria-hidden="true"
        >
          {icon || <AlertTriangle className="w-6 h-6" />}
        </div>

        <h3 className="text-lg font-semibold text-[#F8FAFC] tracking-tight mb-1">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-[#94A3B8] max-w-md leading-relaxed mb-6">
            {description}
          </p>
        )}

        {action && <div className="inline-flex items-center">{action}</div>}
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';
