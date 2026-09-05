import React, { forwardRef } from 'react';
import { cn } from './utils';

export type SkeletonShape = 'text' | 'title' | 'avatar' | 'image' | 'card' | 'custom';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
}

const shapeStyles: Record<SkeletonShape, string> = {
  text: 'h-4 w-full rounded-[4px]',
  title: 'h-7 w-2/3 rounded-[4px]',
  avatar: 'w-10 h-10 rounded-full shrink-0',
  image: 'h-48 w-full rounded-[8px]',
  card: 'h-64 w-full rounded-[8px]',
  custom: '',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = 'custom', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'bg-[#1E293B]/70 motion-safe:animate-pulse select-none shrink-0',
          shapeStyles[shape],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
