import React, { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from './utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[8px] border border-dashed border-[#2B384E] bg-[#121826]/40',
          className
        )}
        {...props}
      >
        <div
          className="w-12 h-12 rounded-[8px] bg-[#1E293B] border border-[#2B384E] flex items-center justify-center text-[#FF9900] mb-4 shadow-sm"
          aria-hidden="true"
        >
          {icon || <Sparkles className="w-6 h-6" />}
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

EmptyState.displayName = 'EmptyState';
