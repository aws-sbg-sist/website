import React, { forwardRef } from 'react';
import { cn } from './utils';

export type SectionHeaderAlign = 'left' | 'center' | 'right';
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  alignment?: SectionHeaderAlign;
  headingLevel?: HeadingLevel;
}

const alignStyles: Record<SectionHeaderAlign, { container: string; text: string }> = {
  left: {
    container: 'flex-col sm:flex-row sm:items-end justify-between text-left',
    text: 'text-left',
  },
  center: {
    container: 'flex-col items-center justify-center text-center',
    text: 'text-center mx-auto',
  },
  right: {
    container: 'flex-col sm:flex-row-reverse sm:items-end justify-between text-right',
    text: 'text-right ml-auto',
  },
};

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      eyebrow,
      title,
      description,
      action,
      alignment = 'left',
      headingLevel = 'h2',
      className,
      ...props
    },
    ref
  ) => {
    const HeadingTag = headingLevel;

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-4 mb-8 sm:mb-12 w-full',
          alignStyles[alignment].container,
          className
        )}
        {...props}
      >
        <div className={cn('space-y-2 max-w-2xl', alignStyles[alignment].text)}>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FF9900]">
              {eyebrow}
            </p>
          )}
          <HeadingTag className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
            {title}
          </HeadingTag>
          {description && (
            <p className="text-base text-[#94A3B8] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0 pt-2 sm:pt-0">
            {action}
          </div>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';
